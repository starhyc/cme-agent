# 前端执行计划 - 模块03：代码查看模块

**模块名称**: 代码查看模块 (Code Viewer)
**优先级**: P0 - 核心功能
**依赖**: 认证布局模块
**预计工作量**: 中等
**负责人**: Frontend Developer

---

## 1. 模块概述

实现代码搜索、查看、解释和业务流程图展示功能。

### 核心功能
- 代码语义搜索
- Monaco Editor代码查看
- AI代码解释展示
- 业务流程图（Mermaid）

---

## 2. 实现文件清单

- `src/features/code/CodeSearch.tsx` - 代码搜索
- `src/features/code/CodeViewer.tsx` - 代码查看器
- `src/features/code/CodeExplanation.tsx` - 代码解释
- `src/features/code/FlowDiagram.tsx` - 流程图
- `src/features/code/CodePage.tsx` - 主页面

---

## 3. 核心任务

### 任务3.1: 代码搜索组件
```typescript
export const CodeSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const response = await apiClient.get('/api/v1/code/search', {
      params: { query, limit: 10 }
    });
    setResults(response.data.results);
  };

  return (
    <div>
      <Input.Search
        placeholder="搜索代码..."
        onSearch={handleSearch}
        enterButton
      />
      <List
        dataSource={results}
        renderItem={(item) => (
          <List.Item onClick={() => viewCode(item)}>
            <List.Item.Meta
              title={`${item.class_name}.${item.function_name}`}
              description={item.file_path}
            />
          </List.Item>
        )}
      />
    </div>
  );
};
```

### 任务3.2: Monaco Editor集成
```typescript
import Editor from '@monaco-editor/react';

export const CodeViewer: React.FC<{code: string, language: string}> = ({code, language}) => {
  return (
    <Editor
      height="600px"
      language={language}
      value={code}
      theme="vs-dark"
      options={{
        readOnly: true,
        minimap: { enabled: true },
        fontSize: 14
      }}
    />
  );
};
```

### 任务3.3: 代码解释展示
```typescript
export const CodeExplanation: React.FC<{explanation: any}> = ({explanation}) => {
  return (
    <Card title="代码解释">
      <Descriptions column={1}>
        <Descriptions.Item label="功能概述">
          {explanation.summary}
        </Descriptions.Item>
        <Descriptions.Item label="参数">
          <List
            dataSource={explanation.parameters}
            renderItem={(param) => (
              <List.Item>
                <strong>{param.name}</strong>: {param.description}
              </List.Item>
            )}
          />
        </Descriptions.Item>
        <Descriptions.Item label="返回值">
          {explanation.return_value.description}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
```

### 任务3.4: Mermaid流程图
```typescript
import mermaid from 'mermaid';

export const FlowDiagram: React.FC<{diagram: string}> = ({diagram}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      mermaid.initialize({ startOnLoad: true });
      mermaid.render('mermaid-diagram', diagram).then(({svg}) => {
        containerRef.current!.innerHTML = svg;
      });
    }
  }, [diagram]);

  return <div ref={containerRef} />;
};
```

---

## 4. 完成标准

- [ ] 代码搜索响应<2秒
- [ ] Monaco Editor语法高亮正确
- [ ] 代码解释清晰展示
- [ ] 流程图正确渲染
- [ ] 响应式设计

---

**文档结束**
