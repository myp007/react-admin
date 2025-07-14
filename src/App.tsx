/*
 * @Author: m
 * @Date: 2025-07-14 10:40:56
 * @LastEditTime: 2025-07-14 10:54:20
 * @Description: 
 * @FilePath: \antd-demo\src\App.tsx
 */
import React from 'react';
import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import AppRouter from './router';
import { THEME_CONFIG } from './utils/constants';
import './App.css';

// 设置 dayjs 为中文
dayjs.locale('zh-cn');

const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: THEME_CONFIG,
      }}
    >
      <AntdApp>
        <AppRouter />
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
