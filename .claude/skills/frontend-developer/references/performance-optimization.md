# Performance Optimization Techniques

This file contains performance optimization techniques for frontend applications.

## Code Splitting

### Route-Level Code Splitting

```typescript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 懒加载路由组件
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### Component-Level Code Splitting

```typescript
import { lazy, Suspense } from 'react';

// 懒加载大型组件
const HeavyChart = lazy(() => import('./components/HeavyChart'));
const RichTextEditor = lazy(() => import('./components/RichTextEditor'));

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <Suspense fallback={<div>加载图表中...</div>}>
        <HeavyChart data={chartData} />
      </Suspense>

      <Suspense fallback={<div>加载编辑器中...</div>}>
        <RichTextEditor />
      </Suspense>
    </div>
  );
}
```

## Memoization

### useMemo - 缓存计算结果

```typescript
import { useMemo } from 'react';

function UserList({ users, searchQuery }) {
  /**
   * 缓存过滤和排序结果
   * 只在 users 或 searchQuery 变化时重新计算
   */
  const filteredAndSortedUsers = useMemo(() => {
    return users
      .filter(user => user.name.includes(searchQuery))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [users, searchQuery]);

  return (
    <ul>
      {filteredAndSortedUsers.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### useCallback - 缓存函数

```typescript
import { useCallback } from 'react';

function Parent() {
  const [count, setCount] = useState(0);

  /**
   * 缓存回调函数
   * 避免子组件不必要的重渲染
   */
  const handleClick = useCallback((id: string) => {
    console.log('Clicked:', id);
  }, []); // 空依赖数组，函数永不变化

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      <ChildComponent onClick={handleClick} />
    </div>
  );
}
```

### React.memo - 缓存组件

```typescript
import React from 'react';

interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
}

/**
 * 使用 React.memo 避免不必要的重渲染
 * 只在 props 变化时重新渲染
 */
const UserCard = React.memo<UserCardProps>(({ user, onEdit }) => {
  return (
    <div>
      <h3>{user.name}</h3>
      <button onClick={() => onEdit(user.id)}>编辑</button>
    </div>
  );
});

export default UserCard;
```

## Image Optimization

### Lazy Loading Images

```typescript
/**
 * 图片懒加载
 * 使用原生 loading="lazy" 属性
 */
<img
  src={user.avatar}
  alt={user.name}
  loading="lazy"
  className="w-24 h-24 rounded-full"
/>
```

### Responsive Images

```typescript
/**
 * 响应式图片
 * 根据屏幕尺寸加载不同大小的图片
 */
<img
  src={image.url}
  srcSet={`
    ${image.small} 320w,
    ${image.medium} 640w,
    ${image.large} 1024w
  `}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt={image.alt}
  loading="lazy"
/>
```

### Image Formats

```typescript
/**
 * 使用现代图片格式
 * WebP 提供更好的压缩率
 */
<picture>
  <source srcSet={image.webp} type="image/webp" />
  <source srcSet={image.jpg} type="image/jpeg" />
  <img src={image.jpg} alt={image.alt} loading="lazy" />
</picture>
```

## Debounce and Throttle

### Debounce - 防抖

```typescript
import { useState, useCallback } from 'react';
import { debounce } from 'lodash';

/**
 * 搜索输入防抖
 * 用户停止输入300ms后才执行搜索
 */
function SearchBox() {
  const [query, setQuery] = useState('');

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      // 执行搜索
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
}
```

### Throttle - 节流

```typescript
import { useCallback } from 'react';
import { throttle } from 'lodash';

/**
 * 滚动事件节流
 * 每100ms最多执行一次
 */
function ScrollTracker() {
  const handleScroll = useCallback(
    throttle(() => {
      const scrollY = window.scrollY;
      console.log('Scroll position:', scrollY);
    }, 100),
    []
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return <div>Scroll tracker active</div>;
}
```

## Virtual Scrolling

### React Window

```typescript
import { FixedSizeList } from 'react-window';

/**
 * 虚拟滚动列表
 * 只渲染可见区域的项目
 */
function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

## Bundle Size Optimization

### Tree Shaking

```typescript
// ❌ 导入整个库
import _ from 'lodash';

// ✅ 只导入需要的函数
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
```

### Dynamic Imports

```typescript
/**
 * 动态导入
 * 按需加载模块
 */
async function loadChart() {
  const { Chart } = await import('chart.js');
  return new Chart(ctx, config);
}

// 点击时才加载
<button onClick={async () => {
  const chart = await loadChart();
  chart.render();
}}>
  显示图表
</button>
```

## State Management Optimization

### Avoid Unnecessary State

```typescript
// ❌ 不必要的状态
function Component({ users }) {
  const [userCount, setUserCount] = useState(users.length);

  useEffect(() => {
    setUserCount(users.length);
  }, [users]);

  return <div>用户数：{userCount}</div>;
}

// ✅ 直接计算
function Component({ users }) {
  return <div>用户数：{users.length}</div>;
}
```

### Lift State Up Carefully

```typescript
// ❌ 状态提升过高，导致不必要的重渲染
function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Header />
      <SearchBox value={searchQuery} onChange={setSearchQuery} />
      <SearchResults query={searchQuery} />
      <Footer />
    </>
  );
}

// ✅ 状态放在需要的组件中
function App() {
  return (
    <>
      <Header />
      <SearchSection />
      <Footer />
    </>
  );
}

function SearchSection() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <SearchBox value={searchQuery} onChange={setSearchQuery} />
      <SearchResults query={searchQuery} />
    </>
  );
}
```

## Network Optimization

### Request Deduplication

```typescript
/**
 * 请求去重
 * 避免重复请求相同的数据
 */
