# 后端执行计划 - 模块00：公共基础模块

**模块名称**: 公共基础模块 (Common Infrastructure)
**优先级**: P0 - 必须首先实现
**依赖**: 无
**预计工作量**: 基础模块
**负责人**: Backend Developer

---

## 1. 模块概述

提供整个后端系统的公共基础设施，包括配置管理、数据库连接、日志记录、LLM客户端、加密工具等。

### 核心功能
- 配置管理（环境变量、配置文件）
- 数据库连接池（PostgreSQL、ClickHouse、Redis、Milvus）
- 统一日志记录
- LLM客户端封装
- 加密解密工具
- 异常定义
- 响应格式封装

---

## 2. 实现文件清单

### 2.1 配置管理
- `app/common/config.py` - 配置类

### 2.2 数据库
- `app/common/database.py` - 数据库连接
- `app/common/redis_client.py` - Redis客户端
- `app/common/clickhouse_client.py` - ClickHouse客户端
- `app/common/milvus_client.py` - Milvus客户端

### 2.3 工具类
- `app/common/logger.py` - 日志工具
- `app/common/llm_client.py` - LLM客户端
- `app/common/encryption.py` - 加密工具

### 2.4 基础类
- `app/common/exceptions.py` - 自定义异常
- `app/common/response.py` - 响应封装
- `app/common/base_model.py` - 基础模型

---

## 3. 详细任务列表

### 任务3.1: 创建配置管理
**文件**: `app/common/config.py`

**实现内容**:
```python
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """应用配置"""

    # 应用配置
    APP_NAME: str = "问题定位助手"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # 数据库配置
    POSTGRES_HOST: str
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    # Redis配置
    REDIS_HOST: str
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: Optional[str] = None
    REDIS_DB: int = 0

    # ClickHouse配置
    CLICKHOUSE_HOST: str
    CLICKHOUSE_PORT: int = 9000
    CLICKHOUSE_USER: str
    CLICKHOUSE_PASSWORD: str
    CLICKHOUSE_DB: str

    # Milvus配置
    MILVUS_HOST: str
    MILVUS_PORT: int = 19530

    # JWT配置
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # 加密配置
    ENCRYPTION_KEY: str

    # LLM配置
    LLM_API_BASE_URL: str
    LLM_API_KEY: str
    LLM_MODEL: str = "gpt-4"
    LLM_TIMEOUT: int = 60

    # 文件存储配置
    UPLOAD_DIR: str = "/data/uploads"
    LOG_DIR: str = "/data/logs"
    REPORT_DIR: str = "/data/reports"

    # Celery配置
    CELERY_BROKER_URL: str
    CELERY_RESULT_BACKEND: str

    class Config:
        env_file = ".env"
        case_sensitive = True

# 全局配置实例
settings = Settings()
```

**验收标准**:
- [ ] 使用pydantic_settings管理配置
- [ ] 支持.env文件
- [ ] 所有必需配置项定义
- [ ] 提供默认值

---

### 任务3.2: 创建数据库连接
**文件**: `app/common/database.py`

**实现内容**:
```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.common.config import settings

# 数据库引擎
engine = create_async_engine(
    f"postgresql+asyncpg://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@"
    f"{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}",
    echo=settings.DEBUG,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True
)

# Session工厂
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# 基础模型
Base = declarative_base()

async def get_db() -> AsyncSession:
    """获取数据库会话"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def init_db():
    """初始化数据库"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def close_db():
    """关闭数据库连接"""
    await engine.dispose()
```

**验收标准**:
- [ ] 使用asyncpg驱动
- [ ] 连接池配置合理
- [ ] 支持自动提交和回滚
- [ ] 提供初始化和关闭方法

---

### 任务3.3: 创建Redis客户端
**文件**: `app/common/redis_client.py`

**实现内容**:
```python
import redis.asyncio as redis
from typing import Optional, Any
import json
from app.common.config import settings

class RedisClient:
    """Redis客户端封装"""

    def __init__(self):
        self.client: Optional[redis.Redis] = None

    async def connect(self):
        """建立连接"""
        self.client = await redis.from_url(
            f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}",
            password=settings.REDIS_PASSWORD,
            encoding="utf-8",
            decode_responses=True
        )

    async def close(self):
        """关闭连接"""
        if self.client:
            await self.client.close()

    async def get(self, key: str) -> Optional[str]:
        """获取值"""
        return await self.client.get(key)

    async def set(self, key: str, value: Any, expire: Optional[int] = None):
        """设置值"""
        if isinstance(value, (dict, list)):
            value = json.dumps(value)
        await self.client.set(key, value, ex=expire)

    async def delete(self, key: str):
        """删除键"""
        await self.client.delete(key)

    async def exists(self, key: str) -> bool:
        """检查键是否存在"""
        return await self.client.exists(key) > 0

    async def expire(self, key: str, seconds: int):
        """设置过期时间"""
        await self.client.expire(key, seconds)

# 全局Redis客户端
redis_client = RedisClient()
```

