# Markdown生成器详细设计

**文件路径**: `backend/app/report_generator/markdown_generator.py`
**模块**: 报告生成模块
**作者**: Architect
**版本**: 1.0

---

## 1. 类概述

### 职责
生成Markdown格式的问题分析报告。

---

## 2. 方法列表

### 2.1 generate_markdown

```python
async def generate_markdown(
    self,
    report_data: Dict[str, Any],
    output_path: str
) -> str:
    """
    生成Markdown报告

    业务逻辑:
        1. 渲染Markdown模板
        2. 插入数据
        3. 生成Mermaid图表
        4. 保存文件
        5. 返回文件路径
    """
    pass
```

---

**文档结束**
