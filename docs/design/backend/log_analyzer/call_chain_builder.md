# 调用链构建器详细设计

**文件路径**: `backend/app/log_analyzer/call_chain_builder.py`
**模块**: 日志分析模块
**作者**: Architect
**版本**: 1.0

---

## 1. 类概述

### 职责
基于日志构建跨模块调用链路图。

---

## 2. 方法列表

### 2.1 build_call_chain

```python
async def build_call_chain(
    self,
    log_entries: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    构建调用链

    业务逻辑:
        1. 按request_id分组日志
        2. 按时间排序
        3. 识别模块间调用关系
        4. 构建节点和边
        5. 标记错误节点
        6. 返回调用链图
    """
    pass
```

---

**文档结束**
