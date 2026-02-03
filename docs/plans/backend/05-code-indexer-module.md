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
- 代码向量化（使用embedding模型）
- 向量索引存储（Milvus）
- 增量索引更新
- 代码结构提取（类、函数、方法）

---

## 2. 实现文件清单

### 2.1 数据模型
- `app/code_indexer/models.py` - 数据模型

### 2.2 核心服务
- `app/code_indexer/service.py` - 索引服务
- `app/code_indexer/tree_sitter_parser.py` - 代码解析
- `app/code_indexer/vector_embedder.py` - 向量化

### 2.3 数据访问层
- `app/code_indexer/repository.py` - 代码数据访问

### 2.4 API路由
- `app/code_indexer/router.py` - API端点

### 2.5 Celery任务
- `app/code_indexer/tasks.py` - 异步任务

---

## 3. 详细任务列表

### 任务3.1: 创建数据模型
**文件**: `app/code_indexer/models.py`

**实现内容**:
```python
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from app.common.database import Base

class CodeModule(Base):
    """代码模块"""
    __tablename__ = "code_modules"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, nullable=False)
    path = Column(String(500), nullable=False)
    language = Column(String(20), nullable=False)  # java/python/cpp/nodejs
    description = Column(Text)
    indexed = Column(Boolean, default=False)
    index_status = Column(String(20), default="pending")  # pending/indexing/completed/failed
    total_files = Column(Integer, default=0)
    indexed_files = Column(Integer, default=0)
    created_at = Column(DateTime, server_default="CURRENT_TIMESTAMP")
    updated_at = Column(DateTime, server_default="CURRENT_TIMESTAMP", onupdate="CURRENT_TIMESTAMP")

class CodeBlock(Base):
    """代码块（存储在PostgreSQL，向量存储在Milvus）"""
    __tablename__ = "code_blocks"

    id = Column(Integer, primary_key=True)
    module_id = Column(Integer, nullable=False)
    file_path = Column(String(500), nullable=False)
    block_type = Column(String(20), nullable=False)  # class/function/method
    class_name = Column(String(200))
    function_name = Column(String(200))
    code_snippet = Column(Text, nullable=False)
    start_line = Column(Integer)
    end_line = Column(Integer)
    language = Column(String(20), nullable=False)
    milvus_id = Column(String(100))  # Milvus中的向量ID
    created_at = Column(DateTime, server_default="CURRENT_TIMESTAMP")
```

**验收标准**:
- [ ] 模型字段完整
- [ ] 索引定义合理
- [ ] 支持多语言

---

### 任务3.2: 实现Tree-sitter解析器
**文件**: `app/code_indexer/tree_sitter_parser.py`

