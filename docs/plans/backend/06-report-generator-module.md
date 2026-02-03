# 后端执行计划 - 模块06：报告生成模块

**模块名称**: 报告生成模块 (Report Generator)
**优先级**: P0 - 核心功能
**依赖**: 日志分析模块
**预计工作量**: 中等
**负责人**: Backend Developer

---

## 1. 模块概述

自动生成问题分析报告，支持PDF和Markdown格式导出。

### 核心功能
- 报告模板渲染
- PDF生成（WeasyPrint）
- Markdown生成
- 图表生成（matplotlib）
- 报告存储和下载

---

## 2. 实现文件清单

- `app/report_generator/service.py` - 报告生成服务
- `app/report_generator/pdf_generator.py` - PDF生成器
- `app/report_generator/markdown_generator.py` - Markdown生成器
- `app/report_generator/chart_generator.py` - 图表生成器
- `app/report_generator/templates/` - 报告模板
- `app/report_generator/router.py` - API路由
- `app/report_generator/tasks.py` - Celery任务

---

## 3. 核心任务

### 任务3.1: 报告生成服务
```python
class ReportGeneratorService:
    """报告生成服务"""

    async def generate_report(
        self,
        ticket_id: int,
        report_type: str,  # pdf/markdown
        sections: List[str]
    ) -> str:
        """
        生成报告

        业务逻辑:
        1. 收集数据（工单、日志、分析结果）
        2. 生成图表
        3. 渲染模板
        4. 导出文件
        5. 保存记录

        返回: 报告文件路径
        """
        # 收集数据
        data = await self._collect_data(ticket_id)

        # 生成图表
        charts = await self._generate_charts(data)

        # 渲染报告
        if report_type == 'pdf':
            file_path = await self.pdf_generator.generate(data, charts)
        else:
            file_path = await self.markdown_generator.generate(data, charts)

        # 保存记录
        await self._save_report_record(ticket_id, report_type, file_path)

        return file_path
```

### 任务3.2: PDF生成器
```python
class PDFGenerator:
    """PDF报告生成器"""

    async def generate(self, data: Dict, charts: Dict) -> str:
        """
        使用WeasyPrint生成PDF

        步骤:
        1. 渲染HTML模板（Jinja2）
        2. 嵌入图表（base64）
        3. 转换为PDF
        """
        # 渲染HTML
        html = self.template.render(data=data, charts=charts)

        # 生成PDF
        pdf_path = f"/data/reports/{data['ticket_id']}_report.pdf"
        HTML(string=html).write_pdf(pdf_path)

        return pdf_path
```

### 任务3.3: 图表生成器
```python
class ChartGenerator:
    """图表生成器"""

    def generate_timeline_chart(self, log_entries: List) -> str:
        """生成日志时间线图表，返回base64编码的图片"""
        pass

    def generate_call_chain_chart(self, call_chain: Dict) -> str:
        """生成调用链路图"""
        pass
```

---

## 4. 报告模板结构

```jinja2
<!DOCTYPE html>
<html>
<head>
    <title>问题分析报告 - {{ ticket_id }}</title>
    <style>
        /* CSS样式 */
    </style>
</head>
<body>
    <h1>问题分析报告</h1>

    <section id="summary">
        <h2>问题概述</h2>
        <p>{{ summary }}</p>
    </section>

    <section id="phenomenon">
        <h2>问题现象</h2>
        <img src="data:image/png;base64,{{ timeline_chart }}" />
    </section>

    <section id="root_cause">
        <h2>根因分析</h2>
        <p>{{ root_cause.description }}</p>
        <p>置信度: {{ root_cause.confidence }}</p>
    </section>

    <section id="solution">
        <h2>解决方案</h2>
        <ul>
            {% for solution in solutions %}
            <li>{{ solution }}</li>
            {% endfor %}
        </ul>
    </section>
</body>
</html>
```

---

## 5. API路由

```python
@router.post("/generate")
async def generate_report(
    ticket_id: int,
    report_type: str,
    sections: List[str]
):
    """异步生成报告"""
    task = generate_report_task.delay(ticket_id, report_type, sections)
    return success_response(data={'task_id': task.id})

@router.get("/{report_id}/download")
async def download_report(report_id: int):
    """下载报告"""
    report = await get_report(report_id)
    return FileResponse(report.file_path)
```

---

## 6. 完成标准

- [ ] 支持PDF和Markdown
- [ ] 报告生成<30秒
- [ ] 图表正确渲染
- [ ] 测试通过

---

**文档结束**
