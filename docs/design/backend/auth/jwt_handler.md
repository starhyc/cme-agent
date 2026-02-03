# JWT处理器详细设计

**文件路径**: `backend/app/auth/jwt_handler.py`
**模块**: 认证授权模块
**作者**: Architect
**版本**: 1.0

---

## 1. 类概述

### 职责
负责JWT Token的生成、验证和解析，支持访问Token和刷新Token两种类型。

### 依赖
- `PyJWT`: JWT编码解码库
- `app.common.config`: 配置管理
- `app.common.logger`: 日志记录

---

## 2. 类定义

```python
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import jwt

class JWTHandler:
    """
    JWT Token处理器

    负责生成和验证JWT Token，支持访问Token和刷新Token。
    使用HS256算法进行签名。
    """

    def __init__(
        self,
        secret_key: str,
        algorithm: str = "HS256",
        access_token_expire_minutes: int = 30,
        refresh_token_expire_days: int = 7
    ):
        """
        初始化JWT处理器

        Args:
            secret_key: JWT签名密钥
            algorithm: 签名算法，默认HS256
            access_token_expire_minutes: 访问Token过期时间（分钟）
            refresh_token_expire_days: 刷新Token过期时间（天）
        """
        pass
```

---

## 3. 属性列表

| 属性名 | 类型 | 说明 |
|--------|------|------|
| secret_key | str | JWT签名密钥 |
| algorithm | str | 签名算法（HS256） |
| access_token_expire_minutes | int | 访问Token过期时间（分钟） |
| refresh_token_expire_days | int | 刷新Token过期时间（天） |
| logger | Logger | 日志记录器 |

---

## 4. 方法列表

### 4.1 create_access_token

```python
def create_access_token(
    self,
    user_id: int,
    username: str,
    role: str,
    additional_claims: Optional[Dict[str, Any]] = None
) -> str:
    """
    创建访问Token

    Args:
        user_id: 用户ID
        username: 用户名
        role: 用户角色
        additional_claims: 额外的声明（可选）

    Returns:
        str: JWT Token字符串

    Raises:
        JWTEncodeError: Token编码失败

    业务逻辑:
        1. 计算过期时间（当前时间 + access_token_expire_minutes）
        2. 构建payload:
           - sub: user_id（主题）
           - username: 用户名
           - role: 角色
           - exp: 过期时间戳
           - iat: 签发时间戳
           - type: "access"
           - 合并additional_claims
        3. 使用secret_key和algorithm编码JWT
        4. 记录Token生成日志
        5. 返回Token字符串
    """
    pass
```

### 4.2 create_refresh_token

```python
def create_refresh_token(
    self,
    user_id: int
) -> str:
    """
    创建刷新Token

    Args:
        user_id: 用户ID

    Returns:
        str: JWT刷新Token字符串

    Raises:
        JWTEncodeError: Token编码失败

    业务逻辑:
        1. 计算过期时间（当前时间 + refresh_token_expire_days）
        2. 构建payload:
           - sub: user_id
           - exp: 过期时间戳
           - iat: 签发时间戳
           - type: "refresh"
        3. 使用secret_key和algorithm编码JWT
        4. 记录Token生成日志
        5. 返回Token字符串
    """
    pass
```

### 4.3 verify_token

```python
def verify_token(
    self,
    token: str,
    token_type: str = "access"
) -> Dict[str, Any]:
    """
    验证Token并返回payload

    Args:
        token: JWT Token字符串
        token_type: Token类型（"access"或"refresh"）

    Returns:
        Dict[str, Any]: Token的payload，包含：
            - sub: 用户ID
            - username: 用户名（仅access token）
            - role: 角色（仅access token）
            - exp: 过期时间戳
            - iat: 签发时间戳
            - type: Token类型

    Raises:
        InvalidTokenError: Token无效
        ExpiredTokenError: Token已过期
        InvalidTokenTypeError: Token类型不匹配

    业务逻辑:
        1. 使用secret_key和algorithm解码JWT
        2. 捕获jwt.ExpiredSignatureError，抛出ExpiredTokenError
        3. 捕获jwt.InvalidTokenError，抛出InvalidTokenError
        4. 验证Token类型是否匹配
        5. 记录Token验证日志
        6. 返回payload
    """
    pass
```

### 4.4 decode_token_without_verification

```python
def decode_token_without_verification(
    self,
    token: str
) -> Dict[str, Any]:
    """
    解码Token但不验证签名（用于调试）

    Args:
        token: JWT Token字符串

    Returns:
        Dict[str, Any]: Token的payload

    Raises:
        InvalidTokenError: Token格式无效

    业务逻辑:
        1. 使用jwt.decode，设置verify_signature=False
        2. 返回payload
        3. 仅用于调试和日志记录，不用于认证
    """
    pass
```

### 4.5 get_token_expiry