**实现内容**:
```python
from typing import List, Dict, Any
import tree_sitter
from tree_sitter import Language, Parser
from pathlib import Path
from app.common.logger import logger

class TreeSitterParser:
    """多语言代码解析器"""

    def __init__(self):
        # 初始化Tree-sitter语言
        self.languages = {}
        self._init_languages()

    def _init_languages(self):
        """初始化支持的语言"""
        try:
            # 假设已编译好的语言库
            Language.build_library(
                'build/languages.so',
                [
                    'vendor/tree-sitter-java',
                    'vendor/tree-sitter-python',
                    'vendor/tree-sitter-cpp',
                    'vendor/tree-sitter-javascript'
                ]
            )

            self.languages = {
                'java': Language('build/languages.so', 'java'),
                'python': Language('build/languages.so', 'python'),
                'cpp': Language('build/languages.so', 'cpp'),
                'javascript': Language('build/languages.so', 'javascript')
            }
        except Exception as e:
            logger.error(f"初始化Tree-sitter语言失败: {str(e)}")
            raise

    def parse_file(
        self,
        file_path: str,
        language: str
    ) -> List[Dict[str, Any]]:
        """
        解析代码文件

        业务逻辑:
        1. 读取文件内容
        2. 使用Tree-sitter解析AST
        3. 提取类、函数、方法
        4. 返回代码块列表

        参数:
            file_path: 文件路径
            language: 编程语言

        返回: [
            {
                type: 'class',
                name: 'OrderService',
                code: '...',
                start_line: 10,
                end_line: 50
            }
        ]
        """
        if language not in self.languages:
            raise ValueError(f"不支持的语言: {language}")

        # 读取文件
        with open(file_path, 'r', encoding='utf-8') as f:
            code = f.read()

        # 解析AST
        parser = Parser()
        parser.set_language(self.languages[language])
        tree = parser.parse(bytes(code, 'utf8'))

        # 提取代码块
        code_blocks = []

        if language == 'java':
            code_blocks = self._extract_java_blocks(tree.root_node, code)
        elif language == 'python':
            code_blocks = self._extract_python_blocks(tree.root_node, code)
        elif language == 'cpp':
            code_blocks = self._extract_cpp_blocks(tree.root_node, code)
        elif language == 'javascript':
            code_blocks = self._extract_js_blocks(tree.root_node, code)

        return code_blocks

    def _extract_java_blocks(
        self,
        node: tree_sitter.Node,
        code: str
    ) -> List[Dict[str, Any]]:
        """提取Java代码块"""
        blocks = []

        def traverse(node, class_name=None):
            if node.type == 'class_declaration':
                # 提取类名
                name_node = node.child_by_field_name('name')
                if name_node:
                    class_name = code[name_node.start_byte:name_node.end_byte]
                    blocks.append({
                        'type': 'class',
                        'class_name': class_name,
                        'function_name': None,
                        'code': code[node.start_byte:node.end_byte],
                        'start_line': node.start_point[0] + 1,
                        'end_line': node.end_point[0] + 1
                    })

            elif node.type == 'method_declaration':
                # 提取方法
                name_node = node.child_by_field_name('name')
                if name_node:
                    method_name = code[name_node.start_byte:name_node.end_byte]
                    blocks.append({
                        'type': 'method',
                        'class_name': class_name,
                        'function_name': method_name,
                        'code': code[node.start_byte:node.end_byte],
                        'start_line': node.start_point[0] + 1,
                        'end_line': node.end_point[0] + 1
                    })

            # 递归遍历子节点
            for child in node.children:
                traverse(child, class_name)

        traverse(node)
        return blocks

    def _extract_python_blocks(
        self,
        node: tree_sitter.Node,
        code: str
    ) -> List[Dict[str, Any]]:
        """提取Python代码块"""
        blocks = []

        def traverse(node, class_name=None):
            if node.type == 'class_definition':
                # 提取类名
                name_node = node.child_by_field_name('name')
                if name_node:
                    class_name = code[name_node.start_byte:name_node.end_byte]
                    blocks.append({
                        'type': 'class',
                        'class_name': class_name,
                        'function_name': None,
                        'code': code[node.start_byte:node.end_byte],
                        'start_line': node.start_point[0] + 1,
                        'end_line': node.end_point[0] + 1
                    })

            elif node.type == 'function_definition':
                # 提取函数
                name_node = node.child_by_field_name('name')
                if name_node:
                    func_name = code[name_node.start_byte:name_node.end_byte]
                    blocks.append({
                        'type': 'function' if not class_name else 'method',
                        'class_name': class_name,
                        'function_name': func_name,
                        'code': code[node.start_byte:node.end_byte],
                        'start_line': node.start_point[0] + 1,
                        'end_line': node.end_point[0] + 1
                    })

            # 递归遍历
            for child in node.children:
                traverse(child, class_name)

        traverse(node)
        return blocks

    def _extract_cpp_blocks(
        self,
        node: tree_sitter.Node,
        code: str
    ) -> List[Dict[str, Any]]:
        """提取C++代码块"""
        # 类似Java的实现
        return []

    def _extract_js_blocks(
        self,
        node: tree_sitter.Node,
        code: str
    ) -> List[Dict[str, Any]]:
        """提取JavaScript代码块"""
        # 类似Python的实现
        return []
```

**验收标准**:
- [ ] 支持4种语言
- [ ] 正确提取类和函数
- [ ] 包含行号信息
- [ ] 错误处理完善

