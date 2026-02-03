# 前端详细设计文档索引

**项目名称**: 问题定位助手 - 前端
**文档版本**: 1.0
**创建日期**: 2026-02-03

---

## 设计文档结构

本目录包含前端所有模块的详细设计文档，每个文档对应一个组件或服务。

### 目录结构映射

```
docs/design/frontend/         →  frontend/src/
├── auth/                     →  src/features/auth/
│   ├── LoginPage.md          →  auth/LoginPage.tsx
│   └── AuthContext.md        →  auth/AuthContext.tsx
├── dashboard/                →  src/features/dashboard/
│   └── Dashboard.md          →  dashboard/Dashboard.tsx
├── ticket/                   →  src/features/ticket/
│   ├── TicketList.md         →  ticket/TicketList.tsx
│   ├── TicketDetail.md       →  ticket/TicketDetail.tsx
│   └── CreateTicket.md       →  ticket/CreateTicket.tsx
├── diagnosis/                →  src/features/diagnosis/
│   ├── LogUploader.md        →  diagnosis/LogUploader.tsx
│   ├── LogTimeline.md        →  diagnosis/LogTimeline.tsx
│   ├── AnalysisResult.md     →  diagnosis/AnalysisResult.tsx
│   └── CallChainGraph.md     →  diagnosis/CallChainGraph.tsx
├── code_viewer/              →  src/features/code/
│   ├── CodeSearch.md         →  code/CodeSearch.tsx
│   ├── CodeViewer.md         →  code/CodeViewer.tsx
│   └── FlowDiagram.md        →  code/FlowDiagram.tsx
├── report/                   →  src/features/report/
│   ├── ReportList.md         →  report/ReportList.tsx
│   └── ReportGenerator.md    →  report/ReportGenerator.tsx
├── settings/                 →  src/features/settings/
│   ├── ServerConfig.md       →  settings/ServerConfig.tsx
│   └── UserManagement.md     →  settings/UserManagement.tsx
└── common/                   →  src/common/
    ├── api_client.md         →  common/apiClient.ts
    ├── websocket_client.md   →  common/websocketClient.ts
    └── store.md              →  common/store.ts
```

---

## 核心模块概览

### 1. 认证模块 (auth)
- **LoginPage.md**: 登录页面组件
- **AuthContext.md**: 认证上下文和状态管理

### 2. 仪表盘模块 (dashboard)
- **Dashboard.md**: 主仪表盘，显示统计信息

### 3. 工单管理模块 (ticket)
- **TicketList.md**: 工单列表页面
- **TicketDetail.md**: 工单详情页面
- **CreateTicket.md**: 创建工单表单

### 4. 诊断分析模块 (diagnosis)
- **LogUploader.md**: 日志上传组件
- **LogTimeline.md**: 日志时间线可视化
- **AnalysisResult.md**: 分析结果展示
- **CallChainGraph.md**: 调用链路图

### 5. 代码查看模块 (code_viewer)
- **CodeSearch.md**: 代码搜索组件
- **CodeViewer.md**: 代码查看器（Monaco Editor）
- **FlowDiagram.md**: 业务流程图展示

### 6. 报告管理模块 (report)
- **ReportList.md**: 报告列表
- **ReportGenerator.md**: 报告生成配置

### 7. 设置模块 (settings)
- **ServerConfig.md**: SSH服务器配置
- **UserManagement.md**: 用户管理（仅管理员）

### 8. 公共模块 (common)
- **api_client.md**: HTTP API客户端
- **websocket_client.md**: WebSocket客户端
- **store.md**: 全局状态管理

---

## 设计文档规范

每个设计文档必须包含以下章节：

### 1. 组件概述
- 组件职责
- 在页面中的位置
- 父子组件关系

### 2. 组件接口
```typescript
interface ComponentProps {
  // Props定义
}
```

### 3. 状态管理
- 本地状态（useState）
- 全局状态（Zustand）
- 服务端状态（React Query）

### 4. 事件处理
- 用户交互事件
- 数据变更事件
- WebSocket事件

### 5. API调用
- 调用的API端点
- 请求参数
- 响应处理

### 6. 性能优化
- 使用的优化技术（memo, useMemo, useCallback等）
- 懒加载策略
- 虚拟滚动

### 7. 响应式设计
- 断点定义
- 移动端适配

---

## 阅读顺序建议

### 新手入门
1. common/api_client.md - 了解API调用规范
2. common/store.md - 了解状态管理
3. auth/LoginPage.md - 了解页面结构

### 核心业务流程
1. ticket/CreateTicket.md - 创建工单
2. diagnosis/LogUploader.md - 上传日志
3. diagnosis/AnalysisResult.md - 查看分析结果
4. report/ReportGenerator.md - 生成报告

---

**文档结束**
