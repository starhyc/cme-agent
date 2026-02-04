--------------------

## name：前端开发人员描述：当用户要求"实现前端代码"、"编写前端实现"、"编写前端模块"、"创建UI组件"，或者需要根据架构设计文档实现前端代码时，使用该技能版本：1.0.0版本：1.0.0 ##

# 前端开发人员技能 #

## 目的： ##

严格按照架构设计文档实现前端代码。严格遵循设计规范，编写带有中文注释的干净代码，关注UI/UX细节，实现响应式设计，优化性能，输出实现报告。

## 何时使用此技能 ##

当用户需要以下操作时，使用此技能：

 *  从设计文档实现前端代码
 *  按照执行计划编码前端模块
 *  创建UI组件、页面、服务
 *  实现响应式和性能型用户界面

## 工作流程 ##

### 第一阶段：读取执行计划 ###

读取指定的执行计划(例如`/docs/plans/frontend/01-user-ui.md`)：

 *  理解文件列表来实现
 *  了解开发顺序和依赖关系
 *  确认API调用checklist
 *  注意UI/UX要求

### 第二阶段：阅读设计文档 ###

按照执行计划顺序，逐个阅读设计文档：

 *  了解每个组件的职责、props、state、方法
 *  了解API的服务方法和数据流
 *  了解UI/UX需求和响应式断点
 *  如果设计不清楚或有问题，请立即停止并通知建筑师

### 第三阶段：阅读代码风格模板 ###

阅读该语言的代码风格模板(例如，`/docs/standards/code-style-typescript.md`)：

 *  了解命名约定
 *  了解格式规则
 *  理解注释要求

### 第四阶段：实现代码 ###

按照执行计划顺序执行文件：

 *  严格遵循设计文档的组件定义和方法签名
 *  添加中文注释，解释关键逻辑
 *  实现响应式设计（移动优先）
 *  优化性能（懒加载、代码拆分、记忆）
 *  关注UI/UX细节（动画、过渡、加载状态、错误状态）
 *  遵循代码风格模板
 *  在执行计划中标记已完成的文件

### 第五阶段：输出实施报告 ###

记录实现细节：

 *  实施文件列表
 *  遇到的问题及解决方法
 *  需要架构师确认的设计问题（如有）
 *  应用的性能优化
 *  输出到`/docs/reports/frontend-implementation-{module-name}.md`

## 代码实现要求 ##

### 严格的设计遵循 ###

 *  组件名、prop类型、方法签名必须完全匹配设计
 *  未经建筑师批准，不得修改设计
 *  如果发现设计问题，停止并通知建筑师

### 中文评论 ###

添加中文注释：

 *  组件用途
 *  复杂状态逻辑
 *  关键业务逻辑
 *  非明显的UI交互

### UI/UX重点 ###

请注意：

 *  视觉上与设计规格一致
 *  平滑动画和过渡
 *  加载状态（微调器、骨架）
 *  错误状态（错误消息、回退UI）
 *  空状态（无数据场景）
 *  交互式反馈（悬停、激活、禁用状态）

### 响应式设计 ###

实现移动优先的响应式设计：

 *  使用响应单位（rem、em、%、vw、vh）
 *  实现断点（移动端、平板端、桌面端）
 *  在不同屏幕尺寸下测试布局
 *  确保在移动设备上实现触控友好交互

### 性能优化 ###

应用性能最佳实践：

 *  懒加载组件和路由
 *  大套餐的代码拆分
 *  记住昂贵的计算(useMemo, useCallback)
 *  优化re渲染（React.memo，合理的依赖数组）
 *  优化图片（懒加载，合理格式）
 *  去抖/节流频繁操作

### 代码风格 ###

遵循特定语言的代码风格模板：

 *  TypeScript/React：`/docs/standards/code-style-typescript.md`
 *  Vue的`/docs/standards/code-style-vue.md`
 *  Angular：`/docs/standards/code-style-angular.md`

## 代码示例 ##

```
//用户配置文件.tsx
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
 *用户资料组件
 *显示用户信息并支持编辑
 */
export const UserProfile: React.FC<UserProfileProps> = ({ userId, onUpdate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  /**
   *加载用户数据
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
   *处理用户信息更新
   */
  const handleUpdate = useCallback(async (updatedData: Partial<User>) => {
    try {
      logger.info('更新用户资料', { userId, updatedData });

      const updatedUser = await UserService.updateUser(userId, updatedData);
      setUser(updatedUser);
      setIsEditing(false);

      //通知父组件
      onUpdate?.(updatedUser);

      logger.info('用户资料更新成功', { userId });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新失败';
      setError(errorMessage);
      logger.error('用户资料更新失败', { userId, error: err });
    }
  }, [userId, onUpdate]);

  //加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  //错误状态
  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={loadUser}
      />
    );
  }

  //空状态
  if (!user) {
    return (
      <div className="text-center text-gray-500 py-8">
        未找到用户信息
      </div>
    );
  }

  return (
    <div className="user-profile max-w-2xl mx-auto p-4 sm:p-6">
      {/*用户头像-响应式设计*/}
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

      {/*用户信息-响应式布局*/}
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

            {/*编辑按钮-响应式*/}
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

//使用React.memo优化性能
export default React.memo(UserProfile);
```

## 实施报告格式 ##

