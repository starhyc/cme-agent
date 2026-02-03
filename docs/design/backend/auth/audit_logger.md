# 审计日志记录器详细设计

**文件路径**: `backend/app/auth/audit_logger.py`
**模块**: 认证授权模块
**作者**: Architect
**版本**: 1.0

---

## 1. 类概述

### 职责
记录所有安全相关的操作审计日志，包括登录、权限检查、敏感操作等。

### 依赖
- `app.auth.repository.AuditLogRepository`: 审计日志数据访问
- `app.common.logger`: 日志记录

---

## 2. 类定义

```python
from typing import Optional, Dict, Any
from datetime import datetime

class AuditLogger:
    """
    审计日志记录器

    记录所有安全相关操作的审计日志，用于安全审计和问题追溯。
    """

    def __init__(self, audit_log_repository: AuditLogRepository):
        """
        初始化审计日志记录器

        Args:
            audit_log_repository: 审计日志数据仓库
        """
        pass
```

---

## 3. 属性列表

| 属性名 | 类型 | 说明 |
|--------|------|------|
| audit_log_repository | AuditLogRepository | 审计日志数据仓库 |
| logger | Logger | 日志记录器 |

---

## 4. 方法列表

### 4.1 log_login

```python
async def log_login(
    self,
    user_id: Optional[int],
    username: str,
    ip_address: str,
    success: bool,
    failure_reason: Optional[str] = None
) -> None:
    """
    记录登录日志

    Args:
        user_id: 用户ID（登录失败时可能为None）
        username: 用户名
        ip_address: 客户端IP地址
        success: 是否成功
        failure_reason: 失败原因（可选）

    Returns:
        None

    业务逻辑:
        1. 构建审计日志数据
        2. action: "LOGIN_SUCCESS" 或 "LOGIN_FAILED"
        3. details包含username和failure_reason
        4. 异步写入数据库
        5. 记录应用日志
    """
    pass
```

### 4.2 log_logout

```python
async def log_logout(
    self,
    user_id: int,
    username: str,
    ip_address: str
) -> None:
    """
    记录登出日志

    Args:
        user_id: 用户ID
        username: 用户名
        ip_address: 客户端IP地址

    Returns:
        None

    业务逻辑:
        1. 构建审计日志数据
        2. action: "LOGOUT"
        3. 异步写入数据库
    """
    pass
```

### 4.3 log_permission_check

```python
async def log_permission_check(
    self,
    user_id: int,
    username: str,
    resource_type: str,
    resource_id: Optional[str],
    action: str,
    granted: bool
) -> None:
    """
    记录权限检查日志

    Args:
        user_id: 用户ID
        username: 用户名
        resource_type: 资源类型
        resource_id: 资源ID
        action: 操作类型
        granted: 是否授权

    Returns:
        None

    业务逻辑:
        1. 构建审计日志数据
        2. action: "PERMISSION_CHECK"
        3. details包含resource_type, action, granted
        4. 异步写入数据库
    """
    pass
```

### 4.4 log_ssh_connection

```python
async def log_ssh_connection(
    self,
    user_id: int,
    username: str,
    server_id: int,
    server_host: str,
    success: bool,
    error_message: Optional[str] = None
) -> None:
    """
    记录SSH连接日志

    Args:
        user_id: 用户ID
        username: 用户名
        server_id: 服务器ID
        server_host: 服务器地址
        success: 是否成功
        error_message: 错误信息（可选）

    Returns:
        None

    业务逻辑:
        1. 构建审计日志数据
        2. action: "SSH_CONNECT_SUCCESS" 或 "SSH_CONNECT_FAILED"
        3. resource_type: "server"
        4. resource_id: server_id
        5. details包含server_host和error_message
        6. 异步写入数据库
    """
    pass
```

### 4.5 log_code_access

```python
async def log_code_access(
    self,
    user_id: int,
    username: str,
    module_name: str,
    file_path: str,
    action: str = "READ"
) -> None:
    """
    记录代码访问日志

    Args:
        user_id: 用户ID
        username: 用户名
        module_name: 模块名称
        file_path: 文件路径
        action: 操作类型（READ/WRITE）

    Returns:
        None

    业务逻辑:
        1. 构建审计日志数据
        2. action: "CODE_ACCESS"
        3. resource_type: "code_module"
        4. resource_id: module_name
        5. details包含file_path
        6. 异步写入数据库
    """
    pass
```

### 4.6 log_sensitive_operation

```python
async def log_sensitive_operation(
    self,
    user_id: int,
    username: str,
    operation: str,
    resource_type: str,
    resource_id: str,
    details: Optional[Dict[str, Any]] = None,
    ip_address: Optional[str] = None
) -> None:
    """
    记录敏感操作日志

    Args:
        user_id: 用户ID
        username: 用户名
        operation: 操作名称
        resource_type: 资源类型
        resource_id: 资源ID
        details: 操作详情
        ip_address: 客户端IP地址

    Returns:
        None

    业务逻辑:
        1. 构建审计日志数据
        2. action: operation
        3. 包含所有提供的信息
        4. 异步写入数据库
        5. 同时记录到应用日志（高优先级）
    """
    pass
```

