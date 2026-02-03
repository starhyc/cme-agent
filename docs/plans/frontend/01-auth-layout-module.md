# 前端执行计划 - 模块01：认证与布局

**模块名称**: 认证与布局模块 (Authentication & Layout)
**优先级**: P0 - 必须首先实现
**依赖**: 无
**预计工作量**: 基础模块
**负责人**: Frontend Developer

---

## 1. 模块概述

实现用户认证、路由保护、全局布局和导航功能。

### 核心功能
- 登录页面
- 认证状态管理
- 路由保护
- 全局布局（Header、Sidebar、Content）
- 导航菜单

---

## 2. 实现文件清单

### 2.1 认证相关
- `src/features/auth/LoginPage.tsx` - 登录页面
- `src/features/auth/AuthContext.tsx` - 认证上下文
- `src/features/auth/ProtectedRoute.tsx` - 路由保护组件

### 2.2 布局相关
- `src/layouts/MainLayout.tsx` - 主布局
- `src/layouts/Header.tsx` - 顶部导航
- `src/layouts/Sidebar.tsx` - 侧边栏菜单

### 2.3 路由配置
- `src/router/index.tsx` - 路由配置

### 2.4 公共服务
- `src/services/apiClient.ts` - API客户端
- `src/services/authService.ts` - 认证服务
- `src/store/authStore.ts` - 认证状态管理

---

## 3. 详细任务列表

### 任务3.1: 创建API客户端
**文件**: `src/services/apiClient.ts`

**实现内容**:
```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器：注入token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 响应拦截器：统一错误处理
    this.client.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        if (error.response?.status === 401) {
          // Token过期，尝试刷新
          const refreshed = await this.refreshToken();
          if (refreshed) {
            return this.client.request(error.config);
          }
          // 刷新失败，跳转登录
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post(url, data, config);
  }

  // 其他HTTP方法...
}

export const apiClient = new ApiClient();
```

**验收标准**:
- [ ] 自动注入Authorization头
- [ ] 401错误自动刷新token
- [ ] 统一错误处理
- [ ] 支持TypeScript类型

---

### 任务3.2: 创建认证服务
**文件**: `src/services/authService.ts`

**实现内容**:
```typescript
interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<{success: boolean; data: LoginResponse}>(
      '/api/v1/auth/login',
      credentials
    );

    if (response.success) {
      // 存储token
      localStorage.setItem('access_token', response.data.token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    }
    throw new Error('登录失败');
  }

  async logout(): Promise<void> {
    await apiClient.post('/api/v1/auth/logout');
    localStorage.clear();
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      const response = await apiClient.post<{success: boolean; data: {token: string}}>(
        '/api/v1/auth/refresh',
        {},
        { headers: { Authorization: `Bearer ${refreshToken}` } }
      );

      if (response.success) {
        localStorage.setItem('access_token', response.data.token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}

export const authService = new AuthService();
```

**验收标准**:
- [ ] 登录成功存储token和用户信息
- [ ] 登出清除所有本地数据
- [ ] Token刷新功能正常
- [ ] 提供认证状态检查

---

### 任务3.3: 创建认证状态管理
**文件**: `src/store/authStore.ts`

**实现内容**:
```typescript
import { create } from 'zustand';

interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),

  login: async (username, password) => {
    const response = await authService.login({ username, password });
    set({ user: response.user, isAuthenticated: true });
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const user = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();
    set({ user, isAuthenticated });
  },
}));
```

**验收标准**:
- [ ] 使用Zustand管理状态
- [ ] 状态变更触发组件重渲染
- [ ] 初始化时检查认证状态

---

### 任务3.4: 创建登录页面
**文件**: `src/features/auth/LoginPage.tsx`

**实现内容**:
```typescript
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.username, values.password);
      message.success('登录成功');
      navigate('/dashboard');
    } catch (error) {
      message.error('用户名或密码错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">
          问题定位助手
        </h1>
        <Form onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
```

**验收标准**:
- [ ] 表单验证正常
- [ ] 登录成功跳转到仪表盘
- [ ] 登录失败显示错误提示
- [ ] 响应式设计，移动端适配

---

