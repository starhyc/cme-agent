# 后端执行计划 - 模块02：日志收集模块

**模块名称**: 日志收集模块 (Log Collection)
**优先级**: P0 - 核心功能
**依赖**: 认证授权模块
**预计工作量**: 中等
**负责人**: Backend Developer

---

## 1. 模块概述

实现日志文件的上传、SSH下载、解析和存储功能。

### 核心功能
- 日志文件上传（支持大文件分块上传）
- SSH服务器配置和管理
- SSH远程日志下载
- 多格式日志解析（JSON、文本、结构化）
- 日志标准化和存储

---

## 2. 实现文件清单

### 2.1 数据模型
- `app/log_collector/models.py`
  - LogFile模型
  - Server模型
  - LogEntry模型

### 2.2 核心服务
- `app/log_collector/uploader.py` - 文件上传处理
- `app/log_collector/ssh_downloader.py` - SSH下载
- `app/log_collector/parser.py` - 日志解析
- `app/log_collector/service.py` - 日志收集服务

### 2.3 数据访问层
- `app/log_collector/repository.py` - 数据访问

### 2.4 API路由
- `app/log_collector/router.py` - API端点

### 2.5 Celery任务
- `app/log_collector/tasks.py` - 异步任务

---

## 3. 详细任务列表

### 任务3.1: 创建数据模型
**文件**: `app/log_collector/models.py`

**实现内容**:
```python
class Server(Base):
    """SSH服务器配置"""
    id: int
    name: str
    host: str
    port: int
    username: str
    password_encrypted: str
    encryption_key_id: str
    created_by: int
    created_at: datetime

class LogFile(Base):
    """日志文件记录"""
    id: int
    ticket_id: int
    file_name: str
    file_path: str
    file_size: int
    source_type: str  # upload/ssh/customer
    server_id: Optional[int]
    module_name: str
    log_format: str  # json/text/structured
    upload_status: str  # pending/processing/completed/failed
    created_at: datetime

class LogEntry(Base):
    """日志条目（存储在ClickHouse）"""
    id: int
    log_file_id: int
    timestamp: datetime
    log_level: str
    module_name: str
    message: str
    stack_trace: Optional[str]
    request_id: Optional[str]
    metadata: dict
```

**验收标准**:
- [ ] 所有模型字段完整
- [ ] 外键关系正确
- [ ] 索引定义合理

---

### 任务3.2: 实现文件上传
**文件**: `app/log_collector/uploader.py`

**实现内容**:
```python
class LogUploader:
    async def upload_file(
        self,
        ticket_id: int,
        file: UploadFile,
        module_name: str,
        source_type: str
    ) -> LogFile:
        """
        处理日志文件上传

        业务逻辑:
        1. 验证文件大小（最大1GB）
        2. 生成唯一文件名
        3. 分块保存文件到磁盘
        4. 创建LogFile记录
        5. 提交解析任务到Celery
        6. 返回LogFile对象
        """
        pass

    async def _save_chunks(
        self,
        file: UploadFile,
        file_path: str
    ) -> int:
        """
        分块保存文件
        每块10MB，使用aiofiles异步写入
        返回文件总大小
        """
        pass
```

**依赖**:
- aiofiles
- FastAPI UploadFile

**验收标准**:
- [ ] 支持最大1GB文件
- [ ] 分块大小10MB
- [ ] 异步IO不阻塞
- [ ] 上传失败时清理临时文件
- [ ] 记录上传进度日志

---

### 任务3.3: 实现SSH下载
**文件**: `app/log_collector/ssh_downloader.py`

**实现内容**:
```python
class SSHDownloader:
    async def download_logs(
        self,
        ticket_id: int,
        server_ids: List[int],
        log_paths: List[str],
        time_range: Optional[Dict[str, datetime]] = None
    ) -> List[LogFile]:
        """
        从SSH服务器下载日志

        业务逻辑:
        1. 查询服务器配置
        2. 解密SSH密码
        3. 并行连接所有服务器
        4. 查找匹配的日志文件
        5. 下载日志文件
        6. 创建LogFile记录
        7. 提交解析任务
        """
        pass

    async def _connect_ssh(
        self,
        server: Server
    ) -> paramiko.SSHClient:
        """建立SSH连接"""
        pass

    async def _find_log_files(
        self,
        ssh_client: paramiko.SSHClient,
        log_paths: List[str],
        time_range: Optional[Dict[str, datetime]]
    ) -> List[str]:
        """查找日志文件"""
        pass

    async def _download_file(
        self,
        ssh_client: paramiko.SSHClient,
        remote_path: str,
        local_path: str
    ) -> int:
        """下载单个文件"""
        pass
```

