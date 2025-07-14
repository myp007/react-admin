import type { User, ChartData, StatisticCard, RoutePermission } from '../types';

// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    name: '超级管理员',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: 'admin',
    status: 'active',
    createdAt: '2023-01-01T00:00:00.000Z',
    lastLogin: '2024-01-15T10:30:00.000Z',
  },
  {
    id: '2',
    username: 'manager01',
    email: 'manager01@example.com',
    name: '部门经理',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager01',
    role: 'manager',
    status: 'active',
    createdAt: '2023-02-15T00:00:00.000Z',
    lastLogin: '2024-01-14T16:45:00.000Z',
  },
  {
    id: '3',
    username: 'user01',
    email: 'user01@example.com',
    name: '普通用户',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user01',
    role: 'user',
    status: 'active',
    createdAt: '2023-03-10T00:00:00.000Z',
    lastLogin: '2024-01-13T09:15:00.000Z',
  },
  {
    id: '4',
    username: 'user02',
    email: 'user02@example.com',
    name: '测试用户',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user02',
    role: 'user',
    status: 'inactive',
    createdAt: '2023-04-20T00:00:00.000Z',
    lastLogin: '2023-12-01T14:20:00.000Z',
  },
  {
    id: '5',
    username: 'manager02',
    email: 'manager02@example.com',
    name: '项目经理',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager02',
    role: 'manager',
    status: 'active',
    createdAt: '2023-05-08T00:00:00.000Z',
    lastLogin: '2024-01-12T11:30:00.000Z',
  },
];

// 模拟登录用户密码（实际项目中不应该这样存储）
export const mockPasswords: Record<string, string> = {
  admin: 'admin123',
  manager01: 'manager123',
  user01: 'user123',
  user02: 'user123',
  manager02: 'manager123',
};

// 模拟统计数据
export const mockStatistics: StatisticCard[] = [
  {
    title: '总用户数',
    value: 12589,
    trend: 'up',
    trendValue: 8.2,
    valueStyle: { color: '#3f8600' },
  },
  {
    title: '活跃用户',
    value: 8965,
    trend: 'up',
    trendValue: 12.5,
    valueStyle: { color: '#1677ff' },
  },
  {
    title: '今日访问',
    value: 2456,
    trend: 'down',
    trendValue: 3.1,
    valueStyle: { color: '#cf1322' },
  },
  {
    title: '月度收入',
    value: '¥128,965',
    trend: 'up',
    trendValue: 15.8,
    valueStyle: { color: '#3f8600' },
  },
];

// 模拟图表数据
export const mockChartData = {
  // 用户增长数据
  userGrowth: [
    { name: '1月', value: 1200 },
    { name: '2月', value: 1800 },
    { name: '3月', value: 2100 },
    { name: '4月', value: 2800 },
    { name: '5月', value: 3200 },
    { name: '6月', value: 3800 },
    { name: '7月', value: 4200 },
    { name: '8月', value: 4600 },
    { name: '9月', value: 5100 },
    { name: '10月', value: 5500 },
    { name: '11月', value: 5900 },
    { name: '12月', value: 6200 },
  ] as ChartData[],

  // 访问来源数据
  visitSource: [
    { name: '直接访问', value: 3520 },
    { name: '搜索引擎', value: 2180 },
    { name: '社交媒体', value: 1240 },
    { name: '广告推广', value: 980 },
    { name: '邮件营销', value: 560 },
  ] as ChartData[],

  // 销售数据
  salesData: [
    { name: '周一', sale: 1200, revenue: 18500 },
    { name: '周二', sale: 1500, revenue: 22800 },
    { name: '周三', sale: 1100, revenue: 16900 },
    { name: '周四', sale: 1800, revenue: 27200 },
    { name: '周五', sale: 2200, revenue: 33500 },
    { name: '周六', sale: 2800, revenue: 42000 },
    { name: '周日', sale: 2100, revenue: 31800 },
    { name: '上周一', sale: 1350, revenue: 20250 },
    { name: '上周二', sale: 1680, revenue: 25200 },
    { name: '上周三', sale: 1450, revenue: 21750 },
    { name: '上周四', sale: 1950, revenue: 29250 },
    { name: '上周五', sale: 2100, revenue: 31500 },
    { name: '上周六', sale: 2650, revenue: 39750 },
    { name: '上周日', sale: 1980, revenue: 29700 },
    { name: '上上周一', sale: 1180, revenue: 17700 },
    { name: '上上周二', sale: 1420, revenue: 21300 },
    { name: '上上周三', sale: 1320, revenue: 19800 },
    { name: '上上周四', sale: 1720, revenue: 25800 },
    { name: '上上周五', sale: 2050, revenue: 30750 },
    { name: '上上周六', sale: 2480, revenue: 37200 },
    { name: '上上周日', sale: 1890, revenue: 28350 },
  ],

  // 地区分布数据
  regionData: [
    { name: '北京', value: 15.2 },
    { name: '上海', value: 12.8 },
    { name: '广州', value: 10.6 },
    { name: '深圳', value: 9.8 },
    { name: '杭州', value: 8.2 },
    { name: '南京', value: 6.5 },
    { name: '武汉', value: 5.8 },
    { name: '成都', value: 5.2 },
    { name: '西安', value: 4.6 },
    { name: '其他', value: 21.3 },
  ] as ChartData[],
};

