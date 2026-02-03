# 代码仓库详细设计

**文件路径**: `backend/app/code_indexer/repository.py`
**模块**: 代码索引模块
**作者**: Architect
**版本**: 1.0

---

## 1. 类概述

### 职责
管理代码模块和文件的元数据，操作Milvus向量数据库。

---

## 2. 方法列表

### 2.1 create_code_module

```python
async def create_code_module(
    self,
    module_name: str,
    language: str,
    repository_path: str
) -> int:
    """创建代码模块记录"""
    pass
```

### 2.2 insert_code_vectors

```python
async def insert_code_vectors(
    self,
    vectors: List[Dict[str, Any]]
) -> int:
    """批量插入代码向量到Milvus"""
    pass
```

### 2.3 search_similar_code

```python
async def search_similar_code(
    self,
    query_vector: List[float],
    limit: int = 10
) -> List[Dict[str, Any]]:
    """向量相似度搜索"""
    pass
```

---

**文档结束**
