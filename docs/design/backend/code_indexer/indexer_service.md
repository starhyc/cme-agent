# 代码索引服务详细设计

**文件路径**: `backend/app/code_indexer/service.py`
**模块**: 代码索引模块
**作者**: Architect
**版本**: 1.0

---

## 1. 类概述

### 职责
协调代码索引流程，管理代码模块的索引任务。

### 依赖
- `app.code_indexer.tree_sitter_parser.TreeSitterParser`: 代码解析器
- `app.code_indexer.vector_embedder.VectorEmbedder`: 向量化器
- `app.code_indexer.repository.CodeRepository`: 代码数据访问
- `app.common.logger`: 日志记录

---

## 2. 方法列表

### 2.1 index_module

```python
async def index_module(
    self,
    module_name: str,
    repository_path: str,
    language: str,
    force_reindex: bool = False
) -> Dict[str, Any]:
    """
    索引代码模块

    业务逻辑:
        1. 检查是否已索引
        2. 扫描代码文件
        3. 解析代码结构
        4. 生成向量
        5. 存储到Milvus
        6. 更新索引状态
        7. 返回索引结果
    """
    pass
```

---

**文档结束**