### 任务3.5: 创建路由保护组件
**文件**: `src/features/auth/ProtectedRoute.tsx`

**实现内容**:
```typescript
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
```

**验收标准**:
- [ ] 未认证用户重定向到登录页
- [ ] 非管理员无法访问管理页面
- [ ] 使用React Router的Navigate组件

---

### 任务3.6: 创建主布局
**文件**: `src/layouts/MainLayout.tsx`

**实现内容**:
```typescript
import { Layout } from 'antd';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

export const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="min-h-screen">
      <Header collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <Layout>
        <Sidebar collapsed={collapsed} />
        <Layout className="p-6">
          <Content className="bg-white rounded-lg p-6">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
```

**验收标准**:
- [ ] 布局结构清晰
- [ ] 侧边栏可折叠
- [ ] 内容区域自适应

---

### 任务3.7: 创建顶部导航
**文件**: `src/layouts/Header.tsx`

**实现内容**:
```typescript
import { Layout, Button, Dropdown, Avatar } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader className="bg-white shadow-sm flex items-center justify-between px-6">
      <div className="flex items-center">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
        />
        <h1 className="ml-4 text-xl font-bold">问题定位助手</h1>
      </div>
      <Dropdown menu={{ items: menuItems }} placement="bottomRight">
        <div className="flex items-center cursor-pointer">
          <Avatar icon={<UserOutlined />} />
          <span className="ml-2">{user?.username}</span>
        </div>
      </Dropdown>
    </AntHeader>
  );
};
```

**验收标准**:
- [ ] 显示用户名和头像
- [ ] 折叠按钮功能正常
- [ ] 下拉菜单包含退出登录

---

### 任务3.8: 创建侧边栏
**文件**: `src/layouts/Sidebar.tsx`

**实现内容**:
```typescript
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  FileTextOutlined,
  SearchOutlined,
  CodeOutlined,
  FileOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/tickets',
      icon: <FileTextOutlined />,
      label: '工单管理',
    },
    {
      key: '/diagnosis',
      icon: <SearchOutlined />,
      label: '问题诊断',
    },
    {
      key: '/code',
      icon: <CodeOutlined />,
      label: '代码查看',
    },
    {
      key: '/reports',
      icon: <FileOutlined />,
      label: '报告管理',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ];

  return (
    <Sider collapsed={collapsed} theme="light" width={200}>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};
```

**验收标准**:
- [ ] 菜单项与路由对应
- [ ] 当前路由高亮显示
- [ ] 折叠状态显示图标

---

### 任务3.9: 配置路由
**文件**: `src/router/index.tsx`

**实现内容**:
```typescript
import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '@/features/auth/LoginPage';
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <div>仪表盘</div>, // 占位符，后续实现
      },
      {
        path: 'tickets',
        element: <div>工单管理</div>,
      },
      // 其他路由...
    ],
  },
]);
```

**验收标准**:
- [ ] 路由配置正确
- [ ] 受保护路由需要认证
- [ ] 默认路由重定向到仪表盘

---

## 4. 环境配置

### 4.1 环境变量
```env
# .env.development
VITE_API_BASE_URL=http://localhost:8000

# .env.production
VITE_API_BASE_URL=https://api.diagnosis-assistant.internal
```

### 4.2 Tailwind配置
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

---

## 5. 依赖安装

```bash
npm install react react-dom react-router-dom
npm install antd @ant-design/icons
npm install axios zustand
npm install tailwindcss
npm install -D @types/react @types/react-dom
```

---

## 6. 测试要点

### 单元测试
- [ ] AuthService登录逻辑
- [ ] Token刷新逻辑
- [ ] 路由保护逻辑

### 集成测试
- [ ] 登录流程
- [ ] 登出流程
- [ ] 路由跳转
- [ ] 权限控制

---

## 7. 实现顺序

1. API客户端 → 2. 认证服务 → 3. 状态管理 → 4. 登录页面 → 5. 路由保护 → 6. 主布局 → 7. Header → 8. Sidebar → 9. 路由配置

---

## 8. 完成标准

- [ ] 所有任务完成
- [ ] 登录功能正常
- [ ] 路由保护生效
- [ ] 布局响应式
- [ ] 代码审查通过

---

**文档结束**
