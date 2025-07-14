import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Storage } from '../utils/storage';
import { ROUTES } from '../utils/constants';

// 懒加载组件
const Layout = React.lazy(() => import('../layouts/MainLayout'));
const Login = React.lazy(() => import('../pages/auth/Login'));
const Register = React.lazy(() => import('../pages/auth/Register'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const UserManagement = React.lazy(() => import('../pages/UserManagement'));
const Reports = React.lazy(() => import('../pages/Reports'));
const FileManagement = React.lazy(() => import('../pages/FileManagement'));
const Profile = React.lazy(() => import('../pages/Profile'));
const RoutePermissions = React.lazy(() => import('../pages/RoutePermissions'));

/**
 * 私有路由组件 - 需要登录才能访问
 */
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = Storage.getToken();
  return token ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />;
};

/**
 * 公共路由组件 - 已登录用户不能访问（如登录页面）
 */
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = Storage.getToken();
  return !token ? <>{children}</> : <Navigate to={ROUTES.DASHBOARD} replace />;
};

/**
 * 路由配置
 */
const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '16px'
      }}>
        加载中...
      </div>}>
        <Routes>
          {/* 公共路由 */}
          <Route
            path={ROUTES.LOGIN}
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path={ROUTES.REGISTER}
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* 私有路由 */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path={ROUTES.DASHBOARD.slice(1)} element={<Dashboard />} />
            <Route path={ROUTES.USERS.slice(1)} element={<UserManagement />} />
            <Route path={ROUTES.REPORTS.slice(1)} element={<Reports />} />
            <Route path={ROUTES.FILES.slice(1)} element={<FileManagement />} />
            <Route path={ROUTES.PROFILE.slice(1)} element={<Profile />} />
            <Route path={ROUTES.ROUTE_PERMISSIONS.slice(1)} element={<RoutePermissions />} />
          </Route>

          {/* 404 页面 */}
          <Route
            path="*"
            element={
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                textAlign: 'center'
              }}>
                <h1 style={{ fontSize: '48px', margin: '0 0 16px 0' }}>404</h1>
                <p style={{ fontSize: '16px', margin: '0 0 24px 0' }}>页面不存在</p>
                <a href="/" style={{ color: '#1677ff', textDecoration: 'none' }}>
                  返回首页
                </a>
              </div>
            }
          />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default AppRouter; 