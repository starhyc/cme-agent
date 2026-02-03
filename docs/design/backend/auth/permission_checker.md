# 权限检查器详细设计

**文件路径**: `backend/app/auth/permission_checker.py`
**模块**: 认证授权模块
**作者**: Architect
**版本**: 1.0

---

## 1. 类概述

### 职责
实现基于角色的访问控制(RBAC)，检查用户对资源的操作权限。

### 依赖
- `app.auth.models.User`: 用户模型
- `app.common.logger`: 日志记录

---

## 2. 类定义

```python
from typing import Dict, List, Optional
from enum import Enum

class ResourceType(Enum):
    """资源类型枚举"""
    TICKET = "ticket"
    SERVER = "server"
    CODE_MODULE = "code_module"
    REPORT = "report"
    USER = "user"
    AUDIT_LOG = "audit_log"

class Action(Enum):
    """操作类型枚举"""
    READ = "read"
    WRITE = "write"
    DELETE = "delete"
    EXECUTE = "execute"

class PermissionChecker:
    """
    权限检查器

    实现RBAC权限控制，支持角色级别和资源级别的权限检查。
    """

    def __init__(self):
        """初始化权限检查器"""
        pass
```

---

## 3. 属性列表

| 属性名 | 类型 | 说明 |
|--------|------|------|
| permission_matrix | Dict[str, Dict[str, List[str]]] | 权限矩阵（角色->资源->操作列表） |
| logger | Logger | 日志记录器 |

---

## 4. 方法列表

### 4.1 check_permission

```python
def check_permission(
    self,
    user: User,
    resource_type: ResourceType,
    action: Action,
    resource_id: Optional[str] = None
) -> bool:
    """
    检查用户权限

    Args:
        user: 用户对象
        resource_type: 资源类型
        action: 操作类型
        resource_id: 资源ID（可选，用于资源级权限检查）

    Returns:
        bool: True表示有权限，False表示无权限

    业务逻辑:
        1. 记录权限检查日志
        2. 从permission_matrix获取该角色对该资源的权限列表
        3. 检查action是否在权限列表中
        4. 如果提供了resource_id，进行资源级权限检查
        5. 返回检查结果
    """
    pass
```

### 4.2 require_permission

```python
def require_permission(
    self,
    user: User,
    resource_type: ResourceType,
    action: Action,
    resource_id: Optional[str] = None
) -> None:
    """
    要求用户具有指定权限，否则抛出异常

    Args:
        user: 用户对象
        resource_type: 资源类型
        action: 操作类型
        resource_id: 资源ID（可选）

    Returns:
        None

    Raises:
        PermissionDeniedError: 权限不足

    业务逻辑:
        1. 调用check_permission检查权限
        2. 如果无权限，抛出PermissionDeniedError
        3. 记录权限拒绝日志
    """
    pass
```

### 4.3 require_admin

```python
def require_admin(
    self,
    user: User
) -> None:
    """
    要求管理员权限

    Args:
        user: 用户对象

    Returns:
        None

    Raises:
        PermissionDeniedError: 非管理员用户

    业务逻辑:
        1. 检查user.role是否为"admin"
        2. 如果不是，抛出PermissionDeniedError
        3. 记录权限检查日志
    """
    pass
```

### 4.4 can_access_code_module

```python
def can_access_code_module(
    self,
    user: User,
    module_name: str
) -> bool:
    """
    检查用户是否可以访问指定代码模块

    Args:
        user: 用户对象
        module_name: 模块名称

    Returns:
        bool: True表示可以访问

    业务逻辑:
        1. 管理员可以访问所有模块
        2. 普通用户检查模块是否在敏感模块列表中
        3. 如果是敏感模块，返回False
        4. 否则返回True
    """
    pass
```

### 4.5 can_access_server

```python
def can_access_server(
    self,
    user: User,
    server_id: int
) -> bool:
    """
    检查用户是否可以访问指定服务器

    Args:
        user: 用户对象
        server_id: 服务器ID

    Returns:
        bool: True表示可以访问

    业务逻辑:
        1. 管理员可以访问所有服务器
        2. 普通用户只能访问自己创建的服务器
        3. 查询服务器的created_by字段
        4. 比较是否与user.id相同
    """
    pass
```

### 4.6 get_user_permissions

```python
def get_user_permissions(
    self,
    user: User
) -> Dict[str, List[str]]:
    """
    获取用户的所有权限

    Args:
        user: 用户对象

    Returns:
        Dict[str, List[str]]: 权限字典
            key: 资源类型
            value: 操作列表

    业务逻辑:
        1. 从permission_matrix获取该角色的权限
        2. 返回权限字典
    """
    pass
```

