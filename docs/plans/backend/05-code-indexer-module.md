# 后端执行计划 - 模块05：代码索引模块

**模块名称**: 代码索引模块 (Code Indexer)
**优先级**: P0 - 核心功能
**依赖**: 无
**预计工作量**: 大
**负责人**: Backend Developer

---

## 1. 模块概述

索引代码仓库，支持多语言代码解析和向量化，实现语义搜索。

### 核心功能
- 多语言代码解析（Java/Python/C++/Node.js）
- 代码向量化
- 向量索引存储（Milvus）
- 增量索引更新

---

## 2. 实现文件清单

- `app/code_indexer/service.py` - 索引服务
- `app/code_indexer/tree_sitter_parser.py` - 代码解析
- `app/code_indexer/vector_embedder.py` - 向量化
- `app/code_indexer/tasks.py` - Celery任务
- `app/code_indexer/router.py` - API路由

---

## 3. 核心任务

### 任务3.1: Tree-sitter解析器
```python
class TreeSitterParser:
    """多语言代码解析器"""

    def parse_file(self, file_path: str, language: str) -> List[CodeBlock]:
        """
        解析代码文件

        返回: [
            {type: 'class', name: 'OrderService',
             code: '...', start_line: 10, end_line: 50}
        ]
        """
        pass
```

### 任务3.2: 向量嵌入器
```python
class VectorEmbedder:
    """代码向量化"""

    def embed_code(self, code_snippet: str) -> List[float]:
        """生成384维向量"""
        pass
```

### 任务3.3: 索引服务
```python
class CodeIndexerService:
    """代码索引服务"""

    async def index_module(self, module_name: str) -> None:
        """
        索引代码模块

        业务逻辑:
        1. 扫描代码文件
        2. 解析代码结构
        3. 生成向量
        4. 存储到Milvus
        """
        pass
```

---

## 4. 完成标准

- [ ] 支持4种语言
- [ ] 首次索引<10分钟
- [ ] 向量检索<2秒
- [ ] 测试通过

---

**文档结束**
