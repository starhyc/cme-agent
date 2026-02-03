# 前端执行计划 - 模块06：系统设置模块

**模块名称**: 系统设置模块 (Settings)
**优先级**: P0 - 核心功能
**依赖**: 认证布局模块
**预计工作量**: 中等
**负责人**: Frontend Developer

---

## 1. 模块概述

实现系统配置管理，包括SSH服务器配置和用户管理（仅管理员）。

### 核心功能
- SSH服务器配置（增删改查）
- SSH连接测试
- 用户管理（仅管理员）
- 用户权限管理

---

## 2. 实现文件清单

- `src/features/settings/ServerConfig.tsx` - SSH服务器配置
- `src/features/settings/UserManagement.tsx` - 用户管理
- `src/features/settings/SettingsPage.tsx` - 主页面

---

## 3. 详细任务列表

### 任务3.1: 创建SSH服务器配置组件
**文件**: `src/features/settings/ServerConfig.tsx`

**实现内容**:
```typescript
import { Table, Button, Space, Modal, Form, Input, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';

interface Server {
  id: number;
  name: string;
  host: string;
  port: number;
  username: string;
  created_at: string;
}

interface ServerFormData {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
}

export const ServerConfig: React.FC = () => {
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingServer, setEditingServer] = useState<Server | null>(null);
  const [form] = Form.useForm();

  const { data: servers, isLoading } = useQuery({
    queryKey: ['ssh-servers'],
    queryFn: () => apiClient.get('/api/v1/logs/ssh-servers')
  });

  const createMutation = useMutation({
    mutationFn: (values: ServerFormData) =>
      apiClient.post('/api/v1/logs/ssh-servers', values),
    onSuccess: () => {
      message.success('服务器添加成功');
      queryClient.invalidateQueries({ queryKey: ['ssh-servers'] });
      setModalVisible(false);
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '添加失败');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: ServerFormData }) =>
      apiClient.put(`/api/v1/logs/ssh-servers/${id}`, values),
    onSuccess: () => {
      message.success('服务器更新成功');
      queryClient.invalidateQueries({ queryKey: ['ssh-servers'] });
      setModalVisible(false);
      setEditingServer(null);
      form.resetFields();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiClient.delete(`/api/v1/logs/ssh-servers/${id}`),
    onSuccess: () => {
      message.success('服务器删除成功');
      queryClient.invalidateQueries({ queryKey: ['ssh-servers'] });
    }
  });

  const testConnectionMutation = useMutation({
    mutationFn: (id: number) =>
      apiClient.post(`/api/v1/logs/ssh-servers/${id}/test`),
    onSuccess: () => {
      message.success('连接测试成功');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '连接失败');
    }
  });

  const handleAdd = () => {
    setEditingServer(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (server: Server) => {
    setEditingServer(server);
    form.setFieldsValue({
      name: server.name,
      host: server.host,
      port: server.port,
      username: server.username
    });
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个服务器配置吗？',
      onOk: () => deleteMutation.mutate(id)
    });
  };

  const handleSubmit = (values: ServerFormData) => {
    if (editingServer) {
      updateMutation.mutate({ id: editingServer.id, values });
    } else {
      createMutation.mutate(values);
    }
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '主机',
      dataIndex: 'host',
      key: 'host'
    },
    {
      title: '端口',
      dataIndex: 'port',
      key: 'port',
      width: 100
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Server) => (
        <Space>
          <Button
            type="link"
            icon={<CheckCircleOutlined />}
            onClick={() => testConnectionMutation.mutate(record.id)}
            loading={testConnectionMutation.isPending}
          >
            测试
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">SSH服务器配置</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          添加服务器
        </Button>
      </div>

      <Table
        loading={isLoading}
        columns={columns}
        dataSource={servers?.data.items || []}
        rowKey="id"
        pagination={false}
      />

      <Modal
        title={editingServer ? '编辑服务器' : '添加服务器'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingServer(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ port: 22 }}
        >
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="生产服务器1" />
          </Form.Item>

          <Form.Item
            name="host"
            label="主机地址"
            rules={[
              { required: true, message: '请输入主机地址' },
              { pattern: /^[\w.-]+$/, message: '请输入有效的主机地址' }
            ]}
          >
            <Input placeholder="192.168.1.100 或 server.example.com" />
          </Form.Item>

          <Form.Item
            name="port"
            label="端口"
            rules={[
              { required: true, message: '请输入端口' },
              { type: 'number', min: 1, max: 65535, message: '端口范围1-65535' }
            ]}
          >
            <Input type="number" placeholder="22" />
          </Form.Item>

          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="root" />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: !editingServer, message: '请输入密码' }
            ]}
            extra={editingServer ? '留空则不修改密码' : ''}
          >
            <Input.Password placeholder="SSH密码" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {editingServer ? '更新' : '添加'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
```

**验收标准**:
- [ ] 显示服务器列表
- [ ] 添加服务器功能
- [ ] 编辑服务器功能
- [ ] 删除服务器功能
- [ ] 测试连接功能
- [ ] 密码加密存储

---

### 任务3.2: 创建用户管理组件
**文件**: `src/features/settings/UserManagement.tsx`

