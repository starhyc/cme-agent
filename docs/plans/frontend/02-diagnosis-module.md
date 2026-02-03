# 前端执行计划 - 模块02：诊断分析模块

**模块名称**: 诊断分析模块 (Diagnosis)
**优先级**: P0 - 核心功能
**依赖**: 认证布局模块
**预计工作量**: 大
**负责人**: Frontend Developer

---

## 1. 模块概述

实现日志上传、时间线展示、分析结果可视化、调用链路图等核心诊断功能。

### 核心功能
- 日志文件上传（拖拽、分块）
- SSH服务器配置
- 日志时间线可视化
- 分析结果展示
- 调用链路图（ReactFlow）

---

## 2. 实现文件清单

- `src/features/diagnosis/LogUploader.tsx` - 日志上传
- `src/features/diagnosis/SSHConfig.tsx` - SSH配置
- `src/features/diagnosis/LogTimeline.tsx` - 时间线
- `src/features/diagnosis/AnalysisResult.tsx` - 分析结果
- `src/features/diagnosis/CallChainGraph.tsx` - 调用链图
- `src/features/diagnosis/DiagnosisPage.tsx` - 主页面

---

## 3. 核心任务

### 任务3.1: 日志上传组件
```typescript
export const LogUploader: React.FC = () => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    // 分块上传逻辑
    const chunkSize = 10 * 1024 * 1024; // 10MB
    // 上传进度显示
  };

  return (
    <Upload.Dragger
      beforeUpload={handleUpload}
      accept=".log,.txt"
      maxCount={10}
    >
      拖拽日志文件到此处
    </Upload.Dragger>
  );
};
```

### 任务3.2: 日志时间线
```typescript
export const LogTimeline: React.FC<{ticketId: number}> = ({ticketId}) => {
  // 使用ECharts展示多模块日志时间线
  // 支持缩放、筛选、高亮ERROR日志
  return <div ref={chartRef} style={{height: 600}} />;
};
```

### 任务3.3: 调用链路图
```typescript
export const CallChainGraph: React.FC<{data: CallChainData}> = ({data}) => {
  // 使用ReactFlow展示调用链路
  // 错误节点标红
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      fitView
    />
  );
};
```

### 任务3.4: 分析结果展示
```typescript
export const AnalysisResult: React.FC = () => {
  // 展示异常检测、根因分析、调用链路
  // 支持展开/折叠、代码跳转
  return (
    <Tabs>
      <TabPane tab="异常检测" key="anomaly">
        <AnomalyList />
      </TabPane>
      <TabPane tab="根因分析" key="root_cause">
        <RootCauseView />
      </TabPane>
      <TabPane tab="调用链路" key="call_chain">
        <CallChainGraph />
      </TabPane>
    </Tabs>
  );
};
```

---

## 4. WebSocket集成

```typescript
// 实时接收分析进度
const ws = new WebSocket(`ws://api/v1/ws/tasks/${taskId}`);
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'progress') {
    setProgress(data.data.progress);
  }
};
```

---

## 5. 完成标准

- [ ] 支持拖拽上传
- [ ] 时间线流畅展示
- [ ] 调用链路图清晰
- [ ] 实时进度更新
- [ ] 响应式设计

---

**文档结束**
