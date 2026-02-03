# 后端执行计划 - 模块03：工单管理模块

**模块名称**: 工单管理模块 (Ticket Management)
**优先级**: P0 - 基础模块
**依赖**: 认证授权模块
**预计工作量**: 小
**负责人**: Backend Developer

---

## 1. 模块概述

实现工单的创建、查询、更新功能，为问题诊断提供基础数据管理。

### 核心功能
- 创建工单
- 查询工单列表（分页、筛选）
- 获取工单详情
- 更新工单状态

---

## 2. 实现文件清单

- `app/ticket/models.py` - 数据模型
- `app/ticket/repository.py` - 数据访问层
- `app/ticket/service.py` - 业务逻辑层
- `app/ticket/router.py` - API路由
- `app/ticket/schemas.py` - Pydantic模型

---

## 3. 详细任务列表

### 任务3.1: 创建数据模型
**文件**: `app/ticket/models.py`

**实现内容**:
```python
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from app.common.database import Base

class Ticket(Base):
    """工单模型"""
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True)
    ticket_id = Column(String(100), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(String(20), nullable=False, default="pending")  # pending/analyzing/completed
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, server_default="CURRENT_TIMESTAMP")
    updated_at = Column(DateTime, server_default="CURRENT_TIMESTAMP", onupdate="CURRENT_TIMESTAMP")
```

**验收标准**:
- [ ] 字段定义完整
- [ ] 索引设置合理
- [ ] 外键关系正确

---

### 任务3.2: 创建Pydantic模型
**文件**: `app/ticket/schemas.py`

**实现内容**:
```python
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class TicketCreate(BaseModel):
    """创建工单请求"""
    ticket_id: str = Field(..., max_length=100)
    title: str = Field(..., max_length=255)
    description: Optional[str] = None

class TicketUpdate(BaseModel):
    """更新工单请求"""
    status: Optional[str] = Field(None, pattern="^(pending|analyzing|completed)$")
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None

class TicketResponse(BaseModel):
    """工单响应"""
    id: int
    ticket_id: str
    title: str
    description: Optional[str]
    status: str
    created_by: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
```

**验收标准**:
- [ ] 请求模型包含验证规则
- [ ] 响应模型字段完整
- [ ] 支持ORM模型转换

---

### 任务3.3: 实现数据访问层
**文件**: `app/ticket/repository.py`

**实现内容**:
```python
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional, Tuple
from app.ticket.models import Ticket

class TicketRepository:
    """工单数据访问层"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, ticket: Ticket) -> Ticket:
        """创建工单"""
        self.db.add(ticket)
        await self.db.commit()
        await self.db.refresh(ticket)
        return ticket

    async def get_by_id(self, ticket_id: int) -> Optional[Ticket]:
        """根据ID查询工单"""
        result = await self.db.execute(
            select(Ticket).where(Ticket.id == ticket_id)
        )
        return result.scalar_one_or_none()

    async def get_by_ticket_id(self, ticket_id: str) -> Optional[Ticket]:
        """根据ticket_id查询工单"""
        result = await self.db.execute(
            select(Ticket).where(Ticket.ticket_id == ticket_id)
        )
        return result.scalar_one_or_none()

    async def list(
        self,
        page: int,
        page_size: int,
        status: Optional[str] = None,
        created_by: Optional[int] = None
    ) -> Tuple[List[Ticket], int]:
        """分页查询工单列表"""
        query = select(Ticket)

        # 筛选条件
        if status:
            query = query.where(Ticket.status == status)
        if created_by:
            query = query.where(Ticket.created_by == created_by)

        # 总数查询
        count_query = select(func.count()).select_from(query.subquery())
        total = await self.db.scalar(count_query)

        # 分页查询
        query = query.offset((page - 1) * page_size).limit(page_size)
        query = query.order_by(Ticket.created_at.desc())
        result = await self.db.execute(query)
        tickets = result.scalars().all()

        return list(tickets), total

    async def update(self, ticket: Ticket) -> Ticket:
        """更新工单"""
        await self.db.commit()
        await self.db.refresh(ticket)
        return ticket
```

**验收标准**:
- [ ] 所有方法使用async/await
- [ ] 支持分页和筛选
- [ ] 正确处理数据库异常
- [ ] 返回类型明确

---

### 任务3.4: 实现业务逻辑层
**文件**: `app/ticket/service.py`