---

## 5. 权限矩阵

```python
PERMISSION_MATRIX = {
    "admin": {
        "ticket": ["read", "write", "delete"],
        "server": ["read", "write", "delete", "execute"],
        "code_module": ["read", "write", "delete"],
        "report": ["read", "write", "delete"],
        "user": ["read", "write", "delete"],
        "audit_log": ["read"]
    },
    "user": {
        "ticket": ["read", "write"],
        "server": ["read"],  # 只能读取自己创建的
        "code_module": ["read"],  # 不能访问敏感模块
        "report": ["read", "write"],
        "user": ["read"],  # 只能读取自己的信息
        "audit_log": []  # 无权限
    }
}

# 敏感代码模块列表（普通用户无法访问）
SENSITIVE_MODULES = [
    "auth-service",
    "payment-service",
    "encryption-service"
]
```

---

## 6. 异常定义

```python
class PermissionDeniedError(Exception):
    """权限不足异常"""
    def __init__(self, message: str, required_permission: Optional[str] = None):
        self.message = message
        self.required_permission = required_permission
        super().__init__(self.message)
```

---

## 7. 使用示例

```python
# 初始化权限检查器
permission_checker = PermissionChecker()

# 检查权限
user = User(id=1, username="john", role="user")

# 检查是否有读取工单的权限
if permission_checker.check_permission(
    user=user,
    resource_type=ResourceType.TICKET,
    action=Action.READ
):
    print("用户有读取工单的权限")

# 要求管理员权限
try:
    permission_checker.require_admin(user)
    print("用户是管理员")
except PermissionDeniedError:
    print("用户不是管理员")

# 要求特定权限
try:
    permission_checker.require_permission(
        user=user,
        resource_type=ResourceType.SERVER,
        action=Action.DELETE
    )
    # 执行删除操作
except PermissionDeniedError as e:
    print(f"权限不足: {e.message}")

# 检查代码模块访问权限
if permission_checker.can_access_code_module(user, "payment-service"):
    print("可以访问支付服务代码")
else:
    print("无法访问支付服务代码（敏感模块）")

# 获取用户所有权限
permissions = permission_checker.get_user_permissions(user)
print(f"用户权限: {permissions}")
```

---

## 8. 装饰器支持

```python
from functools import wraps
from typing import Callable

def require_permission(
    resource_type: ResourceType,
    action: Action
) -> Callable:
    """
    权限检查装饰器

    用法:
        @require_permission(ResourceType.TICKET, Action.WRITE)
        async def create_ticket(user: User, ...):
            pass
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # 从参数中提取user对象
            user = kwargs.get('user') or args[0]

            # 检查权限
            permission_checker = PermissionChecker()
            permission_checker.require_permission(
                user=user,
                resource_type=resource_type,
                action=action
            )

            # 执行原函数
            return await func(*args, **kwargs)
        return wrapper
    return decorator

def require_admin_role() -> Callable:
    """
    管理员权限装饰器

    用法:
        @require_admin_role()
        async def delete_user(user: User, ...):
            pass
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            user = kwargs.get('user') or args[0]

            permission_checker = PermissionChecker()
            permission_checker.require_admin(user)

            return await func(*args, **kwargs)
        return wrapper
    return decorator
```

---

## 9. 依赖关系

### 依赖的模块
- `app.auth.models.User`: 用户模型
- `app.common.logger`: 日志记录

### 被依赖的模块
- `app.auth.service.AuthService`: 认证服务
- `app.auth.router`: API路由
- 所有需要权限控制的服务层

---

## 10. 配置项

```python
# config.py
PERMISSION_CONFIG = {
    "sensitive_modules": [
        "auth-service",
        "payment-service",
        "encryption-service"
    ],
    "enable_resource_level_check": True,
    "log_permission_checks": True
}
```

---

## 11. 扩展性设计

### 未来可扩展的功能
1. **动态权限**: 从数据库加载权限配置
2. **细粒度权限**: 支持字段级权限控制
3. **权限继承**: 支持角色继承
4. **临时权限**: 支持时间限制的权限授予
5. **权限委托**: 支持用户间权限委托

---

## 12. 测试要点

### 单元测试
- [ ] 管理员拥有所有权限
- [ ] 普通用户拥有正确的权限
- [ ] 普通用户无法访问敏感模块
- [ ] 普通用户无法访问他人创建的服务器
- [ ] require_admin正确拒绝普通用户
- [ ] require_permission正确拒绝无权限操作
- [ ] 装饰器正确工作

### 集成测试
- [ ] API端点权限控制生效
- [ ] 权限不足返回403错误
- [ ] 审计日志记录权限检查

---

**文档结束**
