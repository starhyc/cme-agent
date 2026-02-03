# 前端执行计划 - 模块04：报告管理模块

**模块名称**: 报告管理模块 (Report Management)
**优先级**: P0 - 核心功能
**依赖**: 认证布局模块
**预计工作量**: 小
**负责人**: Frontend Developer

---

## 1. 模块概述

实现报告生成配置、列表查看、下载功能。

### 核心功能
- 报告生成配置
- 报告列表展示
- 报告预览
- 报告下载

---

## 2. 实现文件清单

- `src/features/report/ReportGenerator.tsx` - 报告生成配置
- `src/features/report/ReportList.tsx` - 报告列表
- `src/features/report/ReportPreview.tsx` - 报告预览
- `src/features/report/ReportPage.tsx` - 主页面

---

## 3. 核心任务

### 任务3.1: 报告生成配置
```typescript
export const ReportGenerator: React.FC<{ticketId: number}> = ({ticketId}) => {
  const [form] = Form.useForm();
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async (values: any) => {
    setGenerating(true);
    try {
      const response = await apiClient.post('/api/v1/reports/generate', {
        ticket_id: ticketId,
        report_type: values.report_type,
        sections: values.sections
      });

      message.success('报告生成中，请稍后查看');
      // 轮询任务状态
      pollTaskStatus(response.data.task_id);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Form form={form} onFinish={handleGenerate}>
      <Form.Item name="report_type" label="报告格式">
        <Radio.Group>
          <Radio value="pdf">PDF</Radio>
          <Radio value="markdown">Markdown</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item name="sections" label="包含章节">
        <Checkbox.Group>
          <Checkbox value="summary">问题概述</Checkbox>
          <Checkbox value="phenomenon">问题现象</Checkbox>
          <Checkbox value="root_cause">根因分析</Checkbox>
          <Checkbox value="solution">解决方案</Checkbox>
          <Checkbox value="improvement">改进建议</Checkbox>
        </Checkbox.Group>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={generating}>
          生成报告
        </Button>
      </Form.Item>
    </Form>
  );
};
```

### 任务3.2: 报告列表
```typescript
export const ReportList: React.FC<{ticketId?: number}> = ({ticketId}) => {
  const { data, isLoading } = useQuery({
    queryKey: ['reports', ticketId],
    queryFn: () => apiClient.get('/api/v1/reports', {
      params: { ticket_id: ticketId }
    })
  });

  const handleDownload = (reportId: number) => {
    window.open(`/api/v1/reports/${reportId}/download`, '_blank');
  };

  return (
    <Table
      loading={isLoading}
      dataSource={data?.data.items}
      columns={[
        {
          title: '工单ID',
          dataIndex: 'ticket_id',
          key: 'ticket_id'
        },
        {
          title: '报告类型',
          dataIndex: 'report_type',
          key: 'report_type',
          render: (type) => type.toUpperCase()
        },
        {
          title: '生成时间',
          dataIndex: 'created_at',
          key: 'created_at',
          render: (date) => new Date(date).toLocaleString()
        },
        {
          title: '操作',
          key: 'action',
          render: (_, record) => (
            <Space>
              <Button
                type="link"
                icon={<DownloadOutlined />}
                onClick={() => handleDownload(record.id)}
              >
                下载
              </Button>
            </Space>
          )
        }
      ]}
    />
  );
};
```

### 任务3.3: 报告预览（Markdown）
```typescript
import ReactMarkdown from 'react-markdown';

export const ReportPreview: React.FC<{content: string}> = ({content}) => {
  return (
    <div className="markdown-preview">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};
```

---

## 4. 完成标准

- [ ] 报告生成配置完整
- [ ] 报告列表正确展示
- [ ] 下载功能正常
- [ ] Markdown预览正确
- [ ] 响应式设计

---

**文档结束**
