# 前端执行计划 - 模块05：工单管理模块

**模块名称**: 工单管理模块 (Ticket Management)
**优先级**: P0 - 核心功能
**依赖**: 认证布局模块
**预计工作量**: 中等
**负责人**: Frontend Developer

---

## 1. 模块概述

实现工单的创建、列表查看、详情展示功能。

### 核心功能
- 工单列表（分页、筛选、排序）
- 创建工单表单
- 工单详情页面
- 工单状态更新

---

## 2. 实现文件清单

- `src/features/ticket/TicketList.tsx` - 工单列表
- `src/features/ticket/CreateTicket.tsx` - 创建工单
- `src/features/ticket/TicketDetail.tsx` - 工单详情
- `src/features/ticket/TicketPage.tsx` - 主页面

---

## 3. 详细任务列表

### 任务3.1: 创建工单列表组件
**文件**: `src/features/ticket/TicketList.tsx`

**实现内容**:
```typescript
import { Table, Tag, Button, Space, Input, Select } from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/services/apiClient';

interface Ticket {
  id: number;
  ticket_id: string;
  title: string;
  description: string;
  status: 'pending' | 'analyzing' | 'completed';
  created_at: string;
  updated_at: string;
}

export const TicketList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [status, setStatus] = useState<string | undefined>();
  const [keyword, setKeyword] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['tickets', page, pageSize, status, keyword],
    queryFn: () => apiClient.get('/api/v1/tickets', {
      params: { page, page_size: pageSize, status, keyword }
    })
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'orange',
      analyzing: 'blue',
      completed: 'green'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: '待处理',
      analyzing: '分析中',
      completed: '已完成'
    };
    return texts[status] || status;
  };

  const columns = [
    {
      title: '工单ID',
      dataIndex: 'ticket_id',
      key: 'ticket_id',
      width: 150,
      render: (text: string) => (
        <span className="font-mono text-blue-600">{text}</span>
      )
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: Ticket) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/tickets/${record.id}`)}
          >
            查看
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* 筛选栏 */}
      <div className="flex gap-4">
        <Input
          placeholder="搜索工单ID或标题"
          prefix={<SearchOutlined />}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        <Select
          placeholder="状态筛选"
          value={status}
          onChange={setStatus}
          style={{ width: 150 }}
          allowClear
        >
          <Select.Option value="pending">待处理</Select.Option>
          <Select.Option value="analyzing">分析中</Select.Option>
          <Select.Option value="completed">已完成</Select.Option>
        </Select>
        <Button
          type="primary"
          onClick={() => navigate('/tickets/create')}
        >
          创建工单
        </Button>
      </div>

      {/* 表格 */}
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data?.data.items || []}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: data?.data.total || 0,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          }
        }}
      />
    </div>
  );
};
```

**验收标准**:
- [ ] 显示工单列表
- [ ] 支持分页
- [ ] 支持状态筛选
- [ ] 支持关键词搜索
- [ ] 点击查看跳转详情页

---

### 任务3.2: 创建工单表单组件
**文件**: `src/features/ticket/CreateTicket.tsx`

**实现内容**:
```typescript
import { Form, Input, Button, message, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';

interface CreateTicketForm {
  ticket_id: string;
  title: string;
  description: string;
}

export const CreateTicket: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const createMutation = useMutation({
    mutationFn: (values: CreateTicketForm) =>
      apiClient.post('/api/v1/tickets', values),
    onSuccess: (response) => {
      message.success('工单创建成功');
      navigate(`/tickets/${response.data.id}`);
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '创建失败');
    }
  });

  const onFinish = (values: CreateTicketForm) => {
    createMutation.mutate(values);
  };

  return (
    <Card title="创建工单" className="max-w-3xl">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="ticket_id"
          label="工单ID"
          rules={[
            { required: true, message: '请输入工单ID' },
            { max: 100, message: '工单ID不能超过100个字符' }
          ]}
          extra="唯一标识，如：ISSUE-2024-001"
        >
          <Input placeholder="ISSUE-2024-001" />
        </Form.Item>

        <Form.Item
          name="title"
          label="标题"
          rules={[
            { required: true, message: '请输入标题' },
            { max: 255, message: '标题不能超过255个字符' }
          ]}
        >
          <Input placeholder="简要描述问题" />
        </Form.Item>

        <Form.Item
          name="description"
          label="详细描述"
          rules={[
            { required: false }
          ]}
        >
          <Input.TextArea
            rows={6}
            placeholder="详细描述问题现象、影响范围、客户反馈等信息"
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={createMutation.isPending}
            >
              创建
            </Button>
            <Button onClick={() => navigate('/tickets')}>
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};
```

**验收标准**:
- [ ] 表单验证正确
- [ ] 创建成功跳转详情页
- [ ] 创建失败显示错误
- [ ] 取消按钮返回列表

---

### 任务3.3: 创建工单详情组件
**文件**: `src/features/ticket/TicketDetail.tsx`

**实现内容**:
```typescript
import { Card, Descriptions, Tag, Button, Space, Tabs, Spin, Modal } from 'antd';
import { EditOutlined, FileTextOutlined, BarChartOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';
import { useState } from 'react';

export const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  const { data: ticket, isLoading } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => apiClient.get(`/api/v1/tickets/${id}`)
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) =>
      apiClient.patch(`/api/v1/tickets/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
      setStatusModalVisible(false);
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  const ticketData = ticket?.data;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'orange',
      analyzing: 'blue',
      completed: 'green'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: '待处理',
      analyzing: '分析中',
      completed: '已完成'
    };
    return texts[status] || status;
  };

  return (
    <div className="space-y-4">
      {/* 基本信息 */}
      <Card
        title={
          <div className="flex items-center justify-between">
            <span>工单详情</span>
            <Space>
              <Button
                icon={<EditOutlined />}
                onClick={() => setStatusModalVisible(true)}
              >
                更新状态
              </Button>
              <Button
                type="primary"
                icon={<BarChartOutlined />}
                onClick={() => navigate(`/diagnosis?ticket_id=${id}`)}
              >
                开始诊断
              </Button>
            </Space>
          </div>
        }
      >
        <Descriptions column={2} bordered>
          <Descriptions.Item label="工单ID">
            <span className="font-mono">{ticketData?.ticket_id}</span>
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={getStatusColor(ticketData?.status)}>
              {getStatusText(ticketData?.status)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="标题" span={2}>
            {ticketData?.title}
          </Descriptions.Item>
          <Descriptions.Item label="描述" span={2}>
            <div className="whitespace-pre-wrap">
              {ticketData?.description || '无'}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {new Date(ticketData?.created_at).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {new Date(ticketData?.updated_at).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 标签页 */}
      <Tabs
        items={[
          {
            key: 'logs',
            label: '日志文件',
            icon: <FileTextOutlined />,
            children: <div>日志文件列表（待实现）</div>
          },
          {
            key: 'analysis',
            label: '分析结果',
            icon: <BarChartOutlined />,
            children: <div>分析结果展示（待实现）</div>
          },
          {
            key: 'reports',
            label: '报告',
            icon: <FileTextOutlined />,
            children: <div>报告列表（待实现）</div>
          }
        ]}
      />

      {/* 更新状态弹窗 */}
      <Modal
        title="更新工单状态"
        open={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        footer={null}
      >
        <Space direction="vertical" className="w-full">
          <Button
            block
            onClick={() => updateStatusMutation.mutate('pending')}
            loading={updateStatusMutation.isPending}
          >
            待处理
          </Button>
          <Button
            block
            onClick={() => updateStatusMutation.mutate('analyzing')}
            loading={updateStatusMutation.isPending}
          >
            分析中
          </Button>
          <Button
            block
            onClick={() => updateStatusMutation.mutate('completed')}
            loading={updateStatusMutation.isPending}
          >
            已完成
          </Button>
        </Space>
      </Modal>
    </div>
  );
};
```

**验收标准**:
- [ ] 显示工单完整信息
- [ ] 支持更新状态
- [ ] 开始诊断按钮跳转
- [ ] 标签页结构清晰

---

## 4. 路由配置

```typescript
// src/router/index.tsx
{
  path: 'tickets',
  children: [
    {
      index: true,
      element: <TicketList />
    },
    {
      path: 'create',
      element: <CreateTicket />
    },
    {
      path: ':id',
      element: <TicketDetail />
    }
  ]
}
```

---

## 5. API接口

### 5.1 获取工单列表
```
GET /api/v1/tickets?page=1&page_size=20&status=pending&keyword=ISSUE
```

### 5.2 创建工单
```
POST /api/v1/tickets
Body: {
  ticket_id: "ISSUE-2024-001",
  title: "订单支付失败",
  description: "客户反馈..."
}
```

### 5.3 获取工单详情
```
GET /api/v1/tickets/{id}
```

### 5.4 更新工单
```
PATCH /api/v1/tickets/{id}
Body: {
  status: "analyzing"
}
```

---

## 6. 性能优化

- [ ] 使用React Query缓存
- [ ] 表格虚拟滚动（大数据量）
- [ ] 防抖搜索输入
- [ ] 懒加载详情页标签内容

---

## 7. 响应式设计

- 手机端：表格横向滚动，操作列固定
- 平板端：正常显示
- 桌面端：完整显示所有列

---

## 8. 测试要点

### 单元测试
- [ ] 表单验证逻辑
- [ ] 状态标签颜色
- [ ] 筛选功能

### 集成测试
- [ ] 创建工单流程
- [ ] 列表分页和筛选
- [ ] 详情页数据加载
- [ ] 状态更新

---

## 9. 实现顺序

1. TicketList → 2. CreateTicket → 3. TicketDetail

---

## 10. 完成标准

- [ ] 所有任务完成
- [ ] CRUD功能正常
- [ ] 响应式布局完美
- [ ] 测试通过

---

**文档结束**