**实现内容**:
```python
from typing import List, Tuple
from app.ticket.repository import TicketRepository
from app.ticket.models import Ticket
from app.ticket.schemas import TicketCreate, TicketUpdate
from app.common.exceptions import NotFoundException, DuplicateException

class TicketService:
    """工单业务逻辑层"""

    def __init__(self, repository: TicketRepository):
        self.repository = repository

    async def create_ticket(
        self,
        ticket_data: TicketCreate,
        user_id: int
    ) -> Ticket:
        """
        创建工单

        业务逻辑:
        1. 检查ticket_id是否已存在
        2. 创建工单记录
        3. 记录审计日志
        """
        # 检查重复
        existing = await self.repository.get_by_ticket_id(ticket_data.ticket_id)
        if existing:
            raise DuplicateException(f"工单ID {ticket_data.ticket_id} 已存在")

        # 创建工单
        ticket = Ticket(
            ticket_id=ticket_data.ticket_id,
            title=ticket_data.title,
            description=ticket_data.description,
            status="pending",
            created_by=user_id
        )

        return await self.repository.create(ticket)

    async def get_ticket(self, ticket_id: int) -> Ticket:
        """获取工单详情"""
        ticket = await self.repository.get_by_id(ticket_id)
        if not ticket:
            raise NotFoundException(f"工单 {ticket_id} 不存在")
        return ticket

    async def list_tickets(
        self,
        page: int = 1,
        page_size: int = 20,
        status: str = None,
        user_id: int = None
    ) -> Tuple[List[Ticket], int]:
        """查询工单列表"""
        return await self.repository.list(page, page_size, status, user_id)

    async def update_ticket(
        self,
        ticket_id: int,
        update_data: TicketUpdate
    ) -> Ticket:
        """更新工单"""
        ticket = await self.get_ticket(ticket_id)

        # 更新字段
        if update_data.status:
            ticket.status = update_data.status
        if update_data.title:
            ticket.title = update_data.title
        if update_data.description is not None:
            ticket.description = update_data.description

        return await self.repository.update(ticket)
```

**验收标准**:
- [ ] 创建时检查重复
- [ ] 不存在时抛出异常
- [ ] 支持部分字段更新
- [ ] 业务逻辑清晰

---

### 任务3.5: 实现API路由
**文件**: `app/ticket/router.py`

**实现内容**:
```python
from fastapi import APIRouter, Depends, status
from typing import List
from app.ticket.service import TicketService
from app.ticket.schemas import TicketCreate, TicketUpdate, TicketResponse
from app.auth.dependencies import get_current_user
from app.common.response import success_response, paginated_response

router = APIRouter(prefix="/api/v1/tickets", tags=["tickets"])

@router.post("", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
async def create_ticket(
    ticket_data: TicketCreate,
    current_user = Depends(get_current_user),
    service: TicketService = Depends()
):
    """创建工单"""
    ticket = await service.create_ticket(ticket_data, current_user.id)
    return success_response(data=ticket)

@router.get("", response_model=dict)
async def list_tickets(
    page: int = 1,
    page_size: int = 20,
    status: str = None,
    current_user = Depends(get_current_user),
    service: TicketService = Depends()
):
    """查询工单列表"""
    tickets, total = await service.list_tickets(page, page_size, status)
    return paginated_response(
        items=tickets,
        total=total,
        page=page,
        page_size=page_size
    )

@router.get("/{ticket_id}", response_model=TicketResponse)
async def get_ticket(
    ticket_id: int,
    current_user = Depends(get_current_user),
    service: TicketService = Depends()
):
    """获取工单详情"""
    ticket = await service.get_ticket(ticket_id)
    return success_response(data=ticket)

@router.patch("/{ticket_id}", response_model=TicketResponse)
async def update_ticket(
    ticket_id: int,
    update_data: TicketUpdate,
    current_user = Depends(get_current_user),
    service: TicketService = Depends()
):
    """更新工单"""
    ticket = await service.update_ticket(ticket_id, update_data)
    return success_response(data=ticket)
```

**验收标准**:
- [ ] 所有端点需要认证
- [ ] 请求参数验证
- [ ] 响应格式统一
- [ ] 错误处理完整

---

## 4. 数据库迁移

```sql
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tickets_ticket_id ON tickets(ticket_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_created_by ON tickets(created_by);
```

---

## 5. 依赖注入配置

```python
# app/ticket/dependencies.py
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.common.database import get_db
from app.ticket.repository import TicketRepository
from app.ticket.service import TicketService

def get_ticket_repository(db: AsyncSession = Depends(get_db)) -> TicketRepository:
    return TicketRepository(db)

def get_ticket_service(
    repository: TicketRepository = Depends(get_ticket_repository)
) -> TicketService:
    return TicketService(repository)
```

---

## 6. 测试要点

### 单元测试
- [ ] Repository CRUD操作
- [ ] Service业务逻辑
- [ ] 重复ticket_id检查

### 集成测试
- [ ] 创建工单流程
- [ ] 查询工单列表
- [ ] 更新工单状态
- [ ] 分页功能

---

## 7. 实现顺序

1. 数据模型 → 2. Pydantic模型 → 3. Repository → 4. Service → 5. Router

---

## 8. 完成标准

- [ ] 所有任务完成
- [ ] 所有测试通过
- [ ] API符合规范
- [ ] 代码审查通过

---

**文档结束**
