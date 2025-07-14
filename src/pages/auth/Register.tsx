import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  message,
  Steps,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SafetyOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import type { RegisterForm } from '../../types';

const { Title, Text } = Typography;

/**
 * 注册页面组件
 */
const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  /**
   * 处理表单提交
   */
  const handleSubmit = async (values: RegisterForm) => {
    setLoading(true);
    
    try {
      const result = await register(values);
      
      if (result.success) {
        message.success(result.message);
        navigate(ROUTES.DASHBOARD);
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('注册失败:', error);
      message.error('注册过程中发生错误');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理下一步
   */
  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        // 验证基本信息
        await form.validateFields(['username', 'email', 'name']);
        setCurrentStep(1);
      } else if (currentStep === 1) {
        // 验证密码信息并提交
        await form.validateFields(['password', 'confirmPassword']);
        const values = form.getFieldsValue();
        await handleSubmit(values);
      }
    } catch (error) {
      console.error('验证失败:', error);
    }
  };

  /**
   * 处理上一步
   */
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  /**
   * 步骤配置
   */
  const steps = [
    {
      title: '基本信息',
      icon: <UserOutlined />,
    },
    {
      title: '安全设置',
      icon: <SafetyOutlined />,
    },
  ];

  /**
   * 渲染基本信息表单
   */
  const renderBasicForm = () => (
    <>
      <Form.Item
        name="username"
        rules={[
          { required: true, message: '请输入用户名!' },
          { min: 3, max: 20, message: '用户名长度为3-20个字符!' },
          { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线!' },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="用户名（3-20个字符）"
        />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: '请输入邮箱地址!' },
          { type: 'email', message: '请输入有效的邮箱地址!' },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="邮箱地址"
        />
      </Form.Item>

      <Form.Item
        name="name"
        rules={[
          { required: true, message: '请输入真实姓名!' },
          { min: 2, max: 20, message: '姓名长度为2-20个字符!' },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="真实姓名"
        />
      </Form.Item>
    </>
  );

  /**
   * 渲染密码设置表单
   */
  const renderPasswordForm = () => (
    <>
      <Form.Item
        name="password"
        rules={[
          { required: true, message: '请输入密码!' },
          { min: 6, message: '密码至少6个字符!' },
          { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码必须包含字母和数字!' },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="密码（至少6个字符，包含字母和数字）"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: '请确认密码!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不一致!'));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="确认密码"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </Form.Item>
    </>
  );

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
          width: 450,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
        }}
        bodyStyle={{ padding: '40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ color: '#1677ff', marginBottom: 8 }}>
            创建新账户
          </Title>
          <Text type="secondary">请填写注册信息</Text>
        </div>

        <Steps
          current={currentStep}
          items={steps}
          style={{ marginBottom: 32 }}
        />

        <Form
          form={form}
          name="register"
          layout="vertical"
          size="large"
        >
          {currentStep === 0 && renderBasicForm()}
          {currentStep === 1 && renderPasswordForm()}

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginTop: 24 
          }}>
            {currentStep > 0 && (
              <Button onClick={handlePrev}>
                上一步
              </Button>
            )}
            
            <div style={{ marginLeft: 'auto' }}>
              <Button
                type="primary"
                onClick={handleNext}
                loading={loading}
                style={{ minWidth: 100 }}
              >
                {currentStep === 0 ? '下一步' : '完成注册'}
              </Button>
            </div>
          </div>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text type="secondary">
            已有账户? {' '}
            <Link to={ROUTES.LOGIN} style={{ color: '#1677ff' }}>
              立即登录
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Register; 