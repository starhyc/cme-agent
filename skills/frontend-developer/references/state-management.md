# State Management Patterns

This file contains state management patterns and best practices for React applications.

## Local State with useState

### Basic State

```typescript
import { useState } from 'react';

/**
 * 计数器组件
 * 演示基本状态管理
 */
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <button onClick={() => setCount(prev => prev - 1)}>减少</button>
    </div>
  );
}
```

### Object State

```typescript
/**
 * 用户表单
 * 管理对象状态
 */
function UserForm() {
  const [user, setUser] = useState({ name: '', email: '' });

  const handleChange = (field: string, value: string) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form>
      <input
        value={user.name}
        onChange={e => handleChange('name', e.target.value)}
      />
      <input
        value={user.email}
        onChange={e => handleChange('email', e.target.value)}
      />
    </form>
  );
}
```

## Context API for Global State

### Creating Context

```typescript
import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

/**
 * 认证上下文
 * 管理全局用户状态
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => {
    setUser(user);
    logger.info('用户登录', { userId: user.id });
  };

  const logout = () => {
    setUser(null);
    logger.info('用户登出');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 使用认证上下文的 Hook
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 内使用');
  }
  return context;
}
```

### Using Context

```typescript
/**
 * 用户资料组件
 * 使用全局认证状态
 */
function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>请先登录</div>;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={logout}>登出</button>
    </div>
  );
}
```

## Custom Hooks for State Logic

### Data Fetching Hook

```typescript
import { useState, useEffect } from 'react';

interface UseDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * 数据获取 Hook
 * 封装加载、错误、数据状态
 */
function useData<T>(fetchFn: () => Promise<T>): UseDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return { data, loading, error, refetch: loadData };
}

// 使用示例
function UserList() {
  const { data: users, loading, error, refetch } = useData(() =>
    UserService.getUsers()
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Form State Hook

```typescript
/**
 * 表单状态 Hook
 * 管理表单数据和验证
 */
function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // 清除该字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, errors, setErrors, handleChange, reset };
}

// 使用示例
function LoginForm() {
  const { values, errors, setErrors, handleChange } = useForm({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证
    const newErrors: any = {};
    if (!values.email) newErrors.email = '邮箱不能为空';
    if (!values.password) newErrors.password = '密码不能为空';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 提交
    await AuthService.login(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={values.email}
        onChange={e => handleChange('email', e.target.value)}
      />
      {errors.email && <span>{errors.email}</span>}

      <input
        type="password"
        value={values.password}
        onChange={e => handleChange('password', e.target.value)}
      />
      {errors.password && <span>{errors.password}</span>}

      <button type="submit">登录</button>
    </form>
  );
}
```

## State Management with Zustand

### Creating Store

```typescript
import { create } from 'zustand';

interface TodoState {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
}

/**
 * Todo 状态管理
 * 使用 Zustand 管理全局状态
 */
export const useTodoStore = create<TodoState>((set) => ({
  todos: [],

  addTodo: (text) => set((state) => ({
    todos: [...state.todos, { id: Date.now().toString(), text, done: false }]
  })),

  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    )
  })),

  removeTodo: (id) => set((state) => ({
    todos: state.todos.filter(todo => todo.id !== id)
  }))
}));
```

### Using Store

```typescript
/**
 * Todo 列表组件
 * 使用 Zustand store
 */
function TodoList() {
  const { todos, toggleTodo, removeTodo } = useTodoStore();

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => toggleTodo(todo.id)}
          />
          <span>{todo.text}</span>
          <button onClick={() => removeTodo(todo.id)}>删除</button>
        </li>
      ))}
    </ul>
  );
}

function AddTodo() {
  const addTodo = useTodoStore(state => state.addTodo);
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button type="submit">添加</button>
    </form>
  );
}
```

## State Patterns

### Loading/Error/Data Pattern

```typescript
/**
 * 数据加载状态模式
 * 标准的三态模式
 */
function DataComponent() {
  const [state, setState] = useState<{
    data: User[] | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setState({ data: null, loading: true, error: null });
        const result = await fetchUsers();
        setState({ data: result, loading: false, error: null });
      } catch (err) {
        setState({ data: null, loading: false, error: err.message });
      }
    };
    loadData();
  }, []);

  if (state.loading) return <LoadingSpinner />;
  if (state.error) return <ErrorMessage message={state.error} />;
  if (!state.data) return <EmptyState />;

  return <UserList users={state.data} />;
}
```

### Optimistic Updates

```typescript
/**
 * 乐观更新模式
 * 先更新UI，后同步服务器
 */
function TodoItem({ todo }: { todo: Todo }) {
  const [optimisticDone, setOptimisticDone] = useState(todo.done);

  const handleToggle = async () => {
    // 立即更新UI
    setOptimisticDone(!optimisticDone);

    try {
      // 同步到服务器
      await TodoService.update(todo.id, { done: !optimisticDone });
    } catch (err) {
      // 失败时回滚
      setOptimisticDone(optimisticDone);
      logger.error('更新失败', { error: err });
    }
  };

  return (
    <div>
      <input
        type="checkbox"
        checked={optimisticDone}
        onChange={handleToggle}
      />
      <span>{todo.text}</span>
    </div>
  );
}
```

## State Immutability

### Array Updates

```typescript
// 添加元素
setItems([...items, newItem]);

// 删除元素
setItems(items.filter(item => item.id !== id));

// 更新元素
setItems(items.map(item =>
  item.id === id ? { ...item, name: newName } : item
));

// 排序
setItems([...items].sort((a, b) => a.name.localeCompare(b.name)));
```

### Object Updates

```typescript
// 更新单个属性
setUser({ ...user, name: newName });

// 更新嵌套属性
setUser({
  ...user,
  address: { ...user.address, city: newCity }
});

// 合并多个属性
setUser({ ...user, ...updates });
```

## State Lifting

```typescript
/**
 * 状态提升示例
 * 将共享状态提升到父组件
 */
function ParentComponent() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div>
      <ItemList selectedId={selectedId} onSelect={setSelectedId} />
      <ItemDetail itemId={selectedId} />
    </div>
  );
}

function ItemList({ selectedId, onSelect }: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const items = useItems();

  return (
    <ul>
      {items.map(item => (
        <li
          key={item.id}
          className={item.id === selectedId ? 'selected' : ''}
          onClick={() => onSelect(item.id)}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

## Best Practices

1. **Use local state by default**: Only lift state when needed by multiple components
2. **Keep state minimal**: Derive values instead of storing them
3. **Use Context for global state**: Auth, theme, language settings
4. **Custom hooks for reusable logic**: Extract common state patterns
5. **Immutable updates**: Always create new objects/arrays
6. **Avoid unnecessary state**: Don't store values that can be computed
7. **State colocation**: Keep state close to where it's used
8. **Use reducers for complex state**: When state updates depend on previous state

## State Management Checklist

- [ ] Local state used for component-specific data
- [ ] Context used for global state (auth, theme)
- [ ] Custom hooks extract reusable state logic
- [ ] Loading/error/data states handled consistently
- [ ] State updates are immutable
- [ ] No unnecessary state (derived values computed)
- [ ] State lifted only when needed by multiple components
- [ ] Complex state logic uses useReducer or state management library
