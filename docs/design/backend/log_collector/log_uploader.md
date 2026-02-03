# 日志上传器详细设计

**文件路径**: `backend/app/log_collector/uploader.py`
**模块**: 日志收集模块
**作者**: Architect
**版本**: 1.0

---

## 1. 类概述

### 职责
处理日志文件上传，支持大文件分块上传和流式处理。

### 依赖
- `fastapi`: Web框架
- `app.log_collector.parser.LogParser`: 日志解析器
- `app.log_collector.repository.LogRepository`: 日志数据访问
- `app.common.logger`: 日志记录

---

## 2. 类定义

```python
from fastapi import UploadFile
from typing import Dict, Any
import aiofiles

class LogUploader:
    """
    日志上传处理器
    
    处理日志文件上传，支持大文件流式处理和异步解析。
    """

    def __init__(
        self,
        log_parser: LogParser,
        log_repository: LogRepository,
        max_file_size: int = 1073741824  # 1GB
    ):
        """初始化日志上传器"""
        pass
```

---

## 3. 方法列表

### 3.1 upload_log_file

```python
async def upload_log_file(
    self,
    ticket_id: int,
    file: UploadFile,
    module_name: str,
    source_type: str = "upload"
) -> Dict[str, Any]:
    """
    上传日志文件

    Args:
        ticket_id: 工单ID
        file: 上传的文件对象
        module_name: 模块名称
        source_type: 来源类型（upload/ssh/customer）

    Returns:
        Dict[str, Any]: 上传结果
            - log_file_id: 日志文件ID
            - file_name: 文件名
            - file_size: 文件大小
            - upload_status: 上传状态
            - task_id: 解析任务ID

    Raises:
        FileTooLargeError: 文件超过大小限制
        InvalidFileTypeError: 文件类型不支持

    业务逻辑:
        1. 验证文件大小
        2. 验证文件类型（.log, .txt, .json）
        3. 生成唯一文件名
        4. 流式保存文件到存储
        5. 创建log_file记录
        6. 提交异步解析任务
        7. 返回上传结果
    """
    pass
```

### 3.2 save_file_stream

```python
async def save_file_stream(
    self,
    file: UploadFile,
    file_path: str,
    chunk_size: int = 1048576  # 1MB
) -> int:
    """
    流式保存文件

    Args:
        file: 上传文件对象
        file_path: 保存路径
        chunk_size: 分块大小

    Returns:
        int: 文件大小（字节）

    业务逻辑:
        1. 打开目标文件
        2. 循环读取chunk
        3. 写入文件
        4. 累计文件大小
        5. 返回总大小
    """
    pass
```

---

**文档结束**