**实现内容**:
```typescript
import { Table, Button, Space, Modal, Form, Input, Select, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';
import { useAuthStore } from '@/store/authStore';

interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
  created_at: string;
}

interface UserFormData {
  username: string;
  password: string;
  role: string;
}

export const UserManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // 权限检查
  if (currentUser?.role !== 'admin') {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">仅管理员可访问此页面</p>
      </div>
    );
  }

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.get('/api/v1/auth/users')
  });

  const createMutation = useMutation({
    mutationFn: (values: UserFormData) =>
      apiClient.post('/api/v1/auth/users', values),
    onSuccess: () => {
      message.success('用户创建成功');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setModalVisible(false);
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '创建失败');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: Partial<UserFormData> }) =>
      apiClient.patch(`/api/v1/auth/users/${id}`, values),
    onSuccess: () => {
      message.success('用户更新成功');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setModalVisible(false);
      setEditingUser(null);
      form.resetFields();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiClient.delete(`/api/v1/auth/users/${id}`),
    onSuccess: () => {
      message.success('用户删除成功');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      role: user.role
    });
    setModalVisible(true);
  };

  const handleDelete = (user: User) => {
    if (user.id === currentUser?.id) {
      message.error('不能删除当前登录用户');
      return;
    }

    Modal.confirm({
      title: '确认删除',
      content: `确定要删除用户 ${user.username} 吗？`,
      onOk: () => deleteMutation.mutate(user.id)
    });
  };

  const handleSubmit = (values: UserFormData) => {
    if (editingUser) {
      const updateData: Partial<UserFormData> = { role: values.role };
      if (values.password) {
        updateData.password = values.password;
      }
      updateMutation.mutate({ id: editingUser.id, values: updateData });
    } else {
      createMutation.mutate(values);
    }
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role === 'admin' ? '管理员' : '普通用户'}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: User) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            disabled={record.id === currentUser?.id}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">用户管理</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          添加用户
        </Button>
      </div>

      <Table
        loading={isLoading}
        columns={columns}
        dataSource={users?.data.items || []}
        rowKey="id"
        pagination={false}
      />

      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字和下划线' }
            ]}
          >
            <Input placeholder="username" disabled={!!editingUser} />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: !editingUser, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
            extra={editingUser ? '留空则不修改密码' : ''}
          >
            <Input.Password placeholder="密码" />
          </Form.Item>

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select>
              <Select.Option value="user">普通用户</Select.Option>
              <Select.Option value="admin">管理员</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {editingUser ? '更新' : '创建'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
```

**验收标准**:
- [ ] 仅管理员可访问
- [ ] 显示用户列表
- [ ] 创建用户功能
- [ ] 编辑用户功能
- [ ] 删除用户功能（不能删除自己）
- [ ] 角色管理

---

### 任务3.3: 创建设置主页面
**文件**: `src/features/settings/SettingsPage.tsx`

**实现内容**:
```typescript
import { Tabs } from 'antd';
import { ServerOutlined, UserOutlined } from '@ant-design/icons';
import { ServerConfig } from './ServerConfig';
import { UserManagement } from './UserManagement';
import { useAuthStore } from '@/store/authStore';

export const SettingsPage: React.FC = () => {
  const currentUser = useAuthStore((state) => state.user);

  const items = [
    {
      key: 'servers',
      label: 'SSH服务器',
      icon: <ServerOutlined />,
      children: <ServerConfig />
    }
  ];

  // 管理员才能看到用户管理
  if (currentUser?.role === 'admin') {
    items.push({
      key: 'users',
      label: '用户管理',
      icon: <UserOutlined />,
      children: <UserManagement />
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">系统设置</h1>
      <Tabs items={items} />
    </div>
  );
};
```

**验收标准**:
- [ ] 标签页切换正常
- [ ] 管理员显示用户管理标签
- [ ] 普通用户不显示用户管理标签

---

## 4. 路由配置

```typescript
// src/router/index.tsx
{
  path: 'settings',
  element: <SettingsPage />
}
```

---

## 5. API接口

### 5.1 SSH服务器管理
```
GET /api/v1/logs/ssh-servers
POST /api/v1/logs/ssh-servers
PUT /api/v1/logs/ssh-servers/{id}
DELETE /api/v1/logs/ssh-servers/{id}
POST /api/v1/logs/ssh-servers/{id}/test
```

### 5.2 用户管理
```
GET /api/v1/auth/users
POST /api/v1/auth/users
PATCH /api/v1/auth/users/{id}
DELETE /api/v1/auth/users/{id}
```

---

## 6. 安全考虑

- [ ] SSH密码加密传输（HTTPS）
- [ ] SSH密码加密存储（后端AES-256）
- [ ] 用户密码哈希存储（bcrypt）
- [ ] 权限检查（前后端双重验证）
- [ ] 不能删除当前登录用户
- [ ] 审计日志记录所有操作

---

## 7. 测试要点

### 单元测试
- [ ] 权限检查逻辑
- [ ] 表单验证规则
- [ ] 删除确认逻辑

### 集成测试
- [ ] SSH服务器CRUD
- [ ] 连接测试功能
- [ ] 用户管理CRUD
- [ ] 权限控制

---

## 8. 实现顺序

1. ServerConfig → 2. UserManagement → 3. SettingsPage

---

## 9. 完成标准

- [ ] 所有任务完成
- [ ] SSH配置功能正常
- [ ] 用户管理功能正常
- [ ] 权限控制正确
- [ ] 测试通过

---

**文档结束**
