# 报告生成服务详细设计

**文件路径**: `backend/app/report_generator/service.py`
**模块**: 报告生成模块
**作者**: Architect
**版本**: 1.0

---

## 1. 类概述

### 职责
协调报告生成流程，支持PDF和Markdown格式。

### 依赖
- `app.report_generator.pdf_generator.PDFGenerator`: PDF生成器
- `app.report_generator.markdown_generator.MarkdownGenerator`: Markdown生成器
- `app.ticket.repository.TicketRepository`: 工单仓库
- `app.common.logger`: 日志记录

---

## 2. 方法列表

### 2.1 generate_report

```python
async def generate_report(
    self,
    ticket_id: int,
    report_type: str,
    sections: List[str],
    include_charts: bool = True
) -> Dict[str, Any]:
    """
    生成报告

    业务逻辑:
        1. 收集工单数据
        2. 收集分析结果
        3. 收集日志数据
        4. 根据report_type选择生成器
        5. 生成报告文件
        6. 保存报告记录
        7. 返回报告信息
    """
    pass
```

---

**文档结束**