---

### 任务3.3: 实现向量嵌入器
**文件**: `app/code_indexer/vector_embedder.py`

**实现内容**:
```python
from typing import List
import httpx
from app.common.config import settings
from app.common.logger import logger

class VectorEmbedder:
    """代码向量化"""

    def __init__(self):
        self.api_url = f"{settings.LLM_API_BASE_URL}/embeddings"
        self.api_key = settings.LLM_API_KEY
        self.model = "text-embedding-ada-002"  # 或其他embedding模型
        self.dimension = 384  # 向量维度

    async def embed_code(self, code_snippet: str) -> List[float]:
        """
        生成代码向量

        业务逻辑:
        1. 预处理代码（去除注释、格式化）
        2. 调用embedding API
        3. 返回向量

        参数:
            code_snippet: 代码片段

        返回: 384维向量
        """
        # 预处理代码
        processed_code = self._preprocess_code(code_snippet)

        # 调用embedding API
        async with httpx.AsyncClient(timeout=30) as client:
            try:
                response = await client.post(
                    self.api_url,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "input": processed_code
                    }
                )
                response.raise_for_status()
                result = response.json()
                return result["data"][0]["embedding"]

            except Exception as e:
                logger.error(f"向量化失败: {str(e)}")
                raise

    async def embed_batch(
        self,
        code_snippets: List[str],
        batch_size: int = 10
    ) -> List[List[float]]:
        """
        批量向量化

        参数:
            code_snippets: 代码片段列表
            batch_size: 批次大小

        返回: 向量列表
        """
        vectors = []

        for i in range(0, len(code_snippets), batch_size):
            batch = code_snippets[i:i + batch_size]
            batch_vectors = []

            for code in batch:
                vector = await self.embed_code(code)
                batch_vectors.append(vector)

            vectors.extend(batch_vectors)

        return vectors

    def _preprocess_code(self, code: str) -> str:
        """
        预处理代码

        1. 限制长度（最多2000字符）
        2. 去除多余空白
        """
        # 限制长度
        if len(code) > 2000:
            code = code[:2000]

        # 去除多余空白
        lines = [line.strip() for line in code.split('\n') if line.strip()]
        return '\n'.join(lines)
```

**验收标准**:
- [ ] 生成384维向量
- [ ] 支持批量处理
- [ ] 代码预处理合理
- [ ] 错误处理完善

---

### 任务3.4: 实现索引服务
**文件**: `app/code_indexer/service.py`

