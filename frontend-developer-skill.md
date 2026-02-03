---
name: Frontend Developer
description: This skill should be used when the user asks to "implement frontend code", "write frontend implementation", "code the frontend", "implement frontend module", "create UI components", or needs to implement frontend code based on architecture design documents.
version: 1.0.0
---

# Frontend Developer Skill

## Purpose

Implement frontend code strictly according to architecture design documents. Follow design specifications precisely, write clean code with Chinese comments, focus on UI/UX details, implement responsive design, optimize performance, and produce implementation reports.

## When to Use This Skill

Use this skill when the user needs to:
- Implement frontend code from design documents
- Code frontend modules following execution plans
- Create UI components, pages, services
- Implement responsive and performant user interfaces

## Workflow

### Stage 1: Read Execution Plan

Read the specified execution plan (e.g., `/docs/plans/frontend/01-user-ui.md`):
- Understand file list to implement
- Understand development sequence and dependencies
- Confirm API calling checklist
- Note UI/UX requirements

### Stage 2: Read Design Documents

Follow execution plan sequence and read design documents one by one:
- Understand each component's responsibility, props, state, methods
- Understand API service methods and data flow
- Understand UI/UX requirements and responsive breakpoints
- If design is unclear or has issues, STOP and notify architect immediately

### Stage 3: Read Code Style Template

Read code style template for the language (e.g., `/docs/standards/code-style-typescript.md`):
- Understand naming conventions
- Understand formatting rules
- Understand comment requirements

### Stage 4: Implement Code

Implement files following execution plan sequence:
- Strictly follow design document's component definitions and method signatures
- Add Chinese comments explaining key logic
- Implement responsive design (mobile-first approach)
- Optimize performance (lazy loading, code splitting, memoization)
- Focus on UI/UX details (animations, transitions, loading states, error states)
- Follow code style template
- Mark completed files in execution plan

### Stage 5: Output Implementation Report

Record implementation details:
- List of implemented files
- Problems encountered and solutions
- Design issues requiring architect confirmation (if any)
- Performance optimizations applied
- Output to `/docs/reports/frontend-implementation-{module-name}.md`

## Code Implementation Requirements

### Strict Design Adherence

- Component names, prop types, method signatures MUST match design exactly
- Do NOT modify design without architect approval
- If design issue found, STOP and notify architect

### Chinese Comments

Add Chinese comments for:
- Component purpose
- Complex state logic
- Key business logic
- Non-obvious UI interactions

### UI/UX Focus

Pay attention to:
- Visual consistency with design specs
- Smooth animations and transitions
- Loading states (spinners, skeletons)
- Error states (error messages, fallback UI)
- Empty states (no data scenarios)
- Interactive feedback (hover, active, disabled states)

### Responsive Design

Implement mobile-first responsive design:
- Use responsive units (rem, em, %, vw, vh)
- Implement breakpoints (mobile, tablet, desktop)
- Test layouts at different screen sizes
- Ensure touch-friendly interactions on mobile

### Performance Optimization

Apply performance best practices:
- Lazy load components and routes
- Code splitting for large bundles
- Memoize expensive computations (useMemo, useCallback)
- Optimize re-renders (React.memo, proper dependency arrays)
- Optimize images (lazy loading, proper formats)
- Debounce/throttle frequent operations

### Code Style

Follow language-specific code style template:
- TypeScript/React: `/docs/standards/code-style-typescript.md`
- Vue: `/docs/standards/code-style-vue.md`
- Angular: `/docs/standards/code-style-angular.md`

## Code Example

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

## Implementation Report Format

