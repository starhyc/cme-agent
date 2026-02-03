# Responsive Design Guidelines

This file contains responsive design guidelines, breakpoints, and mobile-first implementation patterns.

## Breakpoints

### Standard Breakpoints

```css
/* Mobile-first approach */
/* Mobile: default (< 640px) */

/* Tablet: 640px - 1024px */
@media (min-width: 640px) { ... }

/* Desktop: > 1024px */
@media (min-width: 1024px) { ... }

/* Large Desktop: > 1280px */
@media (min-width: 1280px) { ... }
```

### Tailwind CSS Breakpoints

```typescript
// 使用 Tailwind 响应式类
<div className="
  w-full           // mobile: 100% width
  sm:w-1/2         // tablet: 50% width
  lg:w-1/3         // desktop: 33% width
">
```

## Mobile-First Approach

### Why Mobile-First?

1. **Performance**: Start with minimal CSS, add complexity for larger screens
2. **Progressive Enhancement**: Ensure core functionality works on all devices
3. **Simpler Media Queries**: Add features as screen size increases

### Mobile-First Example

```typescript
// ❌ Desktop-first (不推荐)
<div className="
  w-1/3           // desktop default
  md:w-1/2        // tablet override
  sm:w-full       // mobile override
">

// ✅ Mobile-first (推荐)
<div className="
  w-full          // mobile default
  sm:w-1/2        // tablet enhancement
  lg:w-1/3        // desktop enhancement
">
```

## Layout Patterns

### Pattern 1: Stacked to Side-by-Side

```typescript
/**
 * 移动端垂直堆叠，桌面端水平排列
 */
<div className="flex flex-col sm:flex-row gap-4">
  <div className="w-full sm:w-1/2">左侧内容</div>
  <div className="w-full sm:w-1/2">右侧内容</div>
</div>
```

### Pattern 2: Grid Responsive

```typescript
/**
 * 响应式网格布局
 * 移动端1列，平板2列，桌面3列
 */
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <div key={item.id}>{item.content}</div>
  ))}
</div>
```

### Pattern 3: Hidden on Mobile

```typescript
/**
 * 移动端隐藏，桌面端显示
 */
<div className="hidden lg:block">
  桌面端侧边栏
</div>

/**
 * 移动端显示，桌面端隐藏
 */
<div className="block lg:hidden">
  移动端菜单按钮
</div>
```

## Typography Responsive

### Responsive Font Sizes

```typescript
<h1 className="
  text-2xl        // mobile: 24px
  sm:text-3xl     // tablet: 30px
  lg:text-4xl     // desktop: 36px
">
  响应式标题
</h1>

<p className="
  text-sm         // mobile: 14px
  sm:text-base    // tablet: 16px
  lg:text-lg      // desktop: 18px
">
  响应式正文
</p>
```

### Line Height and Spacing

```typescript
<div className="
  space-y-2       // mobile: 8px spacing
  sm:space-y-4    // tablet: 16px spacing
  lg:space-y-6    // desktop: 24px spacing
">
```

## Touch-Friendly Design

### Minimum Touch Target Size

```typescript
/**
 * 触摸目标最小尺寸：44x44px
 */
<button className="
  min-w-[44px]
  min-h-[44px]
  px-4 py-2
">
  按钮
</button>
```

### Adequate Spacing

```typescript
/**
 * 交互元素之间保持足够间距
 */
<div className="space-y-4">
  <button>按钮1</button>
  <button>按钮2</button>
  <button>按钮3</button>
</div>
```

### Avoid Hover-Only Interactions

```typescript
// ❌ 仅依赖 hover（移动端无法使用）
<div className="hover:bg-blue-500">

// ✅ 同时支持 hover 和 active
<div className="
  hover:bg-blue-500
  active:bg-blue-600
  focus:ring-2
">
```

## Responsive Images

### Responsive Image Sizes

```typescript
/**
 * 响应式图片尺寸
 */
<img
  src={user.avatar}
  alt={user.name}
  className="
    w-16 h-16       // mobile: 64x64px
    sm:w-20 sm:h-20 // tablet: 80x80px
    lg:w-24 lg:h-24 // desktop: 96x96px
    rounded-full
    object-cover
  "
  loading="lazy"
/>
```

### Responsive Background Images

```typescript
<div className="
  bg-cover
  bg-center
  h-48            // mobile: 192px
  sm:h-64         // tablet: 256px
  lg:h-96         // desktop: 384px
"
  style={{ backgroundImage: `url(${imageUrl})` }}
/>
```

## Container Patterns

### Max-Width Container

```typescript
/**
 * 响应式容器
 * 移动端全宽，桌面端限制最大宽度
 */
<div className="
  w-full
  max-w-7xl
  mx-auto
  px-4            // mobile: 16px padding
  sm:px-6         // tablet: 24px padding
  lg:px-8         // desktop: 32px padding
">
```

### Responsive Padding

```typescript
<div className="
  p-4             // mobile: 16px
  sm:p-6          // tablet: 24px
  lg:p-8          // desktop: 32px
">
```

