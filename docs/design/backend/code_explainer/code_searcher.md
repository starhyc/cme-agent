# 代码搜索器详细设计

**文件路径**: `backend/app/code_explainer/searcher.py`
**模块**: 代码解释模块
**作者**: Architect
**版本**: 1.0

---

## 1. 类概述

### 职责
基于向量相似度搜索代码，支持语义搜索。

### 依赖
- `app.code_indexer.vector_embedder.VectorEmbedder`: 向量嵌入器
- `app.code_indexer.repository.CodeRepository`: 代码仓库
- `app.common.logger`: 日志记录

---

## 2. 方法列表

### 2.1 search_code

```python
async def search_code(
    self,
    query: str,
    language: Optional[str] = None,
    module_name: Optional[str] = None,
    limit: int = 10
) -> List[Dict[str, Any]]:
    """
    搜索代码

    业务逻辑:
        1. 将查询转换为向量
        2. 在Milvus中搜索相似向量
        3. 应用筛选条件
        4. 返回搜索结果
    """
    pass
```

---

**文档结束**