**依赖**:
- paramiko
- app.common.encryption

**验收标准**:
- [ ] 支持并行下载多个服务器
- [ ] SSH连接超时30秒
- [ ] 下载失败自动重试3次
- [ ] 记录所有SSH操作到审计日志
- [ ] 密码解密后不在内存中长期保存

---

### 任务3.4: 实现日志解析
**文件**: `app/log_collector/parser.py`

**实现内容**:
```python
class LogParser:
    async def parse_file(
        self,
        log_file: LogFile
    ) -> int:
        """
        解析日志文件

        业务逻辑:
        1. 识别日志格式
        2. 逐行解析日志
        3. 提取时间戳、级别、消息等
        4. 批量写入ClickHouse
        5. 更新LogFile状态

        返回: 解析的日志条目数量
        """
        pass

    def _detect_format(self, content: str) -> str:
        """
        自动识别日志格式
        返回: json/text/structured
        """
        pass

    def _parse_json_log(self, line: str) -> Optional[LogEntry]:
        """解析JSON格式日志"""
        pass

    def _parse_text_log(self, line: str) -> Optional[LogEntry]:
        """
        解析文本格式日志
        使用正则表达式提取字段
        """
        pass

    def _parse_structured_log(self, line: str) -> Optional[LogEntry]:
        """解析结构化日志（如logstash格式）"""
        pass

    async def _batch_insert(
        self,
        entries: List[LogEntry]
    ) -> None:
        """批量插入ClickHouse，每批1000条"""
        pass
```

**正则表达式模式**:
```python
# 文本日志模式
TEXT_LOG_PATTERN = re.compile(
    r'(?P<timestamp>\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}[.,]\d{3})\s+'
    r'\[(?P<level>\w+)\]\s+'
    r'(?P<module>\S+)\s+-\s+'
    r'(?P<message>.*)'
)
```

**验收标准**:
- [ ] 支持JSON、文本、结构化三种格式
- [ ] 日志解析准确率>95%
- [ ] 使用流式处理，不加载整个文件到内存
- [ ] 批量写入ClickHouse，每批1000条
- [ ] 解析失败的行记录到错误日志

---

### 任务3.5: 实现日志收集服务
**文件**: `app/log_collector/service.py`

**实现内容**:
```python
class LogCollectorService:
    async def create_server(
        self,
        name: str,
        host: str,
        port: int,
        username: str,
        password: str,
        user_id: int
    ) -> Server:
        """
        创建SSH服务器配置
        密码使用AES-256-GCM加密
        """
        pass

    async def test_connection(
        self,
        server_id: int
    ) -> bool:
        """测试SSH连接"""
        pass

    async def get_log_entries(
        self,
        ticket_id: int,
        filters: Dict[str, Any],
        page: int,
        page_size: int
    ) -> Tuple[List[LogEntry], int]:
        """
        查询日志条目
        支持过滤：log_level, module_name, time_range, keyword
        """
        pass

    async def get_timeline(
        self,
        ticket_id: int,
        module_names: List[str],
        start_time: datetime,
        end_time: datetime
    ) -> Dict[str, Any]:
        """
        获取日志时间线
        按时间戳聚合多模块日志
        """
        pass
```

**验收标准**:
- [ ] 密码加密存储
- [ ] SSH连接测试功能正常
- [ ] 日志查询支持所有过滤条件
- [ ] 时间线数据格式正确

---

### 任务3.6: 实现Celery任务
**文件**: `app/log_collector/tasks.py`

**实现内容**:
```python
@celery_app.task(bind=True)
def parse_log_file_task(self, log_file_id: int):
    """
    异步解析日志文件任务

    业务逻辑:
    1. 查询LogFile记录
    2. 更新状态为processing
    3. 调用LogParser解析
    4. 更新状态为completed
    5. 发送WebSocket通知
    """
    pass

@celery_app.task(bind=True)
def download_logs_task(
    self,
    ticket_id: int,
    server_ids: List[int],
    log_paths: List[str]
):
    """
    异步下载日志任务

    业务逻辑:
    1. 调用SSHDownloader下载
    2. 为每个文件提交解析任务
    3. 发送WebSocket通知
    """
    pass
```

