# 前端执行计划 - 模块00：仪表盘模块

**模块名称**: 仪表盘模块 (Dashboard)
**优先级**: P0 - 核心功能
**依赖**: 认证布局模块
**预计工作量**: 小
**负责人**: Frontend Developer

---

## 1. 模块概述

实现系统仪表盘，展示关键统计信息和快速操作入口。

### 核心功能
- 工单统计（总数、待处理、已完成）
- 最近分析记录
- 系统状态监控
- 快速操作入口

---

## 2. 实现文件清单

- `src/features/dashboard/Dashboard.tsx` - 仪表盘主页面
- `src/features/dashboard/StatCard.tsx` - 统计卡片组件
- `src/features/dashboard/RecentActivity.tsx` - 最近活动
- `src/features/dashboard/QuickActions.tsx` - 快速操作

---

## 3. 详细任务列表

### 任务3.1: 创建统计卡片组件
**文件**: `src/features/dashboard/StatCard.tsx`

**实现内容**:
```typescript
import { Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  suffix,
  trend,
  icon,
  color = '#1890ff'
}) => {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <Statistic
            title={title}
            value={value}
            suffix={suffix}
            valueStyle={{ color }}
          />
          {trend && (
            <div className="mt-2 text-sm">
              {trend.isPositive ? (
                <ArrowUpOutlined className="text-green-500" />
              ) : (
                <ArrowDownOutlined className="text-red-500" />
              )}
              <span className="ml-1">{Math.abs(trend.value)}%</span>
              <span className="ml-1 text-gray-500">vs 上周</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-4xl" style={{ color }}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
```

**验收标准**:
- [ ] 显示统计数值
- [ ] 支持趋势指示
- [ ] 支持自定义图标和颜色
- [ ] 响应式布局

---

### 任务3.2: 创建最近活动组件
**文件**: `src/features/dashboard/RecentActivity.tsx`

**实现内容**:
```typescript
import { Card, List, Tag, Avatar } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';

interface Activity {
  id: number;
  type: 'ticket_created' | 'analysis_completed' | 'report_generated';
  title: string;
  description: string;
  timestamp: string;
  status: string;
}

export const RecentActivity: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: () => apiClient.get<{success: boolean; data: {items: Activity[]}}>(
      '/api/v1/dashboard/recent-activity',
      { params: { limit: 10 } }
    ),
    refetchInterval: 30000 // 30秒刷新
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'ticket_created':
        return <FileTextOutlined />;
      case 'analysis_completed':
        return <CheckCircleOutlined />;
      case 'report_generated':
        return <FileTextOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'orange',
      processing: 'blue',
      completed: 'green',
      failed: 'red'
    };
    return colors[status] || 'default';
  };

  return (
    <Card title="最近活动" className="h-full">
      <List
        loading={isLoading}
        dataSource={data?.data.items || []}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar icon={getIcon(item.type)} />
              }
              title={item.title}
              description={
                <div>
                  <div>{item.description}</div>
                  <div className="mt-1">
                    <Tag color={getStatusColor(item.status)}>
                      {item.status}
                    </Tag>
                    <span className="text-gray-400 text-xs ml-2">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};
```

**验收标准**:
- [ ] 显示最近10条活动
- [ ] 自动刷新（30秒）
- [ ] 不同类型显示不同图标
- [ ] 状态标签颜色正确

---

### 任务3.3: 创建快速操作组件
**文件**: `src/features/dashboard/QuickActions.tsx`

**实现内容**:
```typescript
import { Card, Button, Space } from 'antd';
import { PlusOutlined, UploadOutlined, SearchOutlined, FileAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      key: 'create-ticket',
      label: '创建工单',
      icon: <PlusOutlined />,
      onClick: () => navigate('/tickets/create')
    },
    {
      key: 'upload-log',
      label: '上传日志',
      icon: <UploadOutlined />,
      onClick: () => navigate('/diagnosis?action=upload')
    },
    {
      key: 'search-code',
      label: '搜索代码',
      icon: <SearchOutlined />,
      onClick: () => navigate('/code')
    },
    {
      key: 'generate-report',
      label: '生成报告',
      icon: <FileAddOutlined />,
      onClick: () => navigate('/reports/generate')
    }
  ];

  return (
    <Card title="快速操作">
      <Space direction="vertical" className="w-full" size="middle">
        {actions.map((action) => (
          <Button
            key={action.key}
            type="default"
            icon={action.icon}
            onClick={action.onClick}
            block
            size="large"
          >
            {action.label}
          </Button>
        ))}
      </Space>
    </Card>
  );
};
```

