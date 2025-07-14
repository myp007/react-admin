import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  InputNumber,
  Space,
  Tag,
  Popconfirm,
  message,
  Typography,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import type { RoutePermission } from '../types';
import { routePermissions } from '../mock/data';

const { Title, Text } = Typography;
const { Option } = Select;

const RoutePermissions: React.FC = () => {
  const [permissions, setPermissions] = useState<RoutePermission[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPermission, setEditingPermission] = useState<RoutePermission | null>(null);
  const [form] = Form.useForm();

  // 初始化数据
  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      setPermissions(routePermissions);
    } catch {
      message.error('获取路由权限失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingPermission(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: RoutePermission) => {
    setEditingPermission(record);
    form.setFieldsValue({
      ...record,
      roles: record.roles,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 300));
      setPermissions(prev => prev.filter(p => p.id !== id));
      message.success('删除成功');
    } catch {
      message.error('删除失败');
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 300));
      setPermissions(prev =>
        prev.map(p =>
          p.id === id
            ? { ...p, isActive, updatedAt: new Date().toISOString() }
            : p
        )
      );
      message.success(`已${isActive ? '启用' : '禁用'}该路由`);
    } catch {
      message.error('操作失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingPermission) {
        // 编辑
        const updatedPermission: RoutePermission = {
          ...editingPermission,
          ...values,
          updatedAt: new Date().toISOString(),
        };
        setPermissions(prev =>
          prev.map(p => (p.id === editingPermission.id ? updatedPermission : p))
        );
        message.success('更新成功');
      } else {
        // 新增
        const newPermission: RoutePermission = {
          id: Date.now().toString(),
          ...values,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setPermissions(prev => [...prev, newPermission]);
        message.success('创建成功');
      }
      
      setIsModalVisible(false);
    } catch {
      // 表单验证失败
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'red',
      manager: 'blue',
      user: 'green',
    };
    return colors[role] || 'default';
  };

  const columns = [
    {
      title: '路由路径',
      dataIndex: 'path',
      key: 'path',
      width: 150,
      render: (path: string) => <Text code>{path}</Text>,
    },
    {
      title: '路由名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '组件',
      dataIndex: 'component',
      key: 'component',
      width: 120,
      render: (component: string) => <Text type="secondary">{component}</Text>,
    },
    {
      title: '允许角色',
      dataIndex: 'roles',
      key: 'roles',
      width: 150,
      render: (roles: string[]) => (
        <Space wrap>
          {roles.map(role => (
            <Tag key={role} color={getRoleColor(role)}>
              {role === 'admin' ? '管理员' : role === 'manager' ? '经理' : '用户'}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '排序',
      dataIndex: 'order',
      key: 'order',
      width: 80,
      sorter: (a: RoutePermission, b: RoutePermission) => a.order - b.order,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean, record: RoutePermission) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleStatus(record.id, checked)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: unknown, record: RoutePermission) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个路由权限吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 统计数据
  const totalPermissions = permissions.length;
  const activePermissions = permissions.filter(p => p.isActive).length;
  const adminOnlyPermissions = permissions.filter(p => p.roles.includes('admin') && p.roles.length === 1).length;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>路由权限管理</Title>
        <Text type="secondary">管理系统路由的访问权限配置</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总路由数"
              value={totalPermissions}
              prefix={<LockOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已启用"
              value={activePermissions}
              prefix={<UnlockOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已禁用"
              value={totalPermissions - activePermissions}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="仅管理员"
              value={adminOnlyPermissions}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增路由权限
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchPermissions}
              loading={loading}
            >
              刷新
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={permissions}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingPermission ? '编辑路由权限' : '新增路由权限'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            isActive: true,
            order: 1,
            roles: ['user'],
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="path"
                label="路由路径"
                rules={[
                  { required: true, message: '请输入路由路径' },
                  { pattern: /^\/.*/, message: '路由路径必须以/开头' },
                ]}
              >
                <Input placeholder="如: /dashboard" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="路由名称"
                rules={[{ required: true, message: '请输入路由名称' }]}
              >
                <Input placeholder="如: 仪表盘" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="component"
                label="组件名称"
                rules={[{ required: true, message: '请输入组件名称' }]}
              >
                <Input placeholder="如: Dashboard" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="order"
                label="排序"
                rules={[{ required: true, message: '请输入排序值' }]}
              >
                <InputNumber min={1} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="roles"
            label="允许访问的角色"
            rules={[{ required: true, message: '请选择至少一个角色' }]}
          >
            <Select
              mode="multiple"
              placeholder="选择角色"
              style={{ width: '100%' }}
            >
              <Option value="admin">管理员</Option>
              <Option value="manager">经理</Option>
              <Option value="user">用户</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea rows={3} placeholder="输入路由描述..." />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="启用状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoutePermissions; 