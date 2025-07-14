import React, { useState } from 'react';
import {
  Upload,
  Button,
  Table,
  Card,
  Space,
  Input,
  Select,
  Row,
  Col,
  message,
  Progress,
  Tag,
  Tooltip,
  Modal,
  Typography,
  Popconfirm,
} from 'antd';
import {
  UploadOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  FolderOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FileImageOutlined,
  FileZipOutlined,
} from '@ant-design/icons';
import type { UploadProps, ColumnsType } from 'antd/es/table/interface';
import { mockFiles } from '../mock/data';
import { useAuth } from '../hooks/useAuth';

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadTime: string;
  uploader: string;
  status: 'uploading' | 'done' | 'error';
  url?: string;
  progress?: number;
}

/**
 * 文件管理页面
 */
const FileManagement: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  
  const { hasPermission } = useAuth();

  // 获取文件图标
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FilePdfOutlined style={{ color: '#f5222d' }} />;
    if (type.includes('word')) return <FileWordOutlined style={{ color: '#1890ff' }} />;
    if (type.includes('excel') || type.includes('sheet')) return <FileExcelOutlined style={{ color: '#52c41a' }} />;
    if (type.includes('powerpoint') || type.includes('presentation')) return <FilePptOutlined style={{ color: '#fa8c16' }} />;
    if (type.includes('image')) return <FileImageOutlined style={{ color: '#722ed1' }} />;
    if (type.includes('zip') || type.includes('rar')) return <FileZipOutlined style={{ color: '#8c8c8c' }} />;
    return <FileTextOutlined style={{ color: '#595959' }} />;
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 获取文件类型标签
  const getFileTypeTag = (type: string) => {
    if (type.includes('pdf')) return <Tag color="red">PDF</Tag>;
    if (type.includes('word')) return <Tag color="blue">WORD</Tag>;
    if (type.includes('excel') || type.includes('sheet')) return <Tag color="green">EXCEL</Tag>;
    if (type.includes('powerpoint') || type.includes('presentation')) return <Tag color="orange">PPT</Tag>;
    if (type.includes('image')) return <Tag color="purple">图片</Tag>;
    if (type.includes('zip') || type.includes('rar')) return <Tag color="default">压缩包</Tag>;
    return <Tag color="default">其他</Tag>;
  };

  // 过滤文件
  const filteredFiles = files.filter(file => {
    const matchSearch = file.name.toLowerCase().includes(searchText.toLowerCase()) ||
                       file.uploader.toLowerCase().includes(searchText.toLowerCase());
    const matchType = !typeFilter || file.type.includes(typeFilter);
    return matchSearch && matchType;
  });

  // 上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    action: '/api/upload',
    showUploadList: false,
    beforeUpload: (file) => {
      const isValidSize = file.size / 1024 / 1024 < 10; // 10MB限制
      if (!isValidSize) {
        message.error('文件大小不能超过10MB!');
        return false;
      }
      return true;
    },
    onChange: (info) => {
      const { status } = info.file;
      if (status === 'uploading') {
        setUploading(true);
        // 模拟上传进度
        const newFile: FileItem = {
          id: info.file.uid,
          name: info.file.name,
          size: info.file.size || 0,
          type: info.file.type || '',
          uploadTime: new Date().toISOString(),
          uploader: '当前用户',
          status: 'uploading',
          progress: info.file.percent || 0,
        };
        setFiles(prev => [...prev, newFile]);
      } else if (status === 'done') {
        setUploading(false);
        message.success(`${info.file.name} 上传成功!`);
        // 更新文件状态
        setFiles(prev => prev.map(file => 
          file.id === info.file.uid 
            ? { ...file, status: 'done', url: `/files/${file.id}` }
            : file
        ));
      } else if (status === 'error') {
        setUploading(false);
        message.error(`${info.file.name} 上传失败!`);
        // 更新文件状态
        setFiles(prev => prev.map(file => 
          file.id === info.file.uid 
            ? { ...file, status: 'error' }
            : file
        ));
      }
    },
  };

  // 下载文件
  const handleDownload = (file: FileItem) => {
    // 模拟下载
    message.success(`开始下载 ${file.name}`);
    console.log('下载文件:', file);
  };

  // 删除文件
  const handleDelete = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    message.success('文件删除成功');
  };

  // 预览文件
  const handlePreview = (file: FileItem) => {
    setPreviewFile(file);
    setPreviewVisible(true);
  };

  // 批量删除
  const handleBatchDelete = (selectedRowKeys: React.Key[]) => {
    setFiles(prev => prev.filter(file => !selectedRowKeys.includes(file.id)));
    message.success(`成功删除 ${selectedRowKeys.length} 个文件`);
  };

  // 表格列定义
  const columns: ColumnsType<FileItem> = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: FileItem) => (
        <Space>
          {getFileIcon(record.type)}
          <span>{name}</span>
          {record.status === 'uploading' && (
            <Progress
              type="circle"
              size={16}
              percent={record.progress}
              showInfo={false}
            />
          )}
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => getFileTypeTag(type),
      filters: [
        { text: 'PDF', value: 'pdf' },
        { text: 'Word', value: 'word' },
        { text: 'Excel', value: 'excel' },
        { text: 'PowerPoint', value: 'powerpoint' },
        { text: '图片', value: 'image' },
        { text: '压缩包', value: 'zip' },
      ],
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      render: (size: number) => formatFileSize(size),
      sorter: (a, b) => a.size - b.size,
    },
    {
      title: '上传者',
      dataIndex: 'uploader',
      key: 'uploader',
      width: 120,
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
      width: 180,
      render: (time: string) => new Date(time).toLocaleString(),
      sorter: (a, b) => new Date(a.uploadTime).getTime() - new Date(b.uploadTime).getTime(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string, record: FileItem) => {
        if (status === 'uploading') {
          return (
            <div>
              <Tag color="processing">上传中</Tag>
              <Progress percent={record.progress} size="small" />
            </div>
          );
        }
        if (status === 'done') return <Tag color="success">已完成</Tag>;
        if (status === 'error') return <Tag color="error">上传失败</Tag>;
        return <Tag color="default">未知</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record: FileItem) => (
        <Space size="small">
          <Tooltip title="预览">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record)}
              disabled={record.status !== 'done'}
            />
          </Tooltip>
          <Tooltip title="下载">
            <Button
              type="link"
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record)}
              disabled={record.status !== 'done'}
            />
          </Tooltip>
          {hasPermission(['admin', 'manager']) && (
            <Tooltip title="删除">
              <Popconfirm
                title="确定要删除这个文件吗？"
                onConfirm={() => handleDelete(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button
                  type="link"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // 统计数据
  const stats = {
    total: files.length,
    totalSize: files.reduce((sum, file) => sum + file.size, 0),
    uploading: files.filter(f => f.status === 'uploading').length,
    completed: files.filter(f => f.status === 'done').length,
  };

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space>
              <FolderOutlined style={{ fontSize: 24, color: '#1677ff' }} />
              <div>
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>{stats.total}</div>
                <div style={{ color: '#8c8c8c' }}>总文件数</div>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space>
              <FileTextOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <div>
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>{formatFileSize(stats.totalSize)}</div>
                <div style={{ color: '#8c8c8c' }}>总大小</div>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space>
              <UploadOutlined style={{ fontSize: 24, color: '#faad14' }} />
              <div>
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>{stats.uploading}</div>
                <div style={{ color: '#8c8c8c' }}>上传中</div>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space>
              <EyeOutlined style={{ fontSize: 24, color: '#722ed1' }} />
              <div>
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>{stats.completed}</div>
                <div style={{ color: '#8c8c8c' }}>已完成</div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 主要内容 */}
      <Card>
        {/* 工具栏 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8} lg={10}>
            <Search
              placeholder="搜索文件名或上传者"
              allowClear
              onSearch={setSearchText}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={4}>
            <Select
              placeholder="文件类型"
              allowClear
              style={{ width: '100%' }}
              onChange={setTypeFilter}
            >
              <Option value="pdf">PDF</Option>
              <Option value="word">Word</Option>
              <Option value="excel">Excel</Option>
              <Option value="powerpoint">PowerPoint</Option>
              <Option value="image">图片</Option>
              <Option value="zip">压缩包</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={12} lg={10}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Upload {...uploadProps}>
                <Button type="primary" icon={<UploadOutlined />} loading={uploading}>
                  上传文件
                </Button>
              </Upload>
            </div>
          </Col>
        </Row>

        {/* 文件表格 */}
        <Table
          columns={columns}
          dataSource={filteredFiles}
          rowKey="id"
          loading={loading}
          rowSelection={
            hasPermission(['admin', 'manager'])
              ? {
                  type: 'checkbox',
                  onChange: (selectedRowKeys) => {
                    if (selectedRowKeys.length > 0) {
                      // 显示批量操作按钮
                    }
                  },
                }
              : undefined
          }
          pagination={{
            total: filteredFiles.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* 文件预览弹窗 */}
      <Modal
        title={`预览: ${previewFile?.name}`}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="download" icon={<DownloadOutlined />} onClick={() => previewFile && handleDownload(previewFile)}>
            下载
          </Button>,
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {previewFile && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            {getFileIcon(previewFile.type)}
            <div style={{ marginTop: 16 }}>
              <Text strong>{previewFile.name}</Text>
            </div>
            <div style={{ marginTop: 8, color: '#8c8c8c' }}>
              {formatFileSize(previewFile.size)} | {new Date(previewFile.uploadTime).toLocaleString()}
            </div>
            <div style={{ 
              marginTop: 24, 
              padding: 40, 
              background: '#fafafa', 
              border: '1px dashed #d9d9d9',
              borderRadius: 6
            }}>
              <Text type="secondary">文件预览功能开发中...</Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FileManagement; 