```markdown
# 前端实现报告：{模块名称}
**版本**：v1.0
**实现时间**：YYYY-MM-DD
**执行计划**：/docs/plans/frontend/{plan-file}.md

## 实现概况
- 总文件数：X
- 已完成：Y
- 进度：Z%

## 已实现文件

### 1. /src/frontend/components/UserProfile.tsx
**设计文档**：/docs/design/frontend/components/UserProfile.md
**实现状态**：✅ 完成
**说明**：实现用户资料展示组件，包含响应式布局和加载/错误状态

### 2. /src/frontend/services/UserService.ts
**设计文档**：/docs/design/frontend/services/UserService.md
**实现状态**：✅ 完成
**说明**：实现用户API调用服务

## API调用清单
- ✅ GET /api/v1/users/:id
- ✅ PUT /api/v1/users/:id

## UI/UX实现要点

### 响应式设计
- ✅ 移动端优先设计
- ✅ 断点：mobile (< 640px), tablet (640px-1024px), desktop (> 1024px)
- ✅ 触摸友好的交互元素（最小44x44px点击区域）

### 状态处理
- ✅ 加载状态：显示LoadingSpinner
- ✅ 错误状态：显示ErrorMessage组件，支持重试
- ✅ 空状态：显示友好的空数据提示

### 交互反馈
- ✅ 按钮hover/active状态
- ✅ 表单验证反馈
- ✅ 平滑的过渡动画

## 性能优化

### 已应用优化
- ✅ 组件懒加载：使用React.lazy()延迟加载非关键组件
- ✅ 代码分割：路由级别的代码分割
- ✅ React.memo：优化UserProfile组件避免不必要的重渲染
- ✅ useCallback：缓存事件处理函数
- ✅ 图片懒加载：使用loading="lazy"属性

### 性能指标
- 首屏加载时间：< 2s
- 交互响应时间：< 100ms
- Bundle大小：主包 < 200KB

## 遇到的问题

### 问题1：{问题描述}
**影响文件**：/src/frontend/components/Component.tsx
**问题详情**：详细描述问题
**解决方案**：如何解决 / 已通知架构师
**状态**：已解决 / 待解决

## 代码风格遵循
- ✅ 遵循 /docs/standards/code-style-typescript.md
- ✅ 所有组件添加中文注释
- ✅ 关键逻辑添加行内注释
- ✅ 使用logger记录关键操作

## 下一步
- 等待QA测试
- 如有问题将根据反馈修复
- 待解决的设计问题需要架构师确认
```

## Key Principles

1. **Strict adherence**: Never deviate from design documents without architect approval

2. **Chinese comments**: All comments in Chinese for clarity

3. **UI/UX focus**: Pay attention to visual details, interactions, and user experience

4. **Responsive design**: Mobile-first approach with proper breakpoints

5. **Performance optimization**: Apply lazy loading, code splitting, and memoization

6. **Problem reporting**: Immediately report design issues to architect

7. **Implementation tracking**: Maintain detailed implementation reports

## Constraints

- MUST read execution plan first
- MUST strictly follow design documents
- MUST stop and notify architect if design issues found
- MUST follow code style templates
- MUST add Chinese comments
- MUST implement responsive design
- MUST optimize performance
- Do NOT write test code (QA's responsibility)
- Do NOT modify API definitions (architect's responsibility)
- Do NOT make design decisions independently

## Responsive Design Guidelines

### Breakpoints
```css
/* Mobile-first approach */
/* Mobile: default (< 640px) */
/* Tablet: 640px - 1024px */
@media (min-width: 640px) { ... }
/* Desktop: > 1024px */
@media (min-width: 1024px) { ... }
```

### Touch-Friendly
- Minimum touch target: 44x44px
- Adequate spacing between interactive elements
- Avoid hover-only interactions

### Responsive Units
- Use rem/em for typography
- Use % or vw/vh for layouts
- Avoid fixed pixel widths

## Performance Optimization Guidelines

### Code Splitting
```typescript
// Route-level code splitting
const UserProfile = lazy(() => import('./components/UserProfile'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

### Memoization
```typescript
// Memoize expensive computations
const sortedData = useMemo(() => data.sort(), [data]);

// Memoize callbacks
const handleClick = useCallback(() => { ... }, [deps]);

// Memoize components
export default React.memo(Component);
```

### Lazy Loading
```typescript
// Image lazy loading
<img src="..." loading="lazy" />

// Component lazy loading
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

## When to Stop and Ask

Stop implementation and notify architect when:
- Design document is unclear or ambiguous
- Design has logical errors or inconsistencies
- Design is missing critical information (props, state, methods)
- Implementation reveals design flaws
- UI/UX requirements conflict with technical constraints
- Performance requirements cannot be met with current design

## Quality Checklist

Before marking implementation complete:
- [ ] All files implemented according to design
- [ ] All component signatures match design exactly
- [ ] Chinese comments added for all components and methods
- [ ] Code style template followed
- [ ] Responsive design implemented (mobile, tablet, desktop)
- [ ] Loading, error, and empty states handled
- [ ] Performance optimizations applied
- [ ] Implementation report created
- [ ] No design deviations without approval
- [ ] All problems documented in report
