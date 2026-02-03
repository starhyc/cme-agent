# 认证服务详细设计

**文件路径**: `backend/app/auth/service.py`
**模块**: 认证授权模块
**作者**: Architect
**版本**: 1.0

---

## 1. 类概述

### 职责
提供用户认证、会话管理、Token刷新等核心认证功能，协调密码验证、JWT生成、会话存储等子模块。

### 依赖
- `app.auth.repository.UserRepository`: 用户数据访问
- `app.auth.password_hasher.PasswordHasher`: 密码哈希验证
- `app.auth.jwt_handler.JWTHandler`: JWT Token处理
- `app.auth.audit_logger.AuditLogger`: 审计日志记录
- `redis`: Redis客户端（会话存储）
- `app.common.logger`: 日志记录

---

## 2. 类定义

```python
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import redis.asyncio as redis

class AuthService:
    """
    认证服务类

    提供用户认证、会话管理、Token刷新等功能。
    负责协调各个认证相关组件，实现完整的认证流程。
    """

    def __init__(
        self,
        user_repository: UserRepository,
        password_hasher: PasswordHasher,
        jwt_handler: JWTHandler,
        audit_logger: AuditLogger,
        redis_client: redis.Redis,
        session_expire_seconds: int = 1800
    ):
        """
        初始化认证服务

        Args:
            user_repository: 用户数据仓库
            password_hasher: 密码哈希处理器
            jwt_handler: JWT处理器
            audit_logger: 审计日志记录器
            redis_client: Redis客户端
            session_expire_seconds: 会话过期时间（秒），默认30分钟
        """
        pass
```

---

## 3. 属性列表

| 属性名 | 类型 | 说明 |
|--------|------|------|
| user_repository | UserRepository | 用户数据访问对象 |
| password_hasher | PasswordHasher | 密码哈希处理器 |
| jwt_handler | JWTHandler | JWT Token处理器 |
| audit_logger | AuditLogger | 审计日志记录器 |
| redis_client | redis.Redis | Redis异步客户端 |
| session_expire_seconds | int | 会话过期时间（秒） |
| logger | Logger | 日志记录器 |

---

## 4. 方法列表

### 4.1 login

```python
async def login(
    self,
    username: str,
    password: str,
    ip_address: Optional[str] = None
) -> Dict[str, Any]:
    """
    用户登录

    Args:
        username: 用户名
        password: 密码（明文）
        ip_address: 客户端IP地址

    Returns:
        Dict[str, Any]: 登录结果，包含：
            - token: 访问Token（JWT）
            - refresh_token: 刷新Token
            - expires_in: Token过期时间（秒）
            - user: 用户信息字典
                - id: 用户ID
                - username: 用户名
                - role: 角色

    Raises:
        AuthenticationError: 用户名或密码错误
        UserNotFoundError: 用户不存在
        AccountLockedError: 账户被锁定

    业务逻辑:
        1. 记录登录尝试日志
        2. 查询用户信息（通过UserRepository）
        3. 如果用户不存在，记录失败日志并抛出UserNotFoundError
        4. 验证密码（通过PasswordHasher）
        5. 如果密码错误，记录失败日志并抛出AuthenticationError
        6. 生成access_token和refresh_token（通过JWTHandler）
        7. 创建会话并存储到Redis
            - key: f"session:{user_id}:{session_id}"
            - value: JSON格式的会话信息
            - TTL: session_expire_seconds
        8. 记录成功登录的审计日志
        9. 返回Token和用户信息
    """
    pass
```

### 4.2 logout

```python
async def logout(
    self,
    user_id: int,
    session_id: str
) -> None:
    """
    用户登出

    Args:
        user_id: 用户ID
        session_id: 会话ID

    Returns:
        None

    Raises:
        SessionNotFoundError: 会话不存在

    业务逻辑:
        1. 记录登出操作日志
        2. 从Redis删除会话
            - key: f"session:{user_id}:{session_id}"
        3. 记录审计日志
        4. 如果会话不存在，记录警告日志但不抛出异常
    """
    pass
```

### 4.3 refresh_token

