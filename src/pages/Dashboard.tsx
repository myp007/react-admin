import React from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  List,
  Avatar,
  Typography,
  Space,
  Tag,
  Table,
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { mockStatistics, mockChartData } from '../mock/data';
import { useAuth } from '../hooks/useAuth';

const { Title, Text } = Typography;

/**
 * 仪表盘页面
 */
const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // 最近活动数据
  const recentActivities = [
    {
      id: '1',
      user: '张三',
      action: '登录系统',
      time: '2分钟前',
      type: 'login',
    },
    {
      id: '2',
      user: '李四',
      action: '更新用户信息',
      time: '5分钟前',
      type: 'update',
    },
    {
      id: '3',
      user: '王五',
      action: '上传文件',
      time: '10分钟前',
      type: 'upload',
    },
    {
      id: '4',
      user: '赵六',
      action: '查看报表',
      time: '15分钟前',
      type: 'view',
    },
  ];

  // 系统状态数据
  const systemStatus = [
    { name: 'CPU使用率', value: 68, status: 'normal' },
    { name: '内存使用率', value: 82, status: 'warning' },
    { name: '磁盘使用率', value: 45, status: 'normal' },
    { name: '网络流量', value: 92, status: 'error' },
  ];

  // 获取进度条颜色
  const getProgressColor = (status: string) => {
    switch (status) {
      case 'normal':
        return '#52c41a';
      case 'warning':
        return '#faad14';
      case 'error':
        return '#f5222d';
      default:
        return '#1677ff';
    }
  };

  // 获取活动类型图标
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <UserOutlined style={{ color: '#52c41a' }} />;
      case 'update':
        return <ShoppingCartOutlined style={{ color: '#1677ff' }} />;
      case 'upload':
        return <DollarOutlined style={{ color: '#faad14' }} />;
      case 'view':
        return <EyeOutlined style={{ color: '#722ed1' }} />;
      default:
        return <UserOutlined />;
    }
  };

  // 销售数据表格列
  const salesColumns = [
    {
      title: '日期',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '销售量',
      dataIndex: 'sale',
      key: 'sale',
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '收入',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
  ];

  return (
    <div>
      {/* 欢迎信息 */}
      <Card style={{ marginBottom: 24 }}>
        <Row align="middle" gutter={16}>
          <Col span={2}>
            <Avatar size={64} src={user?.avatar} icon={<UserOutlined />} />
          </Col>
          <Col span={14}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Title level={3} style={{ margin: 0, marginBottom: 8 }}>
                欢迎回来，{user?.name}！
              </Title>
              <Text type="secondary">
                今天是个美好的一天，开始您的工作吧！
              </Text>
            </div>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Space direction="vertical" align="end">
              <Tag color="blue">{user?.role === 'admin' ? '管理员' : user?.role === 'manager' ? '经理' : '用户'}</Tag>
              <Text type="secondary">上次登录：{new Date().toLocaleString()}</Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {mockStatistics.map((stat, index) => (
          <Col xs={24} sm={12} md={6} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                precision={typeof stat.value === 'string' ? 0 : stat.precision}
                valueStyle={stat.valueStyle}
                prefix={stat.prefix}
                suffix={
                  stat.trend && (
                    <span style={{ fontSize: '14px', marginLeft: 8 }}>
                      {stat.trend === 'up' ? (
                        <ArrowUpOutlined style={{ color: '#3f8600' }} />
                      ) : (
                        <ArrowDownOutlined style={{ color: '#cf1322' }} />
                      )}
                      {stat.trendValue}%
                    </span>
                  )
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* 系统状态 */}
        <Col xs={24} md={8} lg={8}>
          <Card title="系统状态" style={{ height: 400 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {systemStatus.map((status, index) => (
                <div key={index}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: 8 
                  }}>
                    <Text>{status.name}</Text>
                    <Text strong>{status.value}%</Text>
                  </div>
                  <Progress
                    percent={status.value}
                    strokeColor={getProgressColor(status.status)}
                    showInfo={false}
                  />
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        {/* 最近活动 */}
        <Col xs={24} md={8} lg={8}>
          <Card title="最近活动" style={{ height: 400 }}>
            <div style={{ 
              height: 320, 
              overflowY: 'auto',
              overflowX: 'hidden'
            }}>
              <List
                dataSource={recentActivities}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={getActivityIcon(item.type)} />}
                      title={item.user}
                      description={
                        <Space direction="vertical" size={2}>
                          <Text>{item.action}</Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {item.time}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </Col>

        {/* 销售数据 */}
        <Col xs={24} md={8} lg={8}>
          <Card title="本周销售" style={{ height: 400 }}>
            <div style={{ 
              height: 320, 
              overflowY: 'auto',
              overflowX: 'hidden'
            }}>
              <Table
                dataSource={mockChartData.salesData}
                columns={salesColumns}
                pagination={false}
                size="small"
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 快速操作 */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="快速操作">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  style={{ textAlign: 'center' }}
                  bodyStyle={{ padding: '24px 12px' }}
                >
                  <UserOutlined style={{ fontSize: 32, color: '#1677ff', marginBottom: 16 }} />
                  <div>用户管理</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  style={{ textAlign: 'center' }}
                  bodyStyle={{ padding: '24px 12px' }}
                >
                  <ShoppingCartOutlined style={{ fontSize: 32, color: '#52c41a', marginBottom: 16 }} />
                  <div>订单管理</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  style={{ textAlign: 'center' }}
                  bodyStyle={{ padding: '24px 12px' }}
                >
                  <DollarOutlined style={{ fontSize: 32, color: '#faad14', marginBottom: 16 }} />
                  <div>财务报表</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  style={{ textAlign: 'center' }}
                  bodyStyle={{ padding: '24px 12px' }}
                >
                  <EyeOutlined style={{ fontSize: 32, color: '#722ed1', marginBottom: 16 }} />
                  <div>数据分析</div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 