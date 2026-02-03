# SSH日志下载器详细设计

**文件路径**: `backend/app/log_collector/ssh_downloader.py`
**模块**: 日志收集模块
**作者**: Architect
**版本**: 1.0

---

## 1. 类概述

### 职责
通过SSH连接远程服务器下载日志文件。

### 依赖
- `paramiko`: SSH客户端库
- `app.common.encryption.EncryptionService`: 加密服务
- `app.common.logger`: 日志记录

---

## 2. 类定义

```python
import paramiko
from typing import List, Dict, Any

class SSHDownloader:
    """
    SSH日志下载器
    
    连接远程服务器并下载日志文件。
    """

    def __init__(
        self,
        encryption_service: EncryptionService,
        connection_timeout: int = 30
    ):
        """初始化SSH下载器"""
        pass
```

---

## 3. 方法列表

### 3.1 download_logs

```python
async def download_logs(
    self,
    server_config: Dict[str, Any],
    log_paths: List[str],
    local_dir: str
) -> List[Dict[str, Any]]:
    """
    从服务器下载日志文件

    Args:
        server_config: 服务器配置
            - host: 主机地址
            - port: SSH端口
            - username: 用户名
            - password_encrypted: 加密的密码
        log_paths: 日志文件路径列表
        local_dir: 本地保存目录

    Returns:
        List[Dict[str, Any]]: 下载结果列表

    业务逻辑:
        1. 解密SSH密码
        2. 建立SSH连接
        3. 遍历日志路径
        4. 使用SFTP下载文件
        5. 记录下载结果
        6. 关闭连接
        7. 返回结果列表
    """
    pass
```

### 3.2 test_connection

```python
async def test_connection(
    self,
    server_config: Dict[str, Any]
) -> bool:
    """
    测试SSH连接

    Args:
        server_config: 服务器配置

    Returns:
        bool: 连接是否成功
    """
    pass
```

---

**文档结束**