**验收标准**:
- [ ] 使用redis.asyncio
- [ ] 支持JSON序列化
- [ ] 提供常用操作方法
- [ ] 连接池管理

---

### 任务3.4: 创建日志工具
**文件**: `app/common/logger.py`

**实现内容**:
```python
import logging
import sys
from pathlib import Path
from logging.handlers import RotatingFileHandler
from app.common.config import settings

def setup_logger(name: str) -> logging.Logger:
    """
    配置日志记录器

    日志格式: [时间] [级别] [模块] - 消息
    输出: 控制台 + 文件（按大小轮转）
    """
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG if settings.DEBUG else logging.INFO)

    # 避免重复添加handler
    if logger.handlers:
        return logger

    # 日志格式
    formatter = logging.Formatter(
        '[%(asctime)s] [%(levelname)s] [%(name)s] - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    # 控制台handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # 文件handler（按大小轮转，最大10MB，保留5个文件）
    log_dir = Path(settings.LOG_DIR)
    log_dir.mkdir(parents=True, exist_ok=True)

    file_handler = RotatingFileHandler(
        log_dir / f"{name}.log",
        maxBytes=10 * 1024 * 1024,  # 10MB
        backupCount=5,
        encoding='utf-8'
    )
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    return logger

# 全局logger
logger = setup_logger("app")
```

**验收标准**:
- [ ] 统一日志格式
- [ ] 同时输出到控制台和文件
- [ ] 文件按大小轮转
- [ ] 支持中文

---

### 任务3.5: 创建LLM客户端
**文件**: `app/common/llm_client.py`

**实现内容**:
```python
import httpx
from typing import Dict, Any, List
from app.common.config import settings
from app.common.logger import logger

class LLMClient:
    """LLM API客户端"""

    def __init__(self):
        self.base_url = settings.LLM_API_BASE_URL
        self.api_key = settings.LLM_API_KEY
        self.model = settings.LLM_MODEL
        self.timeout = settings.LLM_TIMEOUT

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 2000
    ) -> str:
        """
        调用LLM聊天接口

        参数:
            messages: 消息列表 [{"role": "user", "content": "..."}]
            temperature: 温度参数
            max_tokens: 最大token数

        返回: LLM响应内容
        """
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": messages,
                        "temperature": temperature,
                        "max_tokens": max_tokens
                    }
                )
                response.raise_for_status()
                result = response.json()
                return result["choices"][0]["message"]["content"]

            except httpx.TimeoutException:
                logger.error("LLM API请求超时")
                raise Exception("LLM服务超时")
            except httpx.HTTPStatusError as e:
                logger.error(f"LLM API请求失败: {e.response.status_code}")
                raise Exception(f"LLM服务错误: {e.response.status_code}")
            except Exception as e:
                logger.error(f"LLM API调用异常: {str(e)}")
                raise

    async def analyze_logs(
        self,
        log_entries: List[Dict],
        analysis_type: str
    ) -> Dict[str, Any]:
        """
        分析日志

        参数:
            log_entries: 日志条目列表
            analysis_type: 分析类型 (root_cause/anomaly/pattern)

        返回: 分析结果
        """
        # 构建prompt
        log_text = "\n".join([
            f"[{entry['timestamp']}] [{entry['level']}] {entry['module']}: {entry['message']}"
            for entry in log_entries[:50]  # 限制日志数量
        ])

        prompts = {
            "root_cause": f"""分析以下日志，找出根本原因：

{log_text}

请以JSON格式返回分析结果：
{{
    "description": "根因描述",
    "confidence": 0.85,
    "evidence": ["证据1", "证据2"],
    "related_file": "可能相关的文件路径"
}}""",
            "anomaly": f"""检测以下日志中的异常：

{log_text}

请列出所有异常及其严重程度。""",
        }

        messages = [{"role": "user", "content": prompts.get(analysis_type, log_text)}]
        response = await self.chat_completion(messages, temperature=0.3)

        # 解析JSON响应
        try:
            import json
            return json.loads(response)
        except:
            return {"description": response, "confidence": 0.5}

# 全局LLM客户端
llm_client = LLMClient()
```

**验收标准**:
- [ ] 支持OpenAI兼容接口
- [ ] 超时和错误处理
- [ ] 日志分析专用方法
- [ ] 异步调用

---

### 任务3.6: 创建加密工具
**文件**: `app/common/encryption.py`

