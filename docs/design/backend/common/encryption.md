# 加密工具详细设计

**文件路径**: `backend/app/common/encryption.py`
**模块**: 公共模块
**作者**: Architect
**版本**: 1.0

---

## 1. 类概述

### 职责
提供数据加密和解密功能，使用AES-256-GCM算法保护敏感数据。

### 依赖
- `cryptography`: 加密库
- `app.common.config`: 配置管理
- `app.common.logger`: 日志记录

---

## 2. 类定义

```python
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from typing import Tuple
import os

class EncryptionService:
    """
    加密服务类
    
    使用AES-256-GCM算法提供数据加密和解密功能。
    """

    def __init__(self, master_key: bytes):
        """
        初始化加密服务

        Args:
            master_key: 主密钥（32字节）
        """
        pass
```

---

## 3. 方法列表

### 3.1 encrypt

```python
def encrypt(self, plaintext: str) -> str:
    """
    加密数据

    Args:
        plaintext: 明文字符串

    Returns:
        str: 加密后的字符串（Base64编码）

    业务逻辑:
        1. 生成随机IV（12字节）
        2. 使用AES-256-GCM加密
        3. 组合IV + 密文 + Tag
        4. Base64编码
        5. 返回加密字符串
    """
    pass
```

### 3.2 decrypt

```python
def decrypt(self, ciphertext: str) -> str:
    """
    解密数据

    Args:
        ciphertext: 密文字符串（Base64编码）

    Returns:
        str: 解密后的明文

    Raises:
        DecryptionError: 解密失败

    业务逻辑:
        1. Base64解码
        2. 分离IV、密文、Tag
        3. 使用AES-256-GCM解密
        4. 返回明文
    """
    pass
```

---

**文档结束**
