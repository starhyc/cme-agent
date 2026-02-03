# 工单服务详细设计

**文件路径**: `backend/app/ticket/service.py`
**模块**: 工单管理模块
**作者**: Architect
**版本**: 1.0

---

## 1. 类概述

### 职责
提供工单的创建、查询、更新、删除等业务逻辑，协调工单数据访问和状态管理。

### 依赖
- `app.ticket.repository.TicketRepository`: 工单数据访问
- `app.auth.models.User`: 用户模型
- `app.common.logger`: 日志记录

---

## 2. 类定义

```python
from typing import Optional, List, Dict, Any
from datetime import datetime

class TicketService:
    """
    工单服务类
    
    提供工单的完整业务逻辑，包括创建、查询、更新、删除和状态管理。
    """

    def __init__(
        self,
        ticket_repository: TicketRepository
    ):
        """
        初始化工单服务

        Args:
            ticket_repository: 工单数据仓库
        """
        pass
```

---

## 3. 属性列表

| 属性名 | 类型 | 说明 |
|--------|------|------|
| ticket_repository | TicketRepository | 工单数据仓库 |
| logger | Logger | 日志记录器 |

---

## 4. 方法列表

### 4.1 create_ticket

```python
async def create_ticket(
    self,
    ticket_id: str,
    title: str,
    description: str,
    created_by: int
) -> Dict[str, Any]:
    """
    创建工单

    Args:
        ticket_id: 工单ID（如TICKET-2026-001）
        title: 工单标题
        description: 工单描述
        created_by: 创建人用户ID

    Returns:
        Dict[str, Any]: 工单信息

    Raises:
        TicketAlreadyExistsError: 工单ID已存在
        ValidationError: 参数验证失败

    业务逻辑:
        1. 验证ticket_id格式
        2. 验证title和description不为空
        3. 检查ticket_id是否已存在
        4. 创建工单记录（状态为pending）
        5. 记录操作日志
        6. 返回工单信息
    """
    pass
```

### 4.2 get_ticket

```python
async def get_ticket(
    self,
    ticket_id: str,
    user: User
) -> Optional[Dict[str, Any]]:
    """
    获取工单详情

    Args:
        ticket_id: 工单ID
        user: 当前用户

    Returns:
        Optional[Dict[str, Any]]: 工单详情，包含：
            - 基本信息
            - 关联的日志文件列表
            - 分析结果
            - 报告列表

    Raises:
        PermissionDeniedError: 无权限访问

    业务逻辑:
        1. 查询工单基本信息
        2. 检查用户权限
        3. 查询关联的日志文件
        4. 查询分析结果
        5. 查询报告列表
        6. 组装返回数据
    """
    pass
```

### 4.3 list_tickets

```python
async def list_tickets(
    self,
    user: User,
    status: Optional[str] = None,
    page: int = 1,
    page_size: int = 20
) -> tuple[List[Dict[str, Any]], int]:
    """
    分页查询工单列表

    Args:
        user: 当前用户
        status: 状态筛选（pending/analyzing/completed）
        page: 页码
        page_size: 每页数量

    Returns:
        tuple[List[Dict[str, Any]], int]: (工单列表, 总数)

    业务逻辑:
        1. 根据用户角色构建查询条件
        2. 普通用户只能看到自己创建的工单
        3. 管理员可以看到所有工单
        4. 应用状态筛选
        5. 分页查询
        6. 返回结果
    """
    pass
```

### 4.4 update_ticket_status

```python
async def update_ticket_status(
    self,
    ticket_id: str,
    status: str,
    user: User
) -> Dict[str, Any]:
    """
    更新工单状态

    Args:
        ticket_id: 工单ID
        status: 新状态（pending/analyzing/completed）
        user: 当前用户

    Returns:
        Dict[str, Any]: 更新后的工单信息

    Raises:
        TicketNotFoundError: 工单不存在
        InvalidStatusError: 状态无效
        PermissionDeniedError: 无权限

    业务逻辑:
        1. 验证状态值有效性
        2. 查询工单
        3. 检查权限
        4. 验证状态转换合法性
        5. 更新状态和updated_at
        6. 记录操作日志
        7. 返回更新后的工单
    """
    pass
```

### 4.5 delete_ticket