```python
async def refresh_token(
    self,
    refresh_token: str
) -> Dict[str, Any]:
    """
    刷新访问Token

    Args:
        refresh_token: 刷新Token

    Returns:
        Dict[str, Any]: 新的Token信息
            - token: 新的访问Token
            - expires_in: 过期时间（秒）

    Raises:
        InvalidTokenError: Token无效或已过期
        UserNotFoundError: 用户不存在

    业务逻辑:
        1. 验证refresh_token（通过JWTHandler）
        2. 从Token中提取user_id
        3. 查询用户信息确认用户仍然存在
        4. 生成新的access_token
        5. 更新Redis中的会话过期时间
        6. 记录审计日志
        7. 返回新的Token
    """
    pass
```

### 4.4 verify_session

```python
async def verify_session(
    self,
    user_id: int,
    session_id: str
) -> Optional[Dict[str, Any]]:
    """
    验证会话有效性

    Args:
        user_id: 用户ID
        session_id: 会话ID

    Returns:
        Optional[Dict[str, Any]]: 会话信息，如果会话有效
            - user_id: 用户ID
            - username: 用户名
            - role: 角色
            - created_at: 会话创建时间
        None: 如果会话无效或已过期

    Raises:
        无

    业务逻辑:
        1. 从Redis查询会话
            - key: f"session:{user_id}:{session_id}"
        2. 如果会话不存在，返回None
        3. 解析会话JSON数据
        4. 返回会话信息
    """
    pass
```

### 4.5 get_current_user

```python
async def get_current_user(
    self,
    token: str
) -> Dict[str, Any]:
    """
    从Token获取当前用户信息

    Args:
        token: 访问Token（JWT）

    Returns:
        Dict[str, Any]: 用户信息
            - id: 用户ID
            - username: 用户名
            - role: 角色

    Raises:
        InvalidTokenError: Token无效或已过期
        UserNotFoundError: 用户不存在

    业务逻辑:
        1. 验证Token（通过JWTHandler）
        2. 从Token中提取user_id
        3. 查询用户信息（通过UserRepository）
        4. 返回用户信息
    """
    pass
```

### 4.6 change_password

```python
async def change_password(
    self,
    user_id: int,
    old_password: str,
    new_password: str
) -> None:
    """
    修改密码

    Args:
        user_id: 用户ID
        old_password: 旧密码
        new_password: 新密码

    Returns:
        None

    Raises:
        UserNotFoundError: 用户不存在
        AuthenticationError: 旧密码错误
        WeakPasswordError: 新密码强度不足

    业务逻辑:
        1. 查询用户信息
        2. 验证旧密码
        3. 验证新密码强度（至少8位，包含大小写字母和数字）
        4. 生成新密码哈希
        5. 更新数据库中的密码
        6. 清除该用户的所有会话（强制重新登录）
        7. 记录审计日志
    """
    pass
```

### 4.7 _create_session

```python
async def _create_session(
    self,
    user_id: int,
    username: str,
    role: str
) -> str:
    """
    创建会话（私有方法）

    Args:
        user_id: 用户ID
        username: 用户名
        role: 角色

    Returns:
        str: 会话ID

    业务逻辑:
        1. 生成唯一的session_id（UUID）
        2. 构建会话数据（JSON格式）
        3. 存储到Redis
            - key: f"session:{user_id}:{session_id}"
            - value: 会话JSON
            - TTL: session_expire_seconds
        4. 返回session_id
    """
    pass
```

### 4.8 _clear_user_sessions

```python
async def _clear_user_sessions(
    self,
    user_id: int
) -> int:
    """
    清除用户的所有会话（私有方法）

    Args:
        user_id: 用户ID

    Returns:
        int: 清除的会话数量

    业务逻辑:
        1. 查找该用户的所有会话key
            - pattern: f"session:{user_id}:*"
        2. 批量删除所有会话
        3. 返回删除数量
    """
    pass
```

---

## 5. 异常定义

