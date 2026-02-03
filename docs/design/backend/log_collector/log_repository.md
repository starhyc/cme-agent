# 日志仓库详细设计

**文件路径**: `backend/app/log_collector/repository.py`
**模块**: 日志收集模块
**作者**: Architect
**版本**: 1.0

---

## 1. 类概述

### 职责
提供日志数据的CRUD操作，支持PostgreSQL和InfluxDB双存储。

### 依赖
- `sqlalchemy`: PostgreSQL ORM
- `influxdb_client`: InfluxDB客户端
- `app.common.logger`: 日志记录

---

## 2. 类定义

```python
from sqlalchemy.ext.asyncio import AsyncSession
from influxdb_client.client.influxdb_client_async import InfluxDBClientAsync

class LogRepository:
    """
    日志数据仓库
    
    管理日志文件元数据（PostgreSQL）和日志条目（InfluxDB）。
    """

    def __init__(
        self,
        pg_session: AsyncSession,
        influx_client: InfluxDBClientAsync
    ):
        """初始化日志仓库"""
        pass
```

---

## 3. 方法列表

### 3.1 create_log_file

```python
async def create_log_file(
    self,
    ticket_id: int,
    file_name: str,
    file_path: str,
    file_size: int,
    source_type: str,
    module_name: str
) -> int:
    """创建日志文件记录"""
    pass
```

### 3.2 batch_insert_log_entries

```python
async def batch_insert_log_entries(
    self,
    log_file_id: int,
    entries: List[Dict[str, Any]],
    batch_size: int = 1000
) -> int:
    """批量插入日志条目"""
    pass
```

### 3.3 query_log_entries

```python
async def query_log_entries(
    self,
    ticket_id: int,
    log_level: Optional[str] = None,
    module_name: Optional[str] = None,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    page: int = 1,
    page_size: int = 50
) -> tuple[List[Dict[str, Any]], int]:
    """查询日志条目"""
    pass
```

---

**文档结束**
