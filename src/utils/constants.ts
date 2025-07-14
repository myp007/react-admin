// API 基础路径
export const API_BASE_URL = '/api';

// 本地存储键名
export const STORAGE_KEYS = {
  TOKEN: 'admin_token',
  REFRESH_TOKEN: 'admin_refresh_token',
  USER_INFO: 'admin_user_info',
  THEME: 'admin_theme',
  COLLAPSED: 'admin_sidebar_collapsed',
} as const;

// 用户角色
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
} as const;

// 路由路径
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  REPORTS: '/reports',
  FILES: '/files',
  PROFILE: '/profile',
  ROUTE_PERMISSIONS: '/route-permissions',
  SETTINGS: '/settings',
} as const;

// 主题配置
export const THEME_CONFIG = {
  colorPrimary: '#1677ff',
  borderRadius: 6,
  wireframe: false,
};

// 分页配置
export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: ['10', '20', '50', '100'],
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) =>
    `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
};

// 文件上传配置
export const UPLOAD_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  acceptedTypes: {
    image: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    document: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'],
    archive: ['.zip', '.rar', '.7z'],
  },
  baseUrl: '/api/upload',
};

// 图表颜色配置
export const CHART_COLORS = [
  '#1677ff',
  '#52c41a',
  '#faad14',
  '#f5222d',
  '#722ed1',
  '#fa8c16',
  '#13c2c2',
  '#eb2f96',
  '#52c41a',
  '#1890ff',
]; 