**实现内容**:
```python
from typing import List, Dict, Any
from pathlib import Path
from pymilvus import Collection, CollectionSchema, FieldSchema, DataType, connections
from app.code_indexer.tree_sitter_parser import TreeSitterParser
from app.code_indexer.vector_embedder import VectorEmbedder
from app.code_indexer.repository import CodeIndexerRepository
from app.code_indexer.models import CodeModule, CodeBlock
from app.common.config import settings
from app.common.logger import logger

class CodeIndexerService:
    """代码索引服务"""

    def __init__(self):
        self.parser = TreeSitterParser()
        self.embedder = VectorEmbedder()
        self.repository = CodeIndexerRepository()
        self.collection_name = "code_vectors"

    async def create_module(
        self,
        name: str,
        path: str,
        language: str,
        description: str = None
    ) -> CodeModule:
        """
        创建代码模块

        参数:
            name: 模块名称
            path: 代码路径
            language: 编程语言
            description: 描述

        返回: CodeModule对象
        """
        module = CodeModule(
            name=name,
            path=path,
            language=language,
            description=description,
            indexed=False,
            index_status="pending"
        )

        return await self.repository.create_module(module)

    async def index_module(self, module_id: int) -> None:
        """
        索引代码模块

        业务逻辑:
        1. 查询模块信息
        2. 扫描代码文件
        3. 解析代码结构
        4. 生成向量
        5. 存储到Milvus和PostgreSQL
        6. 更新索引状态

        参数:
            module_id: 模块ID
        """
        # 查询模块
        module = await self.repository.get_module(module_id)
        if not module:
            raise ValueError(f"模块 {module_id} 不存在")

        # 更新状态
        module.index_status = "indexing"
        await self.repository.update_module(module)

        try:
            # 扫描代码文件
            code_files = self._scan_code_files(module.path, module.language)
            module.total_files = len(code_files)
            await self.repository.update_module(module)

            logger.info(f"开始索引模块 {module.name}，共 {len(code_files)} 个文件")

            # 初始化Milvus集合
            self._init_milvus_collection()

            # 处理每个文件
            indexed_count = 0
            for file_path in code_files:
                try:
                    await self._index_file(module, file_path)
                    indexed_count += 1
                    module.indexed_files = indexed_count
                    await self.repository.update_module(module)
                except Exception as e:
                    logger.error(f"索引文件失败 {file_path}: {str(e)}")

            # 更新状态
            module.indexed = True
            module.index_status = "completed"
            await self.repository.update_module(module)

            logger.info(f"模块 {module.name} 索引完成")

        except Exception as e:
            logger.error(f"索引模块失败: {str(e)}")
            module.index_status = "failed"
            await self.repository.update_module(module)
            raise

    async def _index_file(
        self,
        module: CodeModule,
        file_path: str
    ) -> None:
        """索引单个文件"""
        # 解析代码
        code_blocks = self.parser.parse_file(file_path, module.language)

        if not code_blocks:
            return

        # 批量向量化
        code_snippets = [block['code'] for block in code_blocks]
        vectors = await self.embedder.embed_batch(code_snippets)

        # 连接Milvus
        connections.connect(
            alias="default",
            host=settings.MILVUS_HOST,
            port=settings.MILVUS_PORT
        )

        collection = Collection(self.collection_name)

        # 准备数据
        milvus_data = []
        pg_blocks = []

        for i, (block, vector) in enumerate(zip(code_blocks, vectors)):
            # Milvus数据
            milvus_id = f"{module.id}_{file_path}_{i}"
            milvus_data.append({
                "id": milvus_id,
                "embedding": vector,
                "file_path": file_path,
                "class_name": block.get('class_name', ''),
                "function_name": block.get('function_name', ''),
                "code_snippet": block['code'][:500],  # 限制长度
                "language": module.language,
                "module_name": module.name
            })

            # PostgreSQL数据
            pg_block = CodeBlock(
                module_id=module.id,
                file_path=file_path,
                block_type=block['type'],
                class_name=block.get('class_name'),
                function_name=block.get('function_name'),
                code_snippet=block['code'],
                start_line=block['start_line'],
                end_line=block['end_line'],
                language=module.language,
                milvus_id=milvus_id
            )
            pg_blocks.append(pg_block)

        # 插入Milvus
        if milvus_data:
            collection.insert(milvus_data)

        # 插入PostgreSQL
        await self.repository.create_code_blocks(pg_blocks)

    def _scan_code_files(
        self,
        path: str,
        language: str
    ) -> List[str]:
        """
        扫描代码文件

        参数:
            path: 代码路径
            language: 编程语言

        返回: 文件路径列表
        """
        extensions = {
            'java': ['.java'],
            'python': ['.py'],
            'cpp': ['.cpp', '.h', '.hpp'],
            'javascript': ['.js', '.ts']
        }

        exts = extensions.get(language, [])
        code_files = []

        for ext in exts:
            code_files.extend(Path(path).rglob(f'*{ext}'))

        return [str(f) for f in code_files]

    def _init_milvus_collection(self):
        """初始化Milvus集合"""
        connections.connect(
            alias="default",
            host=settings.MILVUS_HOST,
            port=settings.MILVUS_PORT
        )

        # 检查集合是否存在
        from pymilvus import utility
        if utility.has_collection(self.collection_name):
            return

        # 创建集合
        fields = [
            FieldSchema(name="id", dtype=DataType.VARCHAR, is_primary=True, max_length=200),
            FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=384),
            FieldSchema(name="file_path", dtype=DataType.VARCHAR, max_length=500),
            FieldSchema(name="class_name", dtype=DataType.VARCHAR, max_length=200),
            FieldSchema(name="function_name", dtype=DataType.VARCHAR, max_length=200),
            FieldSchema(name="code_snippet", dtype=DataType.VARCHAR, max_length=1000),
            FieldSchema(name="language", dtype=DataType.VARCHAR, max_length=20),
            FieldSchema(name="module_name", dtype=DataType.VARCHAR, max_length=100)
        ]

        schema = CollectionSchema(fields, description="代码向量集合")
        collection = Collection(self.collection_name, schema)

        # 创建索引
        index_params = {
            "metric_type": "COSINE",
            "index_type": "IVF_FLAT",
            "params": {"nlist": 128}
        }
        collection.create_index("embedding", index_params)
        collection.load()
```