### 4.7 query_audit_logs

```python
async def query_audit_logs(
    self,
    user_id: Optional[int] = None,
    action: Optional[str] = None,
    resource_type: Optional[str] = None,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    page: int = 1,
    page_size: int = 50
) -> tuple[List[Dict[str, Any]], int]:
    """
    查询审计日志

    Args:
        user_id: 用户ID筛选
        action: 操作类型筛选
        resource_type: 资源类型筛选
        start_time: 开始时间
        end_time: 结束时间
        page: 页码
        page_size: 每页数量

    Returns:
        tuple[List[Dict[str, Any]], int]: (日志列表, 总数)

    业务逻辑:
        1. 构建查询条件
        2. 调用repository查询
        3. 返回结果
    """
    pass
```

---

## 5. 审计日志数据结构

```python
class AuditLog:
    """审计日志模型"""
    id: int
    user_id: Optional[int]
    action: str  # 操作类型
    resource_type: Optional[str]  # 资源类型
    resource_id: Optional[str]  # 资源ID
    details: Dict[str, Any]  # 详细信息（JSON）
    ip_address: Optional[str]  # 客户端IP
    created_at: datetime  # 创建时间
```

---

## 6. 使用示例

```python
# 初始化审计日志记录器
audit_logger = AuditLogger(audit_log_repository)

# 记录登录成功
await audit_logger.log_login(
    user_id=1,
    username="admin",
    ip_address="192.168.1.100",
    success=True
)

# 记录登录失败
await audit_logger.log_login(
    user_id=None,
    username="hacker",
    ip_address="10.0.0.1",
    success=False,
    failure_reason="密码错误"
)

# 记录权限检查
await audit_logger.log_permission_check(
    user_id=2,
    username="john",
    resource_type="server",
    resource_id="5",
    action="DELETE",
    granted=False
)

# 记录SSH连接
await audit_logger.log_ssh_connection(
    user_id=1,
    username="admin",
    server_id=3,
    server_host="192.168.1.50",
    success=True
)

# 记录代码访问
await audit_logger.log_code_access(
    user_id=2,
    username="john",
    module_name="payment-service",
    file_path="src/payment/processor.py"
)

# 记录敏感操作
await audit_logger.log_sensitive_operation(
    user_id=1,
    username="admin",
    operation="DELETE_USER",
    resource_type="user",
    resource_id="10",
    details={"deleted_username": "old_user"},
    ip_address="192.168.1.100"
)

# 查询审计日志
logs, total = await audit_logger.query_audit_logs(
    user_id=1,
    action="LOGIN_SUCCESS",
    start_time=datetime(2026, 2, 1),
    end_time=datetime(2026, 2, 3),
    page=1,
    page_size=20
)
```

---

## 7. 依赖关系

### 依赖的模块
- `app.auth.repository.AuditLogRepository`: 审计日志数据访问
- `app.common.logger`: 日志记录

### 被依赖的模块
- `app.auth.service.AuthService`: 认证服务
- `app.auth.permission_checker.PermissionChecker`: 权限检查器
- 所有需要审计的服务层

---

## 8. 数据库表结构

```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(100),
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
```

---

## 9. 性能优化

1. **异步写入**: 所有日志写入使用异步操作，不阻塞主流程
2. **批量写入**: 高并发场景可以批量写入（未来扩展）
3. **索引优化**: 为常用查询字段添加索引
4. **数据归档**: 定期归档旧日志，保持表大小合理
5. **分区表**: 按时间分区，提高查询性能（未来扩展）

---

## 10. 安全考虑

1. **敏感信息脱敏**: 不记录密码、Token等敏感信息
2. **完整性保护**: 审计日志只能追加，不能修改或删除
3. **访问控制**: 只有管理员可以查询审计日志
4. **备份**: 定期备份审计日志到安全存储
5. **告警**: 异常操作（如大量失败登录）触发告警

---

## 11. 审计日志保留策略

| 日志类型 | 保留时间 | 归档策略 |
|---------|---------|---------|
| 登录日志 | 90天 | 归档到冷存储 |
| 权限检查 | 30天 | 定期清理 |
| SSH连接 | 90天 | 归档到冷存储 |
| 代码访问 | 180天 | 归档到冷存储 |
| 敏感操作 | 365天 | 永久保留 |

---

## 12. 测试要点

### 单元测试
- [ ] 记录登录成功日志
- [ ] 记录登录失败日志
- [ ] 记录登出日志
- [ ] 记录权限检查日志
- [ ] 记录SSH连接日志
- [ ] 记录代码访问日志
- [ ] 记录敏感操作日志
- [ ] 查询审计日志（各种筛选条件）

### 集成测试
- [ ] 审计日志正确写入数据库
- [ ] 高并发写入测试
- [ ] 查询性能测试

### 安全测试
- [ ] 敏感信息不被记录
- [ ] 审计日志不能被篡改
- [ ] 只有管理员可以查询

---

**文档结束**
