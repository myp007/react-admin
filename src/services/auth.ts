import { Storage } from '../utils/storage';
import { mockUsers, mockPasswords } from '../mock/data';
import type { LoginForm, RegisterForm, AuthResponse, User, ApiResponse } from '../types';

/**
 * 认证服务类
 */
export class AuthService {
  /**
   * 用户登录
   */
  static async login(loginForm: LoginForm): Promise<ApiResponse<AuthResponse>> {
    // 模拟API调用
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { username, password } = loginForm;
        
        // 查找用户
        const user = mockUsers.find(u => u.username === username);
        const expectedPassword = mockPasswords[username];
        
        if (!user) {
          reject(new Error('用户不存在'));
          return;
        }
        
        if (password !== expectedPassword) {
          reject(new Error('密码错误'));
          return;
        }
        
        if (user.status === 'inactive') {
          reject(new Error('账户已被禁用'));
          return;
        }
        
        // 生成模拟token
        const token = `mock_token_${user.id}_${Date.now()}`;
        const refreshToken = `mock_refresh_token_${user.id}_${Date.now()}`;
        
        // 更新最后登录时间
        user.lastLogin = new Date().toISOString();
        
        const authResponse: AuthResponse = {
          user,
          token,
          refreshToken,
        };
        
        resolve({
          success: true,
          data: authResponse,
          message: '登录成功',
        });
      }, 1000); // 模拟网络延迟
    });
  }

  /**
   * 用户注册
   */
  static async register(registerForm: RegisterForm): Promise<ApiResponse<AuthResponse>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { username, email, password, confirmPassword, name } = registerForm;
        
        // 验证密码确认
        if (password !== confirmPassword) {
          reject(new Error('两次输入的密码不一致'));
          return;
        }
        
        // 检查用户名是否已存在
        const existingUser = mockUsers.find(u => u.username === username);
        if (existingUser) {
          reject(new Error('用户名已存在'));
          return;
        }
        
        // 检查邮箱是否已存在
        const existingEmail = mockUsers.find(u => u.email === email);
        if (existingEmail) {
          reject(new Error('邮箱已被注册'));
          return;
        }
        
        // 创建新用户
        const newUser: User = {
          id: (mockUsers.length + 1).toString(),
          username,
          email,
          name,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          role: 'user',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
        
        // 添加到模拟数据
        mockUsers.push(newUser);
        mockPasswords[username] = password;
        
        // 生成token
        const token = `mock_token_${newUser.id}_${Date.now()}`;
        const refreshToken = `mock_refresh_token_${newUser.id}_${Date.now()}`;
        
        const authResponse: AuthResponse = {
          user: newUser,
          token,
          refreshToken,
        };
        
        resolve({
          success: true,
          data: authResponse,
          message: '注册成功',
        });
      }, 1000);
    });
  }

  /**
   * 获取当前用户信息
   */
  static async getCurrentUser(): Promise<ApiResponse<User>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userInfo = Storage.getUserInfo<User>();
        
        if (!userInfo) {
          reject(new Error('用户未登录'));
          return;
        }
        
        resolve({
          success: true,
          data: userInfo,
          message: '获取用户信息成功',
        });
      }, 500);
    });
  }

  /**
   * 刷新token
   */
  static async refreshToken(): Promise<ApiResponse<{ token: string; refreshToken: string }>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userInfo = Storage.getUserInfo<User>();
        const newToken = `mock_token_${userInfo?.id}_${Date.now()}`;
        const newRefreshToken = `mock_refresh_token_${userInfo?.id}_${Date.now()}`;
        
        resolve({
          success: true,
          data: {
            token: newToken,
            refreshToken: newRefreshToken,
          },
          message: '刷新token成功',
        });
      }, 500);
    });
  }

  /**
   * 用户登出
   */
  static async logout(): Promise<ApiResponse<null>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        Storage.removeToken();
        
        resolve({
          success: true,
          data: null,
          message: '登出成功',
        });
      }, 300);
    });
  }

  /**
   * 修改密码
   */
  static async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<null>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userInfo = Storage.getUserInfo<User>();
        
        if (!userInfo) {
          reject(new Error('用户未登录'));
          return;
        }
        
        const currentPassword = mockPasswords[userInfo.username];
        
        if (oldPassword !== currentPassword) {
          reject(new Error('原密码错误'));
          return;
        }
        
        // 更新密码
        mockPasswords[userInfo.username] = newPassword;
        
        resolve({
          success: true,
          data: null,
          message: '密码修改成功',
        });
      }, 800);
    });
  }
}

// 导出便捷的API方法
export const authApi = {
  login: AuthService.login,
  register: AuthService.register,
  getCurrentUser: AuthService.getCurrentUser,
  refreshToken: AuthService.refreshToken,
  logout: AuthService.logout,
  changePassword: AuthService.changePassword,
}; 