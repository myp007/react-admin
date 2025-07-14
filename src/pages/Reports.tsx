import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  DatePicker,
  Select,
  Button,
  Space,
  Table,
  Progress,
  Typography,
  Statistic,
  Tag,
} from 'antd';
import {
  DownloadOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import { mockChartData, mockStatistics } from '../mock/data';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

/**
 * 报表统计页面
 */
const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [reportType, setReportType] = useState<string>('overview');

  // 地区销售数据表格列
  const regionColumns = [
    {
      title: '地区',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '销售额占比',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Progress 
            percent={value} 
            size="small" 
            style={{ flex: 1, minWidth: 100 }}
            strokeColor={value > 10 ? '#52c41a' : value > 5 ? '#faad14' : '#ff4d4f'}
          />
          <Text>{value}%</Text>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'value',
      key: 'status',
      render: (value: number) => {
        if (value > 10) return <Tag color="green">优秀</Tag>;
        if (value > 5) return <Tag color="orange">良好</Tag>;
        return <Tag color="red">需改进</Tag>;
      },
    },
  ];

  // 访问来源数据表格列
  const sourceColumns = [
    {
      title: '来源',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '访问量',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => value.toLocaleString(),
             sorter: (a: { value: number }, b: { value: number }) => a.value - b.value,
    },
    {
      title: '占比',
      dataIndex: 'value',
      key: 'percentage',
      render: (value: number) => {
        const total = mockChartData.visitSource.reduce((sum, item) => sum + item.value, 0);
        const percentage = ((value / total) * 100).toFixed(1);
        return `${percentage}%`;
      },
    },
  ];

  // 销售趋势数据表格列
  const trendColumns = [
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
    {
      title: '增长率',
      dataIndex: 'sale',
      key: 'growth',
             render: (value: number, record: { sale: number }, index: number) => {
        if (index === 0) return '-';
        const prevValue = mockChartData.salesData[index - 1]?.sale || 0;
        const growth = ((value - prevValue) / prevValue * 100).toFixed(1);
        const isPositive = parseFloat(growth) >= 0;
        return (
          <Text type={isPositive ? 'success' : 'danger'}>
            {isPositive ? '+' : ''}{growth}%
          </Text>
        );
      },
    },
  ];

  // 处理导出
  const handleExport = (format: string) => {
    console.log(`导出${format}格式报表`);
    // 这里可以调用实际的导出API
  };

  return (
    <div>
      {/* 页面标题和操作栏 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>数据报表</Title>
          <Text type="secondary">数据统计与分析报告</Text>
        </Col>
        <Col>
          <Space>
                         <RangePicker
               value={dateRange}
               onChange={(dates) => {
                 if (dates && dates[0] && dates[1]) {
                   setDateRange([dates[0], dates[1]]);
                 }
               }}
               style={{ width: 240 }}
             />
            <Select
              value={reportType}
              onChange={setReportType}
              style={{ width: 120 }}
            >
              <Option value="overview">概览</Option>
              <Option value="sales">销售</Option>
              <Option value="users">用户</Option>
              <Option value="traffic">流量</Option>
            </Select>
            <Button icon={<DownloadOutlined />} onClick={() => handleExport('excel')}>
              导出Excel
            </Button>
            <Button icon={<PrinterOutlined />} onClick={() => handleExport('pdf')}>
              打印
            </Button>
            <Button icon={<ShareAltOutlined />}>
              分享
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 关键指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {mockStatistics.map((stat) => (
          <Col xs={24} sm={12} md={6} lg={6} key={stat.title}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                precision={typeof stat.value === 'string' ? 0 : stat.precision}
                valueStyle={stat.valueStyle}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
              {stat.trend && (
                <div style={{ marginTop: 8 }}>
                  <Text type={stat.trend === 'up' ? 'success' : 'danger'} style={{ fontSize: '12px' }}>
                    {stat.trend === 'up' ? '↗' : '↘'} {stat.trendValue}%
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px', marginLeft: 8 }}>
                    较上月
                  </Text>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12} lg={12}>
                     <Card 
             title={
               <Space>
                 <BarChartOutlined />
                 用户增长趋势
               </Space>
             }
             extra={<Button type="link" size="small">查看详情</Button>}
           >
             <div style={{ height: 300, padding: '20px 0' }}>
               <div style={{ marginBottom: 16 }}>
                 <Text type="secondary">月度用户增长数据</Text>
               </div>
               <div style={{ display: 'flex', alignItems: 'end', height: 220, gap: 8 }}>
                 {mockChartData.userGrowth.map((item) => {
                   const maxValue = Math.max(...mockChartData.userGrowth.map(d => d.value));
                   const height = (item.value / maxValue) * 180;
                   return (
                     <div key={item.name} style={{ 
                       display: 'flex', 
                       flexDirection: 'column', 
                       alignItems: 'center',
                       flex: 1,
                       minWidth: 0
                     }}>
                       <div style={{
                         backgroundColor: '#1677ff',
                         width: '100%',
                         height: `${height}px`,
                         borderRadius: '2px 2px 0 0',
                         transition: 'all 0.3s',
                         cursor: 'pointer',
                         display: 'flex',
                         alignItems: 'end',
                         justifyContent: 'center',
                         color: 'white',
                         fontSize: '10px',
                         paddingBottom: '4px'
                       }}
                       title={`${item.name}: ${item.value.toLocaleString()}人`}
                       >
                         {item.value > 3000 ? item.value.toLocaleString() : ''}
                       </div>
                       <div style={{ 
                         marginTop: 4, 
                         fontSize: '11px', 
                         color: '#666',
                         textAlign: 'center',
                         width: '100%',
                         overflow: 'hidden',
                         textOverflow: 'ellipsis'
                       }}>
                         {item.name}
                       </div>
                     </div>
                   );
                 })}
               </div>
               <div style={{ 
                 marginTop: 12, 
                 display: 'flex', 
                 justifyContent: 'space-between',
                 fontSize: '11px',
                 color: '#999'
               }}>
                 <span>用户数量 (人)</span>
                 <span>总增长: {mockChartData.userGrowth[mockChartData.userGrowth.length - 1].value.toLocaleString()}</span>
               </div>
             </div>
           </Card>
        </Col>
        <Col xs={24} md={12} lg={12}>
                     <Card 
             title={
               <Space>
                 <PieChartOutlined />
                 访问来源分布
               </Space>
             }
             extra={<Button type="link" size="small">查看详情</Button>}
           >
             <div style={{ height: 300, padding: '20px 0' }}>
               <div style={{ marginBottom: 16 }}>
                 <Text type="secondary">各渠道访问量统计</Text>
               </div>
               <div style={{ display: 'flex', gap: 20, height: 220 }}>
                 {/* 环形图模拟 */}
                 <div style={{ 
                   width: 140, 
                   height: 140, 
                   borderRadius: '50%', 
                   background: `conic-gradient(
                     #1677ff 0deg ${mockChartData.visitSource[0].value / mockChartData.visitSource.reduce((sum, item) => sum + item.value, 0) * 360}deg,
                     #52c41a ${mockChartData.visitSource[0].value / mockChartData.visitSource.reduce((sum, item) => sum + item.value, 0) * 360}deg ${(mockChartData.visitSource[0].value + mockChartData.visitSource[1].value) / mockChartData.visitSource.reduce((sum, item) => sum + item.value, 0) * 360}deg,
                     #faad14 ${(mockChartData.visitSource[0].value + mockChartData.visitSource[1].value) / mockChartData.visitSource.reduce((sum, item) => sum + item.value, 0) * 360}deg ${(mockChartData.visitSource[0].value + mockChartData.visitSource[1].value + mockChartData.visitSource[2].value) / mockChartData.visitSource.reduce((sum, item) => sum + item.value, 0) * 360}deg,
                     #f5222d ${(mockChartData.visitSource[0].value + mockChartData.visitSource[1].value + mockChartData.visitSource[2].value) / mockChartData.visitSource.reduce((sum, item) => sum + item.value, 0) * 360}deg ${(mockChartData.visitSource[0].value + mockChartData.visitSource[1].value + mockChartData.visitSource[2].value + mockChartData.visitSource[3].value) / mockChartData.visitSource.reduce((sum, item) => sum + item.value, 0) * 360}deg,
                     #722ed1 ${(mockChartData.visitSource[0].value + mockChartData.visitSource[1].value + mockChartData.visitSource[2].value + mockChartData.visitSource[3].value) / mockChartData.visitSource.reduce((sum, item) => sum + item.value, 0) * 360}deg 360deg
                   )`,
                   position: 'relative',
                   alignSelf: 'center'
                 }}>
                   <div style={{
                     position: 'absolute',
                     top: '50%',
                     left: '50%',
                     transform: 'translate(-50%, -50%)',
                     width: 60,
                     height: 60,
                     borderRadius: '50%',
                     backgroundColor: 'white',
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center',
                     justifyContent: 'center',
                     fontSize: '10px',
                     color: '#666'
                   }}>
                     <div style={{ fontWeight: 'bold', fontSize: '12px' }}>总访问</div>
                     <div>{mockChartData.visitSource.reduce((sum, item) => sum + item.value, 0).toLocaleString()}</div>
                   </div>
                 </div>
                 
                 {/* 图例 */}
                 <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
                   {mockChartData.visitSource.map((item, index) => {
                     const colors = ['#1677ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'];
                     const total = mockChartData.visitSource.reduce((sum, data) => sum + data.value, 0);
                     const percentage = ((item.value / total) * 100).toFixed(1);
                     return (
                       <div key={item.name} style={{ 
                         display: 'flex', 
                         alignItems: 'center', 
                         gap: 8,
                         padding: '4px 0'
                       }}>
                         <div style={{
                           width: 12,
                           height: 12,
                           borderRadius: 2,
                           backgroundColor: colors[index]
                         }} />
                         <div style={{ flex: 1, fontSize: '12px' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span>{item.name}</span>
                             <span style={{ color: '#666' }}>{percentage}%</span>
                           </div>
                           <div style={{ color: '#999', fontSize: '11px' }}>
                             {item.value.toLocaleString()} 次访问
                           </div>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </div>
             </div>
           </Card>
        </Col>
      </Row>

      {/* 数据表格区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8} lg={8}>
          <Card 
            title="地区销售排行"
            extra={<Button type="link" size="small">查看全部</Button>}
          >
            <Table
              dataSource={mockChartData.regionData}
              columns={regionColumns}
              pagination={false}
              size="small"
              scroll={{ y: 240 }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8} lg={8}>
          <Card 
            title="访问来源统计"
            extra={<Button type="link" size="small">查看全部</Button>}
          >
            <Table
              dataSource={mockChartData.visitSource}
              columns={sourceColumns}
              pagination={false}
              size="small"
              scroll={{ y: 240 }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8} lg={8}>
          <Card 
            title={
              <Space>
                <LineChartOutlined />
                销售趋势
              </Space>
            }
            extra={<Button type="link" size="small">查看全部</Button>}
          >
            <Table
              dataSource={mockChartData.salesData}
              columns={trendColumns}
              pagination={false}
              size="small"
              scroll={{ y: 240 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 报表说明 */}
      <Card title="报表说明" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div>
              <Title level={5}>数据来源</Title>
              <ul style={{ paddingLeft: 20 }}>
                <li>用户数据来源于系统注册统计</li>
                <li>访问数据来源于网站访问日志</li>
                <li>销售数据来源于订单系统</li>
                <li>收入数据来源于财务系统</li>
              </ul>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div>
              <Title level={5}>更新频率</Title>
              <ul style={{ paddingLeft: 20 }}>
                <li>实时数据：每5分钟更新一次</li>
                <li>日统计：每日凌晨2点更新</li>
                <li>月统计：每月1号更新</li>
                <li>年统计：每年1月1号更新</li>
              </ul>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Reports; 