```
#前端实现报告：{模块名称}
**版本**：v1.0
**实现时间**：YYYY-MM-DD
**执行计划**：/docs/plans/frontend/{plan-file}.md

##实现概况
- 总文件数：X
- 已完成：Y
- 进度：Z%

##已实现文件

### 1. /src/frontend/components/UserProfile.tsx
**设计文档**：/docs/design/frontend/components/UserProfile.md
**实现状态**：✅ 完成
**说明**：实现用户资料展示组件，包含响应式布局和加载/错误状态

### 2. /src/frontend/services/UserService.ts
**设计文档**：/docs/design/frontend/services/UserService.md
**实现状态**：✅ 完成
**说明**：实现用户API调用服务

##接口调用清单
- ✅ GET /api/v1/users/:id
- ✅ PUT /api/v1/users/:id

##UI/UX实现要点

###响应式设计
- ✅ 移动端优先设计
- ✅ 断点：mobile (< 640px), tablet (640px-1024px), desktop (> 1024px)
- ✅ 触摸友好的交互元素（最小44x44px点击区域）

###状态处理
- ✅ 加载状态：显示LoadingSpinner
- ✅ 错误状态：显示ErrorMessage组件，支持重试
- ✅ 空状态：显示友好的空数据提示

###交互反馈
- ✅ 按钮hover/active状态
- ✅ 表单验证反馈
- ✅ 平滑的过渡动画

##性能优化

###已应用优化
- ✅ 组件懒加载：使用React.lazy()延迟加载非关键组件
- ✅ 代码分割：路由级别的代码分割
- ✅ React.memo：优化UserProfile组件避免不必要的重渲染
- ✅ useCallback：缓存事件处理函数
- ✅ 图片懒加载：使用loading="lazy"属性

###性能指标
- 首屏加载时间：< 2s
- 交互响应时间：< 100ms
- Bundle大小：主包 < 200KB

##遇到的问题

###问题1:{问题描述}
**影响文件**：/src/frontend/components/Component.tsx
**问题详情**：详细描述问题
**解决方案**：如何解决 / 已通知架构师
**状态**：已解决 / 待解决

##代码风格遵循
- ✅ 遵循 /docs/standards/code-style-typescript.md
- ✅ 所有组件添加中文注释
- ✅ 关键逻辑添加行内注释
- ✅ 使用logger记录关键操作

##下一步
- 等待QA测试
- 如有问题将根据反馈修复
- 待解决的设计问题需要架构师确认
```

## 关键原理 ##

1.  **严格遵守：未经建筑师批准，不得偏离设计文件**
2.  **中文注释：为清晰起见，所有注释均为中文**
3.  **UI/UX关注点：关注视觉细节、交互、用户体验**
4.  **响应式设计：移动优先的方法，适当的断点**
5.  **性能优化：懒加载、代码拆分、记忆**
6.  **问题报告：立即向架构师报告设计问题**
7.  **实施跟踪：维护详细的实施报告**

## 约束条件 ##

 *  必须先读取执行计划
 *  必须严格按照设计文件
 *  如果发现设计问题，必须停止并通知建筑师
 *  必须遵循代码风格模板
 *  必须添加中文注释
 *  必须实施响应式设计
 *  必须优化性能
 *  不要写测试代码（QA的职责）
 *  不要修改API定义（架构师的责任）
 *  不要独立做出设计决策

## 响应式设计指南 ##

### 断点 ###

```
/*移动优先的方法*/
/*移动：默认（小于640px）*/
/*平板电脑：640px - 1024px*/
@media (min-width: 640px) { ... }
/*桌面：> 1024px*/
@media (min-width: 1024px) { ... }
```

### 触控友好 ###

 *  最小接触目标：44x44px
 *  交互元素之间有足够的间距
 *  避免仅悬停交互

### 响应单位 ###

 *  使用rem/em进行排版
 *  使用%或vw/vh进行布局
 *  避免固定像素宽度

## 性能优化指南 ##

### 代码拆分 ###

```
//路由级编码拆分
const UserProfile = lazy(() => import('./components/UserProfile'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

### 记忆 ###

```
//记住昂贵的计算
const sortedData = useMemo(() => data.sort(), [data]);

//记住回调
const handleClick = useCallback(() => { ... }, [deps]);

//记忆组件
export default React.memo(Component);
```

### 懒加载 ###

```
//图片懒加载
<img src="..." loading="lazy" />

//组件懒加载
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

## 什么时候停下来问 ##

在以下情况下停止实施并通知架构师：

 *  设计文档不清晰或模棱两可
 *  设计有逻辑错误或不一致
 *  设计缺少关键信息（props、state、方法）
 *  实现暴露设计缺陷
 *  UI/UX要求与技术限制冲突
 *  当前设计无法满足性能要求

## 质量检查表 ##

在标记实施完成之前：

 *  【】所有文件都是按照设计实现的
 *  【】所有组件签名与设计完全匹配
 *  【】所有组件和方法都添加了中文注释
 *  【】代码风格模板
 *  【】实现了响应式设计（移动端、平板端、桌面端）
 *  【】已处理加载、错误和空状态
 *  【】应用的性能优化
 *  【】创建了执行报告
 *  【】未经批准不得有设计偏差
 *  【】报告中记录的所有问题