**验收标准**:
- [ ] 显示常用操作按钮
- [ ] 点击跳转到对应页面
- [ ] 按钮样式统一

---

### 任务3.4: 创建仪表盘主页面
**文件**: `src/features/dashboard/Dashboard.tsx`

**实现内容**:
```typescript
import { Row, Col, Spin } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { StatCard } from './StatCard';
import { RecentActivity } from './RecentActivity';
import { QuickActions } from './QuickActions';
import { apiClient } from '@/services/apiClient';

interface DashboardStats {
  total_tickets: number;
  pending_tickets: number;
  completed_tickets: number;
  failed_tickets: number;
  trends: {
    tickets: number;
    completed: number;
  };
}

export const Dashboard: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiClient.get<{success: boolean; data: DashboardStats}>(
      '/api/v1/dashboard/stats'
    ),
    refetchInterval: 60000 // 1分钟刷新
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  const statsData = stats?.data;

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="总工单数"
            value={statsData?.total_tickets || 0}
            icon={<FileTextOutlined />}
            color="#1890ff"
            trend={{
              value: statsData?.trends.tickets || 0,
              isPositive: (statsData?.trends.tickets || 0) >= 0
            }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="待处理"
            value={statsData?.pending_tickets || 0}
            icon={<ClockCircleOutlined />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="已完成"
            value={statsData?.completed_tickets || 0}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
            trend={{
              value: statsData?.trends.completed || 0,
              isPositive: (statsData?.trends.completed || 0) >= 0
            }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="失败"
            value={statsData?.failed_tickets || 0}
            icon={<WarningOutlined />}
            color="#ff4d4f"
          />
        </Col>
      </Row>

      {/* 最近活动和快速操作 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <RecentActivity />
        </Col>
        <Col xs={24} lg={8}>
          <QuickActions />
        </Col>
      </Row>
    </div>
  );
};
```

**验收标准**:
- [ ] 显示4个统计卡片
- [ ] 显示最近活动列表
- [ ] 显示快速操作按钮
- [ ] 自动刷新数据
- [ ] 响应式布局（移动端适配）
- [ ] 加载状态显示

---

## 4. API接口

### 4.1 获取统计数据
```
GET /api/v1/dashboard/stats
Response: {
  success: true,
  data: {
    total_tickets: 150,
    pending_tickets: 20,
    completed_tickets: 120,
    failed_tickets: 10,
    trends: {
      tickets: 15,
      completed: 10
    }
  }
}
```

### 4.2 获取最近活动
```
GET /api/v1/dashboard/recent-activity?limit=10
Response: {
  success: true,
  data: {
    items: [
      {
        id: 1,
        type: "ticket_created",
        title: "创建工单 #12345",
        description: "客户报障：订单支付失败",
        timestamp: "2026-02-03T09:30:00Z",
        status: "pending"
      }
    ]
  }
}
```

---

## 5. 状态管理

使用React Query管理服务端状态，自动缓存和刷新。

```typescript
// 不需要额外的全局状态，React Query已足够
```

---

## 6. 性能优化

- [ ] 使用React Query缓存
- [ ] 自动刷新间隔合理（统计1分钟，活动30秒）
- [ ] 使用React.memo优化StatCard
- [ ] 懒加载图表组件

---

## 7. 响应式设计

### 断点定义
- xs: < 576px (手机)
- sm: 576px - 768px (平板竖屏)
- md: 768px - 992px (平板横屏)
- lg: 992px - 1200px (桌面)
- xl: > 1200px (大屏)

### 布局适配
- 手机端：统计卡片单列显示
- 平板端：统计卡片两列显示
- 桌面端：统计卡片四列显示

---

## 8. 测试要点

### 单元测试
- [ ] StatCard组件渲染
- [ ] 趋势指示器显示
- [ ] 快速操作跳转

### 集成测试
- [ ] 数据加载和显示
- [ ] 自动刷新功能
- [ ] 响应式布局

---

## 9. 实现顺序

1. StatCard → 2. QuickActions → 3. RecentActivity → 4. Dashboard主页面

---

## 10. 完成标准

- [ ] 所有任务完成
- [ ] 数据正确显示
- [ ] 自动刷新正常
- [ ] 响应式布局完美
- [ ] 测试通过

---

**文档结束**
