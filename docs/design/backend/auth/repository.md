# 用户仓库详细设计

**文件路径**: `backend/app/auth/repository.py`
**模块**: 认证授权模块
**作者**: Architect
**版本**: 1.0

---

## 1. 类概述

### 职责
提供用户数据的CRUD操作，封装数据库访问逻辑。

### 依赖
- `sqlalchemy`: ORM框架
- `app.auth.models.User`: 用户模型
- `app.common.database`: 数据库连接
- `app.common.logger`: 日志记录

---

## 2. 类定义

```python
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete

class UserRepository:
    """
    用户数据仓库

    提供用户数据的增删改查操作，封装所有数据库访问逻辑。
    """

    def __init__(self, session: AsyncSession):
        """
        初始化用户仓库

        Args:
            session: SQLAlchemy异步会话
        """
        pass
```

---

## 3. 属性列表

| 属性名 | 类型 | 说明 |
|--------|------|------|
| session | AsyncSession | 数据库会话 |
| logger | Logger | 日志记录器 |

---

## 4. 方法列表

### 4.1 create_user

```python
async def create_user(
    self,
    username: str,
    password_hash: str,
    role: str = "user"
) -> User:
    """
    创建用户

    Args:
        username: 用户名
        password_hash: 密码哈希
        role: 角色（admin/user）

    Returns:
        User: 创建的用户对象

    Raises:
        UserAlreadyExistsError: 用户名已存在
        DatabaseError: 数据库操作失败

    业务逻辑:
        1. 检查用户名是否已存在
        2. 创建User对象
        3. 添加到session
        4. 提交事务
        5. 刷新对象获取ID
        6. 记录创建日志
        7. 返回用户对象
    """
    pass
```

### 4.2 get_user_by_id

```python
async def get_user_by_id(
    self,
    user_id: int
) -> Optional[User]:
    """
    根据ID查询用户

    Args:
        user_id: 用户ID

    Returns:
        Optional[User]: 用户对象，不存在返回None

    业务逻辑:
        1. 构建查询语句
        2. 执行查询
        3. 返回结果
    """
    pass
```

### 4.3 get_user_by_username

```python
async def get_user_by_username(
    self,
    username: str
) -> Optional[User]:
    """
    根据用户名查询用户

    Args:
        username: 用户名

    Returns:
        Optional[User]: 用户对象，不存在返回None

    业务逻辑:
        1. 构建查询语句（WHERE username = ?）
        2. 执行查询
        3. 返回结果
    """
    pass
```

### 4.4 list_users

```python
async def list_users(
    self,
    page: int = 1,
    page_size: int = 20,
    role: Optional[str] = None
) -> tuple[List[User], int]:
    """
    分页查询用户列表

    Args:
        page: 页码（从1开始）
        page_size: 每页数量
        role: 角色筛选（可选）

    Returns:
        tuple[List[User], int]: (用户列表, 总数)

    业务逻辑:
        1. 构建查询语句
        2. 如果提供role，添加WHERE条件
        3. 查询总数
        4. 添加分页（LIMIT, OFFSET）
        5. 执行查询
        6. 返回结果和总数
    """
    pass
```

### 4.5 update_user

```python
async def update_user(
    self,
    user_id: int,
    **kwargs
) -> Optional[User]:
    """
    更新用户信息

    Args:
        user_id: 用户ID
        **kwargs: 要更新的字段

    Returns:
        Optional[User]: 更新后的用户对象，不存在返回None

    Raises:
        DatabaseError: 数据库操作失败

    业务逻辑:
        1. 查询用户是否存在
        2. 更新字段
        3. 更新updated_at字段
        4. 提交事务
        5. 记录更新日志
        6. 返回用户对象
    """
    pass
```

### 4.6 update_password

```python
async def update_password(
    self,
    user_id: int,
    new_password_hash: str
) -> None:
    """
    更新用户密码

    Args:
        user_id: 用户ID
        new_password_hash: 新密码哈希

    Returns:
        None

    Raises:
        UserNotFoundError: 用户不存在
        DatabaseError: 数据库操作失败

    业务逻辑:
        1. 构建UPDATE语句
        2. 更新password_hash和updated_at
        3. 提交事务
        4. 记录密码更新日志
    """
    pass
```

### 4.7 delete_user

```python
async def delete_user(
    self,
    user_id: int
) -> bool:
    """
    删除用户

    Args:
        user_id: 用户ID

    Returns:
        bool: True表示删除成功，False表示用户不存在

    Raises:
        DatabaseError: 数据库操作失败

    业务逻辑:
        1. 构建DELETE语句
        2. 执行删除
        3. 提交事务
        4. 记录删除日志
        5. 返回是否成功
    """
    pass
```

### 4.8 user_exists

```python
async def user_exists(
    self,
    username: str
) -> bool:
    """
    检查用户名是否存在

    Args:
        username: 用户名

    Returns:
        bool: True表示存在

    业务逻辑:
        1. 构建COUNT查询
        2. 执行查询
        3. 返回count > 0
    """
    pass
```

---

## 5. 异常定义

```python
class UserAlreadyExistsError(Exception):
    """用户已存在异常"""
    pass

class UserNotFoundError(Exception):
    """用户不存在异常"""
    pass

class DatabaseError(Exception):
    """数据库操作失败异常"""
    pass
```

---

## 6. 使用示例

```python
# 初始化仓库
async with get_db_session() as session:
    user_repo = UserRepository(session)

    # 创建用户
    user = await user_repo.create_user(
        username="john",
        password_hash="$2b$12$...",
        role="user"
    )
    print(f"创建用户: {user.username}")

    # 查询用户
    user = await user_repo.get_user_by_username("john")
    if user:
        print(f"找到用户: {user.id}")

    # 更新用户
    updated_user = await user_repo.update_user(
        user_id=user.id,
        role="admin"
    )

    # 分页查询
    users, total = await user_repo.list_users(page=1, page_size=10)
    print(f"共 {total} 个用户")

    # 更新密码
    await user_repo.update_password(
        user_id=user.id,
        new_password_hash="$2b$12$new..."
    )

    # 删除用户
    success = await user_repo.delete_user(user.id)
```

---

## 7. 依赖关系

### 依赖的模块
- `sqlalchemy.ext.asyncio`: 异步ORM
- `app.auth.models.User`: 用户模型
- `app.common.database`: 数据库连接
- `app.common.logger`: 日志记录

### 被依赖的模块
- `app.auth.service.AuthService`: 认证服务
- `app.auth.router`: API路由

---

## 8. 数据库表结构

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
```

---

## 9. 性能优化

1. **索引优化**: username字段添加唯一索引，加速查询
2. **批量操作**: 支持批量创建和更新（未来扩展）
3. **连接池**: 使用SQLAlchemy连接池管理数据库连接
4. **查询优化**: 只查询需要的字段，避免SELECT *
5. **事务管理**: 合理使用事务，避免长事务

---

## 10. 测试要点

### 单元测试
- [ ] 创建用户成功
- [ ] 创建重复用户名失败
- [ ] 根据ID查询用户
- [ ] 根据用户名查询用户
- [ ] 分页查询用户列表
- [ ] 更新用户信息
- [ ] 更新密码
- [ ] 删除用户
- [ ] 检查用户是否存在

### 集成测试
- [ ] 事务回滚测试
- [ ] 并发创建用户测试
- [ ] 数据库连接失败处理

---

**文档结束**