```python
class AuthenticationError(Exception):
    """认证失败异常（用户名或密码错误）"""
    pass

class UserNotFoundError(Exception):
    """用户不存在异常"""
    pass

class InvalidTokenError(Exception):
    """Token无效或已过期异常"""
    pass

class SessionNotFoundError(Exception):
    """会话不存在异常"""
    pass

class AccountLockedError(Exception):
    """账户被锁定异常"""
    pass

class WeakPasswordError(Exception):
    """密码强度不足异常"""
    pass
```

---

## 6. 使用示例

```python
# 初始化服务
auth_service = AuthService(
    user_repository=user_repo,
    password_hasher=password_hasher,
    jwt_handler=jwt_handler,
    audit_logger=audit_logger,
    redis_client=redis_client,
    session_expire_seconds=1800
)

# 用户登录
try:
    result = await auth_service.login(
        username="admin",
        password="password123",
        ip_address="192.168.1.100"
    )
    print(f"登录成功: {result['user']['username']}")
    print(f"Token: {result['token']}")
except AuthenticationError as e:
    print(f"登录失败: {e}")

# 验证会话
session_info = await auth_service.verify_session(
    user_id=1,
    session_id="session_abc123"
)
if session_info:
    print(f"会话有效: {session_info['username']}")

# 刷新Token
new_token = await auth_service.refresh_token(
    refresh_token="refresh_token_xyz"
)
print(f"新Token: {new_token['token']}")

# 登出
await auth_service.logout(
    user_id=1,
    session_id="session_abc123"
)
print("登出成功")

# 修改密码
await auth_service.change_password(
    user_id=1,
    old_password="old_pass",
    new_password="NewPass123"
)
print("密码修改成功")
```

---

## 7. 依赖关系

### 依赖的模块
- `app.auth.repository.UserRepository`: 用户数据访问
- `app.auth.password_hasher.PasswordHasher`: 密码验证
- `app.auth.jwt_handler.JWTHandler`: JWT处理
- `app.auth.audit_logger.AuditLogger`: 审计日志
- `redis.asyncio`: Redis异步客户端
- `app.common.logger`: 日志记录

### 被依赖的模块
- `app.auth.router`: API路由层
- `app.auth.middleware`: 认证中间件

---

## 8. 配置项

```python
# config.py
AUTH_SERVICE_CONFIG = {
    "session_expire_seconds": 1800,  # 会话过期时间（30分钟）
    "max_login_attempts": 5,  # 最大登录尝试次数
    "lockout_duration_seconds": 900,  # 账户锁定时间（15分钟）
    "password_min_length": 8,  # 密码最小长度
    "password_require_uppercase": True,  # 要求大写字母
    "password_require_lowercase": True,  # 要求小写字母
    "password_require_digit": True,  # 要求数字
    "password_require_special": False  # 要求特殊字符
}

# Redis配置
REDIS_CONFIG = {
    "host": "localhost",
    "port": 6379,
    "db": 0,
    "password": None,
    "decode_responses": True
}
```

---

## 9. 性能优化

1. **Redis连接池**: 使用连接池复用Redis连接，避免频繁建立连接
2. **会话缓存**: 会话信息存储在Redis中，避免频繁查询数据库
3. **异步操作**: 所有I/O操作使用async/await，提高并发性能
4. **批量删除**: 清除用户会话时使用pipeline批量删除
5. **Token缓存**: 对于频繁验证的Token，可以在应用层缓存验证结果（短时间）

---

## 10. 测试要点

### 单元测试
- [ ] 登录成功流程
- [ ] 登录失败（用户不存在）
- [ ] 登录失败（密码错误）
- [ ] Token刷新成功
- [ ] Token刷新失败（Token过期）
- [ ] 会话验证成功
- [ ] 会话验证失败（会话过期）
- [ ] 登出成功
- [ ] 修改密码成功
- [ ] 修改密码失败（旧密码错误）
- [ ] 修改密码失败（新密码强度不足）

### 集成测试
- [ ] 完整登录-验证-登出流程
- [ ] 并发登录测试
- [ ] 会话过期自动清理
- [ ] 修改密码后强制重新登录

### 安全测试
- [ ] SQL注入防护
- [ ] 密码暴力破解防护
- [ ] 会话劫持防护
- [ ] Token伪造防护

---

**文档结束**
