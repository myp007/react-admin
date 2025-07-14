import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Avatar,
  Typography,
  Button,
  Form,
  Input,
  Upload,
  message,
  Tabs,
  List,
  Tag,
  Space,
  Statistic,
  Timeline,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  CameraOutlined,
  LockOutlined,
  BellOutlined,
  HistoryOutlined,
  SettingOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import type { UploadProps } from 'antd';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

/**
 * 个人中心页面
 */
const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [editingBasic, setEditingBasic] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [basicForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // 模拟用户活动记录
  const activities = [
    {
      id: '1',
      action: '登录系统',
      time: '2024-01-15 10:30:00',
      ip: '192.168.1.100',
      device: 'Chrome 浏览器',
    },
    {
      id: '2',
      action: '修改个人信息',
      time: '2024-01-14 16:45:00',
      ip: '192.168.1.100',
      device: 'Chrome 浏览器',
    },
    {
      id: '3',
      action: '查看用户列表',
      time: '2024-01-14 14:20:00',
      ip: '192.168.1.100',
      device: 'Chrome 浏览器',
    },
    {
      id: '4',
      action: '上传文件',
      time: '2024-01-13 09:15:00',
      ip: '192.168.1.101',
      device: 'Edge 浏览器',
    },
  ];

  // 处理头像上传
  const handleAvatarUpload: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // 模拟上传成功
      const newAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
      updateUser({ avatar: newAvatarUrl });
      setLoading(false);
      message.success('头像更新成功');
    } else if (info.file.status === 'error') {
      setLoading(false);
      message.error('头像上传失败');
    }
  };

  // 处理基本信息更新
  const handleBasicInfoUpdate = async (values: Record<string, unknown>) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateUser(values);
      setEditingBasic(false);
      message.success('个人信息更新成功');
    } catch {
      message.error('更新失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理密码修改
  const handlePasswordChange = async (values: Record<string, unknown>) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      passwordForm.resetFields();
      setEditingPassword(false);
      message.success('密码修改成功');
    } catch {
      message.error('密码修改失败');
    } finally {
      setLoading(false);
    }
  };

  // 头像上传配置
  const uploadProps: UploadProps = {
    name: 'avatar',
    action: '/api/upload/avatar',
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('只能上传 JPG/PNG 格式的图片!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小不能超过 2MB!');
        return false;
      }
      return true;
    },
    onChange: handleAvatarUpload,
  };

  return (
    <div>
      <Row gutter={[24, 24]}>
        {/* 左侧个人信息卡片 */}
        <Col xs={24} md={8} lg={8}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  size={120}
                  src={user?.avatar}
                  icon={<UserOutlined />}
                  style={{ marginBottom: 16 }}
                />
                <Upload {...uploadProps}>
                  <Button
                    type="primary"
                    shape="circle"
                    size="small"
                    icon={<CameraOutlined />}
                    loading={loading}
                    style={{
                      position: 'absolute',
                      bottom: 16,
                      right: 0,
                    }}
                  />
                </Upload>
              </div>
              <Title level={4} style={{ margin: '16px 0 8px 0' }}>
                {user?.name}
              </Title>
              <Text type="secondary">@{user?.username}</Text>
              <div style={{ marginTop: 16 }}>
                <Tag color="blue">
                  {user?.role === 'admin' ? '管理员' : user?.role === 'manager' ? '经理' : '用户'}
                </Tag>
                <Tag color={user?.status === 'active' ? 'green' : 'red'}>
                  {user?.status === 'active' ? '活跃' : '非活跃'}
                </Tag>
              </div>
            </div>

            <List
              size="small"
              dataSource={[
                { label: '邮箱', value: user?.email },
                { label: '注册时间', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-' },
                { label: '最后登录', value: user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : '-' },
              ]}
              renderItem={item => (
                <List.Item>
                  <Text type="secondary">{item.label}:</Text>
                  <Text style={{ marginLeft: 8 }}>{item.value}</Text>
                </List.Item>
              )}
            />
          </Card>

          {/* 统计卡片 */}
          <Card title="个人统计" style={{ marginTop: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="登录次数" value={156} />
              </Col>
              <Col span={12}>
                <Statistic title="在线时长" value={240} suffix="小时" />
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Statistic title="创建文件" value={28} />
              </Col>
              <Col span={12}>
                <Statistic title="操作次数" value={892} />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 右侧详细信息 */}
        <Col xs={24} md={16} lg={16}>
          <Card>
            <Tabs defaultActiveKey="basic">
              <TabPane tab={<span><EditOutlined />基本信息</span>} key="basic">
                <div style={{ maxWidth: 600 }}>
                  {!editingBasic ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <Title level={5} style={{ margin: 0 }}>个人资料</Title>
                        <Button type="primary" onClick={() => {
                          setEditingBasic(true);
                          basicForm.setFieldsValue(user);
                        }}>
                          编辑
                        </Button>
                      </div>
                      <List
                        dataSource={[
                          { label: '用户名', value: user?.username },
                          { label: '姓名', value: user?.name },
                          { label: '邮箱', value: user?.email },
                          { label: '角色', value: user?.role === 'admin' ? '管理员' : user?.role === 'manager' ? '经理' : '用户' },
                        ]}
                        renderItem={item => (
                          <List.Item>
                            <List.Item.Meta
                              title={item.label}
                              description={item.value}
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                  ) : (
                    <Form
                      form={basicForm}
                      layout="vertical"
                      onFinish={handleBasicInfoUpdate}
                    >
                      <Form.Item
                        name="name"
                        label="姓名"
                        rules={[
                          { required: true, message: '请输入姓名' },
                          { min: 2, max: 20, message: '姓名长度为2-20个字符' },
                        ]}
                      >
                        <Input placeholder="请输入姓名" />
                      </Form.Item>

                      <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[
                          { required: true, message: '请输入邮箱' },
                          { type: 'email', message: '请输入有效的邮箱地址' },
                        ]}
                      >
                        <Input placeholder="请输入邮箱" />
                      </Form.Item>

                      <Form.Item>
                        <Space>
                          <Button type="primary" htmlType="submit" loading={loading}>
                            保存
                          </Button>
                          <Button onClick={() => setEditingBasic(false)}>
                            取消
                          </Button>
                        </Space>
                      </Form.Item>
                    </Form>
                  )}
                </div>
              </TabPane>

              <TabPane tab={<span><LockOutlined />安全设置</span>} key="security">
                <div style={{ maxWidth: 600 }}>
                  {!editingPassword ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <Title level={5} style={{ margin: 0 }}>密码设置</Title>
                        <Button type="primary" onClick={() => setEditingPassword(true)}>
                          修改密码
                        </Button>
                      </div>
                      <List
                        dataSource={[
                          { label: '登录密码', value: '已设置，上次修改时间：2024-01-01' },
                          { label: '双因素认证', value: '未启用', action: '启用' },
                          { label: '登录通知', value: '已启用', action: '管理' },
                        ]}
                        renderItem={item => (
                          <List.Item
                            actions={item.action ? [<Button type="link" key="action">{item.action}</Button>] : undefined}
                          >
                            <List.Item.Meta
                              title={item.label}
                              description={item.value}
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                  ) : (
                    <Form
                      form={passwordForm}
                      layout="vertical"
                      onFinish={handlePasswordChange}
                    >
                      <Form.Item
                        name="oldPassword"
                        label="当前密码"
                        rules={[{ required: true, message: '请输入当前密码' }]}
                      >
                        <Input.Password
                          placeholder="请输入当前密码"
                          iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                          }
                        />
                      </Form.Item>

                      <Form.Item
                        name="newPassword"
                        label="新密码"
                        rules={[
                          { required: true, message: '请输入新密码' },
                          { min: 6, message: '密码至少6个字符' },
                        ]}
                      >
                        <Input.Password
                          placeholder="请输入新密码"
                          iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                          }
                        />
                      </Form.Item>

                      <Form.Item
                        name="confirmPassword"
                        label="确认新密码"
                        dependencies={['newPassword']}
                        rules={[
                          { required: true, message: '请确认新密码' },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('newPassword') === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error('两次输入的密码不一致'));
                            },
                          }),
                        ]}
                      >
                        <Input.Password
                          placeholder="请确认新密码"
                          iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                          }
                        />
                      </Form.Item>

                      <Form.Item>
                        <Space>
                          <Button type="primary" htmlType="submit" loading={loading}>
                            保存
                          </Button>
                          <Button onClick={() => setEditingPassword(false)}>
                            取消
                          </Button>
                        </Space>
                      </Form.Item>
                    </Form>
                  )}
                </div>
              </TabPane>

              <TabPane tab={<span><BellOutlined />通知设置</span>} key="notifications">
                <div style={{ maxWidth: 600 }}>
                  <Title level={5} style={{ marginBottom: 24 }}>通知偏好</Title>
                  <List
                    dataSource={[
                      { label: '邮件通知', value: '接收系统重要通知', checked: true },
                      { label: '短信通知', value: '接收安全相关通知', checked: false },
                      { label: '浏览器通知', value: '接收实时消息推送', checked: true },
                      { label: '移动推送', value: '接收移动端推送通知', checked: true },
                    ]}
                    renderItem={item => (
                      <List.Item
                        actions={[
                          <Button type="link" key="toggle">
                            {item.checked ? '关闭' : '开启'}
                          </Button>
                        ]}
                      >
                        <List.Item.Meta
                          title={item.label}
                          description={item.value}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </TabPane>

              <TabPane tab={<span><HistoryOutlined />活动记录</span>} key="activities">
                <div>
                  <Title level={5} style={{ marginBottom: 24 }}>最近活动</Title>
                  <Timeline>
                    {activities.map(activity => (
                      <Timeline.Item key={activity.id}>
                        <div>
                          <Text strong>{activity.action}</Text>
                          <div style={{ marginTop: 4 }}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {activity.time} • {activity.ip} • {activity.device}
                            </Text>
                          </div>
                        </div>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile; 