## Navigation Patterns

### Mobile Menu

```typescript
/**
 * 移动端汉堡菜单，桌面端水平导航
 */
const Navigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav>
      {/* 桌面端导航 */}
      <div className="hidden lg:flex space-x-4">
        <a href="/home">首页</a>
        <a href="/about">关于</a>
        <a href="/contact">联系</a>
      </div>

      {/* 移动端菜单按钮 */}
      <button
        className="lg:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        菜单
      </button>

      {/* 移动端菜单 */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <a href="/home">首页</a>
          <a href="/about">关于</a>
          <a href="/contact">联系</a>
        </div>
      )}
    </nav>
  );
};
```

## Form Patterns

### Responsive Form Layout

```typescript
/**
 * 响应式表单布局
 * 移动端垂直堆叠，桌面端两列
 */
<form className="space-y-4">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div>
      <label>姓名</label>
      <input type="text" className="w-full" />
    </div>
    <div>
      <label>邮箱</label>
      <input type="email" className="w-full" />
    </div>
  </div>

  <button className="
    w-full          // mobile: 全宽按钮
    sm:w-auto       // tablet+: 自适应宽度
  ">
    提交
  </button>
</form>
```

## Responsive Units

### Use Relative Units

```css
/* ✅ 推荐：使用相对单位 */
font-size: 1rem;        /* 16px */
padding: 1.5rem;        /* 24px */
width: 50%;
height: 100vh;

/* ❌ 避免：固定像素值 */
font-size: 16px;
padding: 24px;
width: 800px;
```

### Viewport Units

```typescript
/**
 * 使用视口单位实现全屏布局
 */
<div className="
  min-h-screen    // 100vh
  w-screen        // 100vw
">
```

## Testing Responsive Design

### Test at Different Breakpoints

```typescript
// 测试这些宽度
const testWidths = [
  320,  // 小手机
  375,  // iPhone
  414,  // 大手机
  768,  // 平板竖屏
  1024, // 平板横屏/小笔记本
  1280, // 桌面
  1920, // 大桌面
];
```

### Chrome DevTools

1. 打开 DevTools (F12)
2. 点击设备工具栏图标 (Ctrl+Shift+M)
3. 选择不同设备或自定义尺寸
4. 测试横屏和竖屏

## Complete Example

```typescript
/**
 * 用户卡片组件
 * 完整的响应式设计示例
 */
const UserCard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="
      // 容器
      w-full
      max-w-2xl
      mx-auto

      // 内边距
      p-4
      sm:p-6
      lg:p-8

      // 背景和边框
      bg-white
      rounded-lg
      shadow
    ">
      {/* 头像和信息 - 响应式布局 */}
      <div className="
        flex
        flex-col        // mobile: 垂直堆叠
        sm:flex-row     // tablet+: 水平排列
        items-center
        gap-4
        mb-6
      ">
        {/* 头像 - 响应式尺寸 */}
        <img
          src={user.avatar}
          alt={user.name}
          className="
            w-20 h-20
            sm:w-24 sm:h-24
            lg:w-32 lg:h-32
            rounded-full
            object-cover
          "
          loading="lazy"
        />

        {/* 用户信息 - 响应式对齐 */}
        <div className="
          text-center      // mobile: 居中
          sm:text-left     // tablet+: 左对齐
        ">
          <h2 className="
            text-xl
            sm:text-2xl
            lg:text-3xl
            font-bold
          ">
            {user.name}
          </h2>
          <p className="
            text-sm
            sm:text-base
            text-gray-600
          ">
            {user.email}
          </p>
        </div>
      </div>

      {/* 操作按钮 - 响应式布局 */}
      <div className="
        flex
        flex-col        // mobile: 垂直堆叠
        sm:flex-row     // tablet+: 水平排列
        gap-2
      ">
        <button className="
          w-full          // mobile: 全宽
          sm:w-auto       // tablet+: 自适应
          px-6 py-2
          bg-blue-600
          text-white
          rounded-lg
          hover:bg-blue-700
          active:bg-blue-800
          transition-colors
        ">
          编辑
        </button>
        <button className="
          w-full
          sm:w-auto
          px-6 py-2
          border
          border-gray-300
          rounded-lg
          hover:bg-gray-50
          active:bg-gray-100
          transition-colors
        ">
          删除
        </button>
      </div>
    </div>
  );
};
```

## Best Practices Summary

1. **Mobile-first**: Start with mobile styles, enhance for larger screens
2. **Touch-friendly**: Minimum 44x44px touch targets
3. **Relative units**: Use rem, em, %, vw, vh instead of fixed pixels
4. **Test thoroughly**: Test at multiple breakpoints and devices
5. **Avoid hover-only**: Support both hover and active states
6. **Adequate spacing**: Ensure comfortable spacing between interactive elements
7. **Flexible layouts**: Use flexbox and grid for responsive layouts
8. **Responsive images**: Use appropriate sizes for different screens