const requestCache = new Map();

async function fetchUser(userId: string): Promise<User> {
  // 检查缓存
  if (requestCache.has(userId)) {
    return requestCache.get(userId);
  }

  // 发起请求
  const promise = api.get(`/users/${userId}`);
  requestCache.set(userId, promise);

  try {
    const user = await promise;
    return user;
  } catch (error) {
    // 失败时清除缓存
    requestCache.delete(userId);
    throw error;
  }
}
```

### Prefetching

```typescript
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * 预加载链接目标
 * 鼠标悬停时预加载
 */
function NavigationLink({ to, children }) {
  const handleMouseEnter = () => {
    // 预加载路由组件
    import(`./pages/${to}`);
  };

  return (
    <Link to={to} onMouseEnter={handleMouseEnter}>
      {children}
    </Link>
  );
}
```

## Performance Monitoring

### Web Vitals

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

/**
 * 监控核心性能指标
 */
function reportWebVitals() {
  getCLS(console.log); // Cumulative Layout Shift
  getFID(console.log); // First Input Delay
  getFCP(console.log); // First Contentful Paint
  getLCP(console.log); // Largest Contentful Paint
  getTTFB(console.log); // Time to First Byte
}
```

### React DevTools Profiler

```typescript
import { Profiler } from 'react';

/**
 * 性能分析
 * 测量组件渲染时间
 */
function App() {
  const onRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    console.log(`${id} (${phase}) took ${actualDuration}ms`);
  };

  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Dashboard />
    </Profiler>
  );
}
```

## Best Practices Summary

1. **Code splitting**: Lazy load routes and heavy components
2. **Memoization**: Use useMemo, useCallback, React.memo appropriately
3. **Image optimization**: Lazy load, use responsive images, modern formats
4. **Debounce/throttle**: Optimize frequent operations
5. **Virtual scrolling**: For long lists
6. **Tree shaking**: Import only what you need
7. **State management**: Avoid unnecessary state, lift state carefully
8. **Network optimization**: Deduplicate requests, prefetch when appropriate
9. **Monitor performance**: Use Web Vitals and React DevTools Profiler

## Performance Checklist

- [ ] Route-level code splitting implemented
- [ ] Heavy components lazy loaded
- [ ] Images lazy loaded with loading="lazy"
- [ ] Expensive computations memoized with useMemo
- [ ] Event handlers memoized with useCallback
- [ ] Pure components wrapped with React.memo
- [ ] Search inputs debounced
- [ ] Scroll handlers throttled
- [ ] Long lists use virtual scrolling
- [ ] Bundle size optimized (tree shaking)
- [ ] No unnecessary state
- [ ] State lifted only when needed
- [ ] Requests deduplicated
- [ ] Performance monitored