**实现内容**:
```python
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2
import base64
from app.common.config import settings

class Encryption:
    """加密解密工具"""

    def __init__(self):
        # 从配置密钥派生Fernet密钥
        kdf = PBKDF2(
            algorithm=hashes.SHA256(),
            length=32,
            salt=b'diagnosis_assistant_salt',
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(
            kdf.derive(settings.ENCRYPTION_KEY.encode())
        )
        self.cipher = Fernet(key)

    def encrypt(self, plaintext: str) -> str:
        """
        加密字符串

        参数:
            plaintext: 明文

        返回: 密文（base64编码）
        """
        encrypted = self.cipher.encrypt(plaintext.encode())
        return encrypted.decode()

    def decrypt(self, ciphertext: str) -> str:
        """
        解密字符串

        参数:
            ciphertext: 密文（base64编码）

        返回: 明文
        """
        decrypted = self.cipher.decrypt(ciphertext.encode())
        return decrypted.decode()

# 全局加密工具
encryption = Encryption()
```

**验收标准**:
- [ ] 使用Fernet对称加密
- [ ] 密钥派生安全
- [ ] 简单易用的接口
- [ ] 异常处理

---

### 任务3.7: 创建自定义异常
**文件**: `app/common/exceptions.py`

**实现内容**:
```python
class BaseException(Exception):
    """基础异常类"""
    def __init__(self, message: str, code: str = "ERROR"):
        self.message = message
        self.code = code
        super().__init__(self.message)

class NotFoundException(BaseException):
    """资源不存在异常"""
    def __init__(self, message: str):
        super().__init__(message, "NOT_FOUND")

class DuplicateException(BaseException):
    """资源重复异常"""
    def __init__(self, message: str):
        super().__init__(message, "DUPLICATE")

class ValidationException(BaseException):
    """验证失败异常"""
    def __init__(self, message: str):
        super().__init__(message, "VALIDATION_ERROR")

class UnauthorizedException(BaseException):
    """未授权异常"""
    def __init__(self, message: str = "未授权访问"):
        super().__init__(message, "UNAUTHORIZED")

class PermissionDeniedException(BaseException):
    """权限不足异常"""
    def __init__(self, message: str = "权限不足"):
        super().__init__(message, "PERMISSION_DENIED")

class ExternalServiceException(BaseException):
    """外部服务异常"""
    def __init__(self, message: str):
        super().__init__(message, "EXTERNAL_SERVICE_ERROR")
```

**验收标准**:
- [ ] 定义常用异常类型
- [ ] 包含错误码
- [ ] 继承自基础异常类

---

### 任务3.8: 创建响应封装
**文件**: `app/common/response.py`

**实现内容**:
```python
from typing import Any, Optional, List
from pydantic import BaseModel

class SuccessResponse(BaseModel):
    """成功响应"""
    success: bool = True
    data: Any
    message: Optional[str] = None

class ErrorResponse(BaseModel):
    """错误响应"""
    success: bool = False
    error: str
    code: str
    message: str

class PaginatedResponse(BaseModel):
    """分页响应"""
    success: bool = True
    data: List[Any]
    total: int
    page: int
    page_size: int
    total_pages: int

def success_response(data: Any = None, message: str = None) -> dict:
    """构建成功响应"""
    return SuccessResponse(data=data, message=message).model_dump()

def error_response(message: str, code: str = "ERROR") -> dict:
    """构建错误响应"""
    return ErrorResponse(
        error=code,
        code=code,
        message=message
    ).model_dump()

def paginated_response(
    items: List[Any],
    total: int,
    page: int,
    page_size: int
) -> dict:
    """构建分页响应"""
    total_pages = (total + page_size - 1) // page_size
    return PaginatedResponse(
        data=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    ).model_dump()
```

**验收标准**:
- [ ] 统一响应格式
- [ ] 支持成功、错误、分页响应
- [ ] 使用Pydantic模型

---

## 4. 依赖安装

```bash
pip install sqlalchemy[asyncio] asyncpg
pip install redis[asyncio]
pip install httpx
pip install cryptography
pip install pydantic-settings
```

---

## 5. 环境变量示例

```env
# .env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=diagnosis_db

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

CLICKHOUSE_HOST=localhost
CLICKHOUSE_PORT=9000
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=
CLICKHOUSE_DB=logs

MILVUS_HOST=localhost
MILVUS_PORT=19530

JWT_SECRET_KEY=your-secret-key-change-in-production
ENCRYPTION_KEY=your-encryption-key-change-in-production

LLM_API_BASE_URL=http://localhost:8080/v1
LLM_API_KEY=your-llm-api-key
LLM_MODEL=gpt-4

CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2
```

---

## 6. 测试要点

### 单元测试
- [ ] 配置加载
- [ ] 数据库连接
- [ ] Redis操作
- [ ] 加密解密
- [ ] LLM客户端调用

### 集成测试
- [ ] 数据库连接池
- [ ] Redis连接池
- [ ] 异常处理流程

---

## 7. 实现顺序

1. 配置管理 → 2. 日志工具 → 3. 异常定义 → 4. 响应封装 → 5. 数据库连接 → 6. Redis客户端 → 7. 加密工具 → 8. LLM客户端

---

## 8. 完成标准

- [ ] 所有任务完成
- [ ] 所有测试通过
- [ ] 配置文件完整
- [ ] 文档完整

---

**文档结束**
