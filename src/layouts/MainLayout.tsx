import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Button,
  theme,
  Space,
  Typography,
  Breadcrumb,
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';
import type { MenuItem } from '../types';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

/**
 * 菜单配置
 */
const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    icon: 'DashboardOutlined',
    path: ROUTES.DASHBOARD,
    roles: ['admin', 'manager', 'user'],
  },
  {
    key: 'users',
    label: '用户管理',
    icon: 'UserOutlined',
    path: ROUTES.USERS,
    roles: ['admin', 'manager'],
  },
  {
    key: 'reports',
    label: '报表统计',
    icon: 'BarChartOutlined',
    path: ROUTES.REPORTS,
    roles: ['admin', 'manager', 'user'],
  },
  {
    key: 'files',
    label: '文件管理',
    icon: 'FileTextOutlined',
    path: ROUTES.FILES,
    roles: ['admin', 'manager', 'user'],
  },
  {
    key: 'route-permissions',
    label: '路由权限',
    icon: 'LockOutlined',
    path: ROUTES.ROUTE_PERMISSIONS,
    roles: ['admin'],
  },
];

/**
 * 图标映射
 */
const iconMap: Record<string, React.ComponentType> = {
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined,
  FileTextOutlined,
  LockOutlined,
};

/**
 * 主布局组件
 */
const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  /**
   * 处理菜单点击
   */
  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  /**
   * 处理用户下拉菜单点击
   */
  const handleUserMenuClick = (key: string) => {
    switch (key) {
      case 'profile':
        navigate(ROUTES.PROFILE);
        break;
      case 'settings':
        navigate(ROUTES.SETTINGS);
        break;
      case 'logout':
        handleLogout();
        break;
    }
  };

  /**
   * 处理退出登录
   */
  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  /**
   * 过滤有权限的菜单项
   */
  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || hasPermission(item.roles)
  );

  /**
   * 生成Ant Design菜单项
   */
  const antdMenuItems = filteredMenuItems.map(item => {
    const IconComponent = iconMap[item.icon || ''];
    return {
      key: item.key,
      icon: IconComponent ? React.createElement(IconComponent) : null,
      label: item.label,
      onClick: () => item.path && handleMenuClick(item.path),
    };
  });

  /**
   * 获取当前选中的菜单项
   */
  const selectedKeys = filteredMenuItems
    .filter(item => item.path === location.pathname)
    .map(item => item.key);

  /**
   * 用户下拉菜单
   */
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  /**
   * 生成面包屑
   */
  const getBreadcrumbItems = () => {
    const currentItem = filteredMenuItems.find(item => item.path === location.pathname);
    if (!currentItem) return [];

    return [
      {
        title: '首页',
      },
      {
        title: currentItem.label,
      },
    ];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: colorBgContainer,
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0',
        }}>
          <Title 
            level={4} 
            style={{ 
              margin: 0, 
              color: '#1677ff',
              display: collapsed ? 'none' : 'block'
            }}
          >
            后台管理
          </Title>
          {collapsed && (
            <Title 
              level={4} 
              style={{ 
                margin: 0, 
                color: '#1677ff',
              }}
            >
              后台
            </Title>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          style={{ border: 'none' }}
          items={antdMenuItems}
        />
      </Sider>

      {/* 主内容区 */}
      <Layout>
        {/* 顶部导航 */}
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 40,
                height: 40,
              }}
            />
          </div>

          <Space size="middle">
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{
                fontSize: '16px',
                width: 40,
                height: 40,
              }}
            />
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: ({ key }) => handleUserMenuClick(key),
              }}
              placement="bottomRight"
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '6px',
                transition: 'background-color 0.2s',
              }}>
                <Avatar 
                  src={user?.avatar} 
                  icon={<UserOutlined />}
                  style={{ marginRight: 8 }}
                />
                <span style={{ marginRight: 8 }}>{user?.name}</span>
              </div>
            </Dropdown>
          </Space>
        </Header>

        {/* 内容区 */}
        <Content
          style={{
            margin: '24px',
            minHeight: 280,
          }}
        >
          {/* 面包屑 */}
          <Breadcrumb
            items={getBreadcrumbItems()}
            style={{ marginBottom: 16 }}
          />

          {/* 页面内容 */}
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              minHeight: 'calc(100vh - 168px)',
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 