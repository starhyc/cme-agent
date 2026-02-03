# 根因定位器详细设计

**文件路径**: `backend/app/log_analyzer/root_cause_finder.py`
**模块**: 日志分析模块
**作者**: Architect
**版本**: 1.0

---

## 1. 类概述

### 职责
使用LLM分析日志，定位问题根本原因。

---

## 2. 方法列表

### 2.1 find_root_cause

```python
async def find_root_cause(
    self,
    anomalies: List[Dict[str, Any]],
    context_logs: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    定位根因

    业务逻辑:
        1. 提取关键错误信息
        2. 查询时间窗口内的上下文日志
        3. 构建LLM prompt
        4. 调用LLM分析
        5. 解析分析结果
        6. 返回根因信息
    """
    pass
```

---

**文档结束**
