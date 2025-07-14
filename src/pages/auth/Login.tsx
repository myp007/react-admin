import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Space,
  message,
  Divider,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import type { LoginForm } from '../../types';

const { Title, Text } = Typography;

/**
 * 登录页面组件
 */
const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  /**
   * 处理表单提交
   */
  const handleSubmit = async (values: LoginForm) => {
    setLoading(true);
    
    try {
      const result = await login(values);
      
      if (result.success) {
        message.success(result.message);
        navigate(ROUTES.DASHBOARD);
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('登录失败:', error);
      message.error('登录过程中发生错误');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 快速登录 - 使用预设账号
   */
  const handleQuickLogin = (username: string, password: string) => {
    form.setFieldsValue({ username, password });
    handleSubmit({ username, password });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <Card
        style={{
          width: 400,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
        }}
        bodyStyle={{ padding: '40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ color: '#1677ff', marginBottom: 8 }}>
            后台管理系统
          </Title>
          <Text type="secondary">请登录您的账户</Text>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名!' },
              { min: 3, message: '用户名至少3个字符!' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码至少6个字符!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <Link to="#" style={{ color: '#1677ff' }}>
                忘记密码?
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ height: 45 }}
            >
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              还没有账户? {' '}
              <Link to={ROUTES.REGISTER} style={{ color: '#1677ff' }}>
                立即注册
              </Link>
            </Text>
          </div>
        </Form>

        <Divider>演示账号</Divider>

        <Space direction="vertical" style={{ width: '100%' }} size="small">
          <Button
            type="link"
            size="small"
            onClick={() => handleQuickLogin('admin', 'admin123')}
            style={{ padding: 0, height: 'auto' }}
          >
            管理员: admin / admin123
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => handleQuickLogin('manager01', 'manager123')}
            style={{ padding: 0, height: 'auto' }}
          >
            经理: manager01 / manager123
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => handleQuickLogin('user01', 'user123')}
            style={{ padding: 0, height: 'auto' }}
          >
            用户: user01 / user123
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Login;