# React Component Patterns with Chinese Comments

This file contains React component patterns demonstrating proper implementation with Chinese comments, state management, and UI/UX handling.

## Complete Component Example: UserProfile

```typescript
// UserProfile.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { UserService } from '../services/UserService';
import { User } from '../types/User';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { logger } from '../utils/logger';

interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

/**
 * 用户资料组件
 * 显示用户信息并支持编辑
 */
export const UserProfile: React.FC<UserProfileProps> = ({ userId, onUpdate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  /**
   * 加载用户数据
   */
  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      logger.info('加载用户资料', { userId });

      const userData = await UserService.getUserById(userId);

      if (!userData) {
        setError('用户不存在');
        logger.warn('用户不存在', { userId });
        return;
      }

      setUser(userData);
      logger.info('用户资料加载成功', { userId });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '加载失败';
      setError(errorMessage);
      logger.error('用户资料加载失败', { userId, error: err });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  /**
   * 处理用户信息更新
   */
  const handleUpdate = useCallback(async (updatedData: Partial<User>) => {
    try {
      logger.info('更新用户资料', { userId, updatedData });

      const updatedUser = await UserService.updateUser(userId, updatedData);
      setUser(updatedUser);
      setIsEditing(false);

      // 通知父组件
      onUpdate?.(updatedUser);

      logger.info('用户资料更新成功', { userId });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新失败';
      setError(errorMessage);
      logger.error('用户资料更新失败', { userId, error: err });
    }
  }, [userId, onUpdate]);

  // 加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={loadUser}
      />
    );
  }

  // 空状态
  if (!user) {
    return (
      <div className="text-center text-gray-500 py-8">
        未找到用户信息
      </div>
    );
  }

  return (
    <div className="user-profile max-w-2xl mx-auto p-4 sm:p-6">
      {/* 用户头像 - 响应式设计 */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <img
          src={user.avatar || '/default-avatar.png'}
          alt={user.name}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
          loading="lazy"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      {/* 用户信息 - 响应式布局 */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        {isEditing ? (
          <UserEditForm
            user={user}
            onSave={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">姓名</label>
                <p className="text-lg">{user.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">邮箱</label>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">注册时间</label>
                <p className="text-lg">
                  {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </div>

            {/* 编辑按钮 - 响应式 */}
            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg
                         hover:bg-blue-700 active:bg-blue-800 transition-colors
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              编辑资料
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// 使用 React.memo 优化性能
export default React.memo(UserProfile);
```

## State Management Patterns

### Pattern 1: Loading, Error, Data States

```typescript
const [data, setData] = useState<T | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// 加载数据
const loadData = async () => {
  try {
    setLoading(true);
    setError(null);
    const result = await fetchData();
    setData(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Pattern 2: Form State with Validation

```typescript
/**
 * 表单组件
 * 处理用户输入和验证
 */
const UserForm: React.FC<Props> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  /**
   * 验证表单数据
   */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '姓名不能为空';
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = '邮箱格式不正确';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSubmitting(true);
      await onSubmit(formData);
    } catch (err) {
      setErrors({ submit: '提交失败，请重试' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 表单字段 */}
    </form>
  );
};
```

### Pattern 3: Optimistic Updates

```typescript
/**
 * 点赞组件
 * 使用乐观更新提升用户体验
 */
const LikeButton: React.FC<{ postId: string; initialLikes: number }> = ({
  postId,
  initialLikes
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  /**
   * 处理点赞
   * 先更新UI，再调用API
   */
  const handleLike = async () => {
    // 乐观更新
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikes(prev => newLiked ? prev + 1 : prev - 1);

    try {
      await PostService.toggleLike(postId);
    } catch (err) {
      // 失败时回滚
      setIsLiked(!newLiked);
      setLikes(prev => newLiked ? prev - 1 : prev + 1);
    }
  };

  return (
    <button onClick={handleLike}>
      {isLiked ? '❤️' : '🤍'} {likes}
    </button>
  );
};
```

## UI State Patterns

### Loading States

```typescript
// 骨架屏加载
if (loading) {
  return (
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
    </div>
  );
}

// 加载指示器
if (loading) {
  return (
    <div className="flex items-center justify-center p-8">
      <LoadingSpinner />
      <span className="ml-2">加载中...</span>
    </div>
  );
}
```

### Error States

```typescript
// 错误消息组件
if (error) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start">
        <svg className="w-5 h-5 text-red-600 mt-0.5" />
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            加载失败
          </h3>
          <p className="mt-1 text-sm text-red-700">{error}</p>
          <button
            onClick={retry}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            重试
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Empty States

```typescript
// 空状态
if (!data || data.length === 0) {
  return (
    <div className="text-center py-12">
      <svg className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        暂无数据
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        开始添加第一条记录吧
      </p>
      <button className="mt-4">
        添加
      </button>
    </div>
  );
}
```

## Performance Optimization Patterns

### Memoization

```typescript
// useMemo - 缓存计算结果
const sortedUsers = useMemo(() => {
  return users.sort((a, b) => a.name.localeCompare(b.name));
}, [users]);

// useCallback - 缓存函数
const handleClick = useCallback((id: string) => {
  console.log('Clicked:', id);
}, []);

// React.memo - 缓存组件
const UserCard = React.memo<Props>(({ user }) => {
  return <div>{user.name}</div>;
});
```

### Code Splitting

```typescript
// 路由级代码分割
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Suspense>
  );
}
```

### Debounce and Throttle

```typescript
import { useState, useCallback } from 'react';
import { debounce } from 'lodash';

/**
 * 搜索组件
 * 使用防抖优化搜索性能
 */
const SearchBox: React.FC = () => {
  const [query, setQuery] = useState('');

  /**
   * 防抖搜索函数
   * 用户停止输入300ms后才执行搜索
   */
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      performSearch(value);
    }, 300),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="搜索..."
    />
  );
};
```

## Comment Guidelines

### Component Comments

```typescript
/**
 * 组件名称
 * 组件功能的简要说明
 */
export const ComponentName: React.FC<Props> = (props) => {
  // ...
};
```

### Function Comments

```typescript
/**
 * 函数功能说明
 * @param paramName 参数说明
 * @returns 返回值说明
 */
const functionName = (paramName: Type): ReturnType => {
  // ...
};
```

### Inline Comments

```typescript
// 1. 步骤说明
const result = await someOperation();

// 检查条件并处理
if (condition) {
  // 处理逻辑说明
  handleSomething();
}
```