**验收标准**:
- [ ] 完整索引流程
- [ ] 支持增量索引
- [ ] Milvus集合初始化
- [ ] 错误处理和日志

---

### 任务3.5: 实现API路由
**文件**: `app/code_indexer/router.py`

**实现内容**:
```python
from fastapi import APIRouter, Depends
from typing import List
from app.code_indexer.service import CodeIndexerService
from app.code_indexer.tasks import index_module_task
from app.auth.dependencies import get_current_user
from app.common.response import success_response

router = APIRouter(prefix="/api/v1/code-indexer", tags=["code-indexer"])

@router.post("/modules")
async def create_module(
    name: str,
    path: str,
    language: str,
    description: str = None,
    current_user = Depends(get_current_user),
    service: CodeIndexerService = Depends()
):
    """创建代码模块"""
    module = await service.create_module(name, path, language, description)
    return success_response(data=module)

@router.post("/modules/{module_id}/index")
async def start_index(
    module_id: int,
    current_user = Depends(get_current_user)
):
    """开始索引"""
    task = index_module_task.delay(module_id)
    return success_response(data={"task_id": task.id})

@router.get("/modules")
async def list_modules(
    current_user = Depends(get_current_user),
    service: CodeIndexerService = Depends()
):
    """获取模块列表"""
    modules = await service.repository.list_modules()
    return success_response(data={"items": modules})
```

**验收标准**:
- [ ] API端点完整
- [ ] 异步任务提交
- [ ] 权限验证

---

## 4. 数据库迁移

```sql
CREATE TABLE code_modules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    path VARCHAR(500) NOT NULL,
    language VARCHAR(20) NOT NULL,
    description TEXT,
    indexed BOOLEAN DEFAULT FALSE,
    index_status VARCHAR(20) DEFAULT 'pending',
    total_files INTEGER DEFAULT 0,
    indexed_files INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE code_blocks (
    id SERIAL PRIMARY KEY,
    module_id INTEGER NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    block_type VARCHAR(20) NOT NULL,
    class_name VARCHAR(200),
    function_name VARCHAR(200),
    code_snippet TEXT NOT NULL,
    start_line INTEGER,
    end_line INTEGER,
    language VARCHAR(20) NOT NULL,
    milvus_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_code_blocks_module_id ON code_blocks(module_id);
CREATE INDEX idx_code_blocks_file_path ON code_blocks(file_path);
```

---

## 5. 依赖安装

```bash
pip install tree-sitter
pip install pymilvus
```

---

## 6. 测试要点

### 单元测试
- [ ] Tree-sitter解析
- [ ] 向量生成
- [ ] 文件扫描

### 集成测试
- [ ] 完整索引流程
- [ ] Milvus存储和检索
- [ ] 增量索引

### 性能测试
- [ ] 首次索引<10分钟（1.2M行代码）
- [ ] 向量检索<2秒

---

## 7. 实现顺序

1. 数据模型 → 2. Tree-sitter解析器 → 3. 向量嵌入器 → 4. 索引服务 → 5. API路由

---

## 8. 完成标准

- [ ] 所有任务完成
- [ ] 支持4种语言
- [ ] 首次索引<10分钟
- [ ] 向量检索<2秒
- [ ] 测试通过

---

**文档结束**