**验收标准**:
- [ ] 任务失败自动重试3次
- [ ] 任务进度通过WebSocket推送
- [ ] 任务超时时间设置合理
- [ ] 记录详细的任务日志

---

### 任务3.7: 实现API路由
**文件**: `app/log_collector/router.py`

**实现内容**:
```python
router = APIRouter(prefix="/api/v1/logs")

@router.post("/upload")
async def upload_log(
    ticket_id: int = Form(...),
    file: UploadFile = File(...),
    module_name: str = Form(...),
    source_type: str = Form("upload")
):
    """上传日志文件"""
    pass

@router.post("/ssh-servers")
async def create_ssh_server(request: CreateServerRequest):
    """创建SSH服务器配置"""
    pass

@router.post("/download")
async def download_logs(request: DownloadLogsRequest):
    """从SSH下载日志"""
    pass

@router.get("/entries")
async def get_log_entries(
    ticket_id: int,
    log_level: Optional[str] = None,
    module_name: Optional[str] = None,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    keyword: Optional[str] = None,
    page: int = 1,
    page_size: int = 50
):
    """查询日志条目"""
    pass

@router.get("/timeline")
async def get_timeline(
    ticket_id: int,
    module_names: str,  # 逗号分隔
    start_time: datetime,
    end_time: datetime
):
    """获取日志时间线"""
    pass
```

**验收标准**:
- [ ] 所有端点符合API规范
- [ ] 文件上传支持multipart/form-data
- [ ] 参数验证完整
- [ ] 错误处理统一

---

## 4. 数据库迁移

```sql
-- 创建servers表
CREATE TABLE servers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    host VARCHAR(255) NOT NULL,
    port INTEGER DEFAULT 22,
    username VARCHAR(100) NOT NULL,
    password_encrypted TEXT NOT NULL,
    encryption_key_id VARCHAR(50) NOT NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建log_files表
CREATE TABLE log_files (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES tickets(id),
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT,
    file_size BIGINT,
    source_type VARCHAR(20) NOT NULL,
    server_id INTEGER REFERENCES servers(id),
    module_name VARCHAR(100),
    log_format VARCHAR(20),
    upload_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_log_files_ticket_id ON log_files(ticket_id);
CREATE INDEX idx_log_files_status ON log_files(upload_status);

-- ClickHouse日志表
CREATE TABLE logs (
    timestamp DateTime64(3),
    log_file_id UInt32,
    module_name String,
    log_level String,
    message String,
    stack_trace String,
    request_id String,
    metadata String
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (log_file_id, timestamp, module_name);
```

---

## 5. 配置项

```python
LOG_COLLECTOR_CONFIG = {
    "max_file_size": 1024 * 1024 * 1024,  # 1GB
    "chunk_size": 10 * 1024 * 1024,  # 10MB
    "upload_dir": "/data/logs",
    "ssh_timeout": 30,
    "ssh_max_retries": 3,
    "parse_batch_size": 1000,
    "supported_formats": ["json", "text", "structured"]
}
```

---

## 6. 测试要点

### 单元测试
- [ ] 日志格式识别
- [ ] JSON日志解析
- [ ] 文本日志解析
- [ ] 批量插入逻辑

### 集成测试
- [ ] 文件上传流程
- [ ] SSH连接和下载
- [ ] 日志解析完整流程
- [ ] 日志查询功能

### 性能测试
- [ ] 1GB文件上传
- [ ] 大文件解析性能
- [ ] 并发上传处理

---

## 7. 依赖模块

### 外部依赖
- paramiko (SSH)
- aiofiles (异步文件IO)
- clickhouse-driver (ClickHouse)

### 内部依赖
- app.auth (认证)
- app.common.encryption (加密)
- app.common.logger (日志)

---

## 8. 实现顺序

1. 数据模型 → 2. 文件上传 → 3. 日志解析 → 4. SSH下载 → 5. 日志收集服务 → 6. Celery任务 → 7. API路由

---

## 9. 完成标准

- [ ] 所有任务完成
- [ ] 所有测试通过
- [ ] 支持1GB文件上传
- [ ] 日志解析准确率>95%
- [ ] 代码审查通过

---

**文档结束**