```python
async def delete_ticket(
    self,
    ticket_id: str,
    user: User
) -> None:
    """
    删除工单

    Args:
        ticket_id: 工单ID
        user: 当前用户

    Returns:
        None

    Raises:
        TicketNotFoundError: 工单不存在
        PermissionDeniedError: 无权限

    业务逻辑:
        1. 查询工单
        2. 检查权限（只有管理员或创建人可以删除）
        3. 删除关联的日志文件
        4. 删除分析结果
        5. 删除报告
        6. 删除工单记录
        7. 记录操作日志
    """
    pass
```

### 4.6 get_ticket_statistics

```python
async def get_ticket_statistics(
    self,
    user: User
) -> Dict[str, Any]:
    """
    获取工单统计信息

    Args:
        user: 当前用户

    Returns:
        Dict[str, Any]: 统计信息
            - total: 总数
            - pending: 待处理数
            - analyzing: 分析中数
            - completed: 已完成数

    业务逻辑:
        1. 根据用户角色构建查询条件
        2. 统计各状态的工单数量
        3. 返回统计结果
    """
    pass
```

---

## 5. 状态转换规则

```python
# 允许的状态转换
STATUS_TRANSITIONS = {
    "pending": ["analyzing"],
    "analyzing": ["completed", "pending"],
    "completed": ["pending"]  # 允许重新分析
}

def is_valid_status_transition(
    current_status: str,
    new_status: str
) -> bool:
    """检查状态转换是否合法"""
    if current_status == new_status:
        return True
    return new_status in STATUS_TRANSITIONS.get(current_status, [])
```

---

## 6. 异常定义

```python
class TicketAlreadyExistsError(Exception):
    """工单已存在异常"""
    pass

class TicketNotFoundError(Exception):
    """工单不存在异常"""
    pass

class InvalidStatusError(Exception):
    """无效状态异常"""
    pass

class ValidationError(Exception):
    """参数验证失败异常"""
    pass
```

---

## 7. 使用示例

```python
# 初始化服务
ticket_service = TicketService(ticket_repository)

# 创建工单
ticket = await ticket_service.create_ticket(
    ticket_id="TICKET-2026-001",
    title="订单服务异常",
    description="用户反馈订单无法提交",
    created_by=1
)

# 获取工单详情
ticket_detail = await ticket_service.get_ticket(
    ticket_id="TICKET-2026-001",
    user=current_user
)

# 查询工单列表
tickets, total = await ticket_service.list_tickets(
    user=current_user,
    status="pending",
    page=1,
    page_size=20
)

# 更新工单状态
updated_ticket = await ticket_service.update_ticket_status(
    ticket_id="TICKET-2026-001",
    status="analyzing",
    user=current_user
)

# 获取统计信息
stats = await ticket_service.get_ticket_statistics(user=current_user)
print(f"总工单数: {stats['total']}")

# 删除工单
await ticket_service.delete_ticket(
    ticket_id="TICKET-2026-001",
    user=admin_user
)
```

---

## 8. 依赖关系

### 依赖的模块
- `app.ticket.repository.TicketRepository`: 工单数据访问
- `app.auth.models.User`: 用户模型
- `app.common.logger`: 日志记录

### 被依赖的模块
- `app.ticket.router`: API路由层
- `app.log_collector.service`: 日志收集服务
- `app.log_analyzer.service`: 日志分析服务

---

## 9. 配置项

```python
# config.py
TICKET_CONFIG = {
    "ticket_id_pattern": r"^TICKET-\d{4}-\d{3}$",
    "title_max_length": 255,
    "description_max_length": 5000,
    "default_page_size": 20,
    "max_page_size": 100
}
```

---

## 10. 性能优化

1. **分页查询**: 避免一次性加载大量数据
2. **索引优化**: ticket_id、status、created_by字段添加索引
3. **缓存**: 工单统计信息可以缓存（短时间）
4. **异步操作**: 所有数据库操作使用async/await

---

## 11. 测试要点

### 单元测试
- [ ] 创建工单成功
- [ ] 创建重复工单失败
- [ ] 获取工单详情
- [ ] 分页查询工单列表
- [ ] 状态筛选正确
- [ ] 权限控制生效
- [ ] 更新工单状态
- [ ] 非法状态转换失败
- [ ] 删除工单
- [ ] 获取统计信息

### 集成测试
- [ ] 完整工单生命周期
- [ ] 多用户权限隔离
- [ ] 并发创建工单

---

**文档结束**
