// 用户相关类型
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user' | 'manager';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

// 登录相关类型
export interface LoginForm {
  username: string;
  password: string;
  remember?: boolean;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// 路由权限类型
export interface RoutePermission {
  id: string;
  path: string;
  name: string;
  component: string;
  roles: string[];
  description?: string;
  isActive: boolean;
  parentPath?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// 菜单类型
export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
  roles?: string[];
}

// 分页类型
export interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// API响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  code?: number;
}

// 报表数据类型
export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface StatisticCard {
  title: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  precision?: number;
  valueStyle?: React.CSSProperties;
  trend?: 'up' | 'down';
  trendValue?: number;
}

// 文件上传类型
export interface UploadFile {
  uid: string;
  name: string;
  status: 'uploading' | 'done' | 'error' | 'removed';
  url?: string;
  size?: number;
  type?: string;
  response?: Record<string, unknown>;
}

// 表单字段类型
export interface FormField {
  name: string;
  label: string;
  type: 'input' | 'select' | 'textarea' | 'number' | 'date' | 'switch' | 'upload';
  required?: boolean;
  options?: { label: string; value: string | number }[];
  rules?: Record<string, unknown>[];
  placeholder?: string;
}

// 表格列类型
export interface TableColumn {
  title: string;
  dataIndex: string;
  key: string;
  width?: number;
  sorter?: boolean;
  filters?: { text: string; value: string }[];
  render?: (value: unknown, record: Record<string, unknown>) => React.ReactNode;
} 