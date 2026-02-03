# 向量嵌入器详细设计

**文件路径**: `backend/app/code_indexer/vector_embedder.py`
**模块**: 代码索引模块
**作者**: Architect
**版本**: 1.0

---

## 1. 类概述

### 职责
将代码片段转换为向量表示，用于语义搜索。

---

## 2. 方法列表

### 2.1 embed_code

```python
async def embed_code(
    self,
    code_snippet: str,
    language: str
) -> List[float]:
    """
    生成代码向量

    业务逻辑:
        1. 预处理代码
        2. 使用sentence-transformers生成向量
        3. 返回768维向量
    """
    pass
```

---

**文档结束**
