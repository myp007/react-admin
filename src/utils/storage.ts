import { STORAGE_KEYS } from './constants';

/**
 * 本地存储工具类
 */
export class Storage {
  /**
   * 设置存储项
   */
  static setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Failed to set storage item:', error);
    }
  }

  /**
   * 获取存储项
   */
  static getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue ?? null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Failed to get storage item:', error);
      return defaultValue ?? null;
    }
  }

  /**
   * 移除存储项
   */
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove storage item:', error);
    }
  }

  /**
   * 清空所有存储
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  /**
   * 设置认证token
   */
  static setToken(token: string): void {
    this.setItem(STORAGE_KEYS.TOKEN, token);
  }

  /**
   * 获取认证token
   */
  static getToken(): string | null {
    return this.getItem<string>(STORAGE_KEYS.TOKEN);
  }

  /**
   * 移除认证token
   */
  static removeToken(): void {
    this.removeItem(STORAGE_KEYS.TOKEN);
    this.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    this.removeItem(STORAGE_KEYS.USER_INFO);
  }

  /**
   * 设置用户信息
   */
  static setUserInfo(userInfo: Record<string, unknown>): void {
    this.setItem(STORAGE_KEYS.USER_INFO, userInfo);
  }

  /**
   * 获取用户信息
   */
  static getUserInfo<T>(): T | null {
    return this.getItem<T>(STORAGE_KEYS.USER_INFO);
  }
} 