```python
def get_token_expiry(
    self,
    token: str
) -> Optional[datetime]:
    """
    获取Token的过期时间

    Args:
        token: JWT Token字符串

    Returns:
        Optional[datetime]: 过期时间，如果Token无效返回None

    业务逻辑:
        1. 解码Token（不验证签名）
        2. 提取exp字段
        3. 转换为datetime对象
        4. 返回过期时间
    """
    pass
```

### 4.6 is_token_expired

```python
def is_token_expired(
    self,
    token: str
) -> bool:
    """
    检查Token是否已过期

    Args:
        token: JWT Token字符串

    Returns:
        bool: True表示已过期，False表示未过期

    业务逻辑:
        1. 获取Token过期时间
        2. 与当前时间比较
        3. 返回比较结果
    """
    pass
```

---

## 5. 异常定义

```python
class JWTEncodeError(Exception):
    """JWT编码失败异常"""
    pass

class InvalidTokenError(Exception):
    """Token无效异常"""
    pass

class ExpiredTokenError(Exception):
    """Token已过期异常"""
    pass

class InvalidTokenTypeError(Exception):
    """Token类型不匹配异常"""
    pass
```

---

## 6. 使用示例

```python
# 初始化JWT处理器
jwt_handler = JWTHandler(
    secret_key="your-secret-key-here",
    algorithm="HS256",
    access_token_expire_minutes=30,
    refresh_token_expire_days=7
)

# 创建访问Token
access_token = jwt_handler.create_access_token(
    user_id=1,
    username="admin",
    role="admin"
)
print(f"Access Token: {access_token}")

# 创建刷新Token
refresh_token = jwt_handler.create_refresh_token(user_id=1)
print(f"Refresh Token: {refresh_token}")

# 验证访问Token
try:
    payload = jwt_handler.verify_token(access_token, token_type="access")
    print(f"User ID: {payload['sub']}")
    print(f"Username: {payload['username']}")
    print(f"Role: {payload['role']}")
except ExpiredTokenError:
    print("Token已过期")
except InvalidTokenError:
    print("Token无效")

# 验证刷新Token
try:
    payload = jwt_handler.verify_token(refresh_token, token_type="refresh")
    print(f"User ID: {payload['sub']}")
except ExpiredTokenError:
    print("刷新Token已过期")

# 检查Token是否过期
if jwt_handler.is_token_expired(access_token):
    print("Token已过期")
else:
    print("Token仍然有效")

# 获取Token过期时间
expiry = jwt_handler.get_token_expiry(access_token)
print(f"Token将在 {expiry} 过期")
```

---

## 7. 依赖关系

### 依赖的模块
- `PyJWT`: JWT编码解码
- `app.common.config`: 配置管理
- `app.common.logger`: 日志记录

### 被依赖的模块
- `app.auth.service.AuthService`: 认证服务
- `app.auth.middleware.AuthMiddleware`: 认证中间件

---

## 8. 配置项

```python
# config.py
JWT_CONFIG = {
    "secret_key": "your-secret-key-change-in-production",
    "algorithm": "HS256",
    "access_token_expire_minutes": 30,
    "refresh_token_expire_days": 7
}
```

---

## 9. Token Payload结构

### 访问Token Payload
```json
{
  "sub": 1,
  "username": "admin",
  "role": "admin",
  "exp": 1738579200,
  "iat": 1738577400,
  "type": "access"
}
```

### 刷新Token Payload
```json
{
  "sub": 1,
  "exp": 1739184000,
  "iat": 1738577400,
  "type": "refresh"
}
```

---

## 10. 性能优化

1. **密钥缓存**: secret_key在初始化时加载，避免重复读取
2. **算法固定**: 使用HS256对称加密，性能优于RS256非对称加密
3. **最小化payload**: 只包含必要信息，减少Token大小
4. **无状态验证**: JWT验证不需要查询数据库，性能高

---

## 11. 安全考虑

1. **密钥管理**: secret_key必须保密，不能硬编码在代码中
2. **密钥强度**: 使用至少32字节的随机密钥
3. **算法限制**: 只允许HS256算法，防止算法混淆攻击
4. **过期时间**: 访问Token设置较短过期时间（30分钟）
5. **Token撤销**: 配合Redis会话管理实现Token撤销
6. **HTTPS传输**: Token必须通过HTTPS传输，防止中间人攻击

---

## 12. 测试要点

### 单元测试
- [ ] 创建访问Token成功
- [ ] 创建刷新Token成功
- [ ] 验证有效Token成功
- [ ] 验证过期Token失败
- [ ] 验证无效Token失败
- [ ] 验证Token类型不匹配失败
- [ ] 获取Token过期时间正确
- [ ] 检查Token是否过期正确

### 安全测试
- [ ] 使用错误密钥验证Token失败
- [ ] 篡改Token payload验证失败
- [ ] 使用过期Token验证失败
- [ ] Token类型混用验证失败

---

**文档结束**
