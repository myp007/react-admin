import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';
import { Storage } from './storage';
import { API_BASE_URL } from './constants';
import type { ApiResponse } from '../types';

/**
 * 创建axios实例
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      const token = Storage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      const { data } = response;
      
      if (data.success) {
        return response;
      } else {
        message.error(data.message || '请求失败');
        return Promise.reject(new Error(data.message || '请求失败'));
      }
    },
    (error) => {
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 401:
            message.error('登录已过期，请重新登录');
            Storage.removeToken();
            window.location.href = '/login';
            break;
          case 403:
            message.error('没有权限访问该资源');
            break;
          case 404:
            message.error('请求的资源不存在');
            break;
          case 500:
            message.error('服务器内部错误');
            break;
          default:
            message.error(data?.message || '网络错误，请稍后重试');
        }
      } else if (error.request) {
        message.error('网络连接失败，请检查网络');
      } else {
        message.error('请求配置错误');
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

// 创建请求实例
const request = createAxiosInstance();

/**
 * 通用请求方法
 */
export const http = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    request.get(url, config).then(res => res.data),

  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    request.post(url, data, config).then(res => res.data),

  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    request.put(url, data, config).then(res => res.data),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    request.delete(url, config).then(res => res.data),

  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    request.patch(url, data, config).then(res => res.data),

  upload: <T = unknown>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    request.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    }).then(res => res.data),
};

export default request; 