// 模拟文件数据
export const mockFiles = [
  {
    id: '1',
    name: '系统架构文档.pdf',
    size: 2048576,
    type: 'application/pdf',
    uploadTime: '2024-01-15T10:30:00.000Z',
    uploader: '张三',
    status: 'done',
    url: '/mock/files/1.pdf',
  },
  {
    id: '2',
    name: '用户手册.docx',
    size: 1024000,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadTime: '2024-01-14T16:45:00.000Z',
    uploader: '李四',
    status: 'done',
    url: '/mock/files/2.docx',
  },
  {
    id: '3',
    name: '数据报表.xlsx',
    size: 512000,
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploadTime: '2024-01-13T09:15:00.000Z',
    uploader: '王五',
    status: 'done',
    url: '/mock/files/3.xlsx',
  },
  {
    id: '4',
    name: '产品展示.pptx',
    size: 4096000,
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    uploadTime: '2024-01-12T11:30:00.000Z',
    uploader: '赵六',
    status: 'done',
    url: '/mock/files/4.pptx',
  },
];

// 生成更多模拟用户数据
export const generateMockUsers = (count: number): User[] => {
  const roles: Array<'admin' | 'manager' | 'user'> = ['admin', 'manager', 'user'];
  const statuses: Array<'active' | 'inactive'> = ['active', 'inactive'];
  const names = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十'];
  
  return Array.from({ length: count }, (_, index) => {
    const id = (index + 100).toString();
    const role = roles[Math.floor(Math.random() * roles.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const name = names[Math.floor(Math.random() * names.length)] + id;
    
    return {
      id,
      username: `user${id}`,
      email: `user${id}@example.com`,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${id}`,
      role,
      status,
      createdAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      lastLogin: status === 'active' ? new Date(2024, 0, Math.floor(Math.random() * 15) + 1).toISOString() : undefined,
    };
  });
};

// 路由权限模拟数据
export const routePermissions: RoutePermission[] = [
  {
    id: '1',
    path: '/dashboard',
    name: '仪表盘',
    component: 'Dashboard',
    roles: ['admin', 'manager', 'user'],
    description: '系统概览和统计信息',
    isActive: true,
    order: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    path: '/users',
    name: '用户管理',
    component: 'UserManagement',
    roles: ['admin', 'manager'],
    description: '用户信息查询和管理',
    isActive: true,
    order: 2,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    path: '/reports',
    name: '报表统计',
    component: 'Reports',
    roles: ['admin', 'manager'],
    description: '数据统计和报表查询',
    isActive: true,
    order: 3,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '4',
    path: '/files',
    name: '文件管理',
    component: 'FileManagement',
    roles: ['admin', 'manager', 'user'],
    description: '文件上传和管理',
    isActive: true,
    order: 4,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '5',
    path: '/profile',
    name: '个人资料',
    component: 'Profile',
    roles: ['admin', 'manager', 'user'],
    description: '个人信息管理',
    isActive: true,
    order: 5,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '6',
    path: '/route-permissions',
    name: '路由权限',
    component: 'RoutePermissions',
    roles: ['admin'],
    description: '路由权限配置和管理',
    isActive: true,
    order: 6,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '7',
    path: '/settings',
    name: '系统设置',
    component: 'Settings',
    roles: ['admin'],
    description: '系统参数配置',
    isActive: false,
    order: 7,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
]; 