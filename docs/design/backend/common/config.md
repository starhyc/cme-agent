# 配置管理详细设计

**文件路径**: `backend/app/common/config.py`
**模块**: 公共模块
**作者**: Architect
**版本**: 1.0

---

## 1. 类概述

### 职责
管理应用配置，支持从环境变量和配置文件加载。

### 依赖
- `pydantic`: 配置验证
- `python-dotenv`: 环境变量加载

---

## 2. 配置类定义

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """应用配置类"""
    
    # 数据库配置
    database_url: str
    
    # Redis配置
    redis_host: str
    redis_port: int
    
    # JWT配置
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    
    # LLM配置
    llm_base_url: str
    llm_api_key: str
    llm_model: str = "gpt-4"
    
    class Config:
        env_file = ".env"
```

---

**文档结束**
