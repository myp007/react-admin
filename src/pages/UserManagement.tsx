import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Avatar,
  Modal,
  Form,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { mockUsers, generateMockUsers } from '../mock/data';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../types';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

/**
 * 用户管理页面
 */
const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  
  const { hasPermission } = useAuth();
  const [form] = Form.useForm();

  // 模拟获取用户数据
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 合并预设用户和生成的用户
      const allUsers = [...mockUsers, ...generateMockUsers(50)];
      
      // 应用过滤条件
      let filteredUsers = allUsers;
      
      if (searchText) {
        filteredUsers = filteredUsers.filter(user =>
          user.name.toLowerCase().includes(searchText.toLowerCase()) ||
          user.username.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      
      if (roleFilter) {
        filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
      }
      
      if (statusFilter) {
        filteredUsers = filteredUsers.filter(user => user.status === statusFilter);
      }
      
      // 分页处理
      const { current, pageSize } = pagination;
      const startIndex = (current - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      
      setUsers(paginatedUsers);
      setPagination(prev => ({ ...prev, total: filteredUsers.length }));
    } catch {
      message.error('获取用户数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchUsers();
  }, [searchText, roleFilter, statusFilter, pagination.current, pagination.pageSize]);

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // 处理过滤
  const handleFilter = (type: 'role' | 'status', value: string) => {
    if (type === 'role') {
      setRoleFilter(value);
    } else {
      setStatusFilter(value);
    }
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // 处理新增用户
  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 处理编辑用户
  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  // 处理删除用户
  const handleDelete = async () => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      message.success('删除成功');
      fetchUsers();
    } catch {
      message.error('删除失败');
    }
  };

  // 处理表单提交
  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingUser) {
        message.success('更新成功');
      } else {
        message.success('添加成功');
      }
      
      setModalVisible(false);
      fetchUsers();
    } catch {
      message.error('操作失败');
    }
  };

  // 处理导出
  const handleExport = () => {
    message.info('导出功能开发中...');
  };

  // 表格列定义
  const columns: ColumnsType<User> = [
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar: string) => (
        <Avatar src={avatar} icon={<UserOutlined />} />
      ),
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: '管理员', value: 'admin' },
        { text: '经理', value: 'manager' },
        { text: '用户', value: 'user' },
      ],
      render: (role: string) => {
        const colors = {
          admin: 'red',
          manager: 'blue',
          user: 'green',
        };
        const labels = {
          admin: '管理员',
          manager: '经理',
          user: '用户',
        };
        return <Tag color={colors[role as keyof typeof colors]}>{labels[role as keyof typeof labels]}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: '活跃', value: 'active' },
        { text: '非活跃', value: 'inactive' },
      ],
      render: (status: string) => {
        const config = {
          active: { color: 'success', text: '活跃' },
          inactive: { color: 'default', text: '非活跃' },
        };
        return <Tag color={config[status as keyof typeof config]?.color}>{config[status as keyof typeof config]?.text}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date?: string) => date ? new Date(date).toLocaleString() : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record: User) => (
        <Space size="small">
          {hasPermission(['admin', 'manager']) && (
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
          )}
          {hasPermission(['admin']) && (
            <Popconfirm
              title="确定要删除这个用户吗？"
              onConfirm={handleDelete}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
              >
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // 统计数据
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admin: users.filter(u => u.role === 'admin').length,
    manager: users.filter(u => u.role === 'manager').length,
  };

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="总用户数" value={stats.total} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="活跃用户" value={stats.active} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="管理员" value={stats.admin} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="经理" value={stats.manager} />
          </Card>
        </Col>
      </Row>

      {/* 主要内容 */}
      <Card>
        {/* 工具栏 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input.Search
              placeholder="搜索用户名、姓名或邮箱"
              allowClear
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Select
              placeholder="角色"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilter('role', value || '')}
            >
              <Option value="admin">管理员</Option>
              <Option value="manager">经理</Option>
              <Option value="user">用户</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Select
              placeholder="状态"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilter('status', value || '')}
            >
              <Option value="active">活跃</Option>
              <Option value="inactive">非活跃</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8} lg={12}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button icon={<ReloadOutlined />} onClick={fetchUsers}>
                刷新
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                导出
              </Button>
              {hasPermission(['admin', 'manager']) && (
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  新增用户
                </Button>
              )}
            </div>
          </Col>
        </Row>

        {/* 用户表格 */}
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({ ...prev, current: page, pageSize: pageSize || 10 }));
            },
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* 新增/编辑用户弹窗 */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, max: 20, message: '用户名长度为3-20个字符' },
                ]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
            </Col>
            <Col span={12}>
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
            </Col>
          </Row>

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

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Select placeholder="请选择角色">
                  <Option value="admin">管理员</Option>
                  <Option value="manager">经理</Option>
                  <Option value="user">用户</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="active">活跃</Option>
                  <Option value="inactive">非活跃</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;