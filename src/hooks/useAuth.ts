import { useState, useEffect, useCallback } from 'react';
import { Storage } from '../utils/storage';
import { authApi } from '../services/auth';
import type { User, LoginForm, RegisterForm } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * 认证状态管理Hook
 */
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  /**
   * 初始化认证状态
   */
  const initAuth = useCallback(async () => {
    try {
      const token = Storage.getToken();
      if (!token) {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
        return;
      }

      const userInfo = Storage.getUserInfo<User>();
      if (userInfo) {
        setAuthState({
          user: userInfo,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        // 尝试从服务器获取用户信息
        const response = await authApi.getCurrentUser();
        if (response.success) {
          Storage.setUserInfo(response.data);
          setAuthState({
            user: response.data,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          throw new Error('获取用户信息失败');
        }
      }
    } catch (error) {
      console.error('初始化认证状态失败:', error);
      // 清除无效的认证信息
      Storage.removeToken();
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  /**
   * 用户登录
   */
  const login = useCallback(async (loginForm: LoginForm) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await authApi.login(loginForm);
      if (response.success) {
        const { user, token, refreshToken } = response.data;
        
        // 保存认证信息
        Storage.setToken(token);
        Storage.setItem('admin_refresh_token', refreshToken);
        Storage.setUserInfo(user);
        
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });

        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || '登录失败');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      const message = error instanceof Error ? error.message : '登录失败';
      return { success: false, message };
    }
  }, []);

  /**
   * 用户注册
   */
  const register = useCallback(async (registerForm: RegisterForm) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await authApi.register(registerForm);
      if (response.success) {
        const { user, token, refreshToken } = response.data;
        
        // 保存认证信息
        Storage.setToken(token);
        Storage.setItem('admin_refresh_token', refreshToken);
        Storage.setUserInfo(user);
        
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });

        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || '注册失败');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      const message = error instanceof Error ? error.message : '注册失败';
      return { success: false, message };
    }
  }, []);

  /**
   * 用户登出
   */
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('登出请求失败:', error);
    } finally {
      // 无论API调用是否成功，都清除本地认证信息
      Storage.removeToken();
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  /**
   * 检查用户权限
   */
  const hasPermission = useCallback((requiredRoles: string[]) => {
    if (!authState.user) return false;
    return requiredRoles.includes(authState.user.role);
  }, [authState.user]);

  /**
   * 更新用户信息
   */
  const updateUser = useCallback((userInfo: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userInfo };
      Storage.setUserInfo(updatedUser);
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    }
  }, [authState.user]);

  // 组件挂载时初始化认证状态
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return {
    ...authState,
    login,
    register,
    logout,
    hasPermission,
    updateUser,
    initAuth,
  };
}; 