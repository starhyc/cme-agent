# 后端执行计划 - 模块01：认证授权模块

**模块名称**: 认证授权模块 (Authentication & Authorization)
**优先级**: P0 - 必须首先实现
**依赖**: 无
**预计工作量**: 基础模块
**负责人**: Backend Developer

---

## 1. 模块概述

实现用户认证、授权、会话管理功能，为整个系统提供安全基础。

### 核心功能
- 用户登录/登出
- JWT Token生成和验证
- 密码哈希和验证
- 会话管理
- 权限控制（RBAC）
- 审计日志记录

---

## 2. 实现文件清单

### 2.1 数据模型
- `app/auth/models.py`
  - User模型
  - Session模型

### 2.2 核心服务
- `app/auth/service.py` - 认证服务主类
- `app/auth/jwt_handler.py` - JWT处理
- `app/auth/password_hasher.py` - 密码哈希
- `app/auth/permission_checker.py` - 权限检查

### 2.3 数据访问层
- `app/auth/repository.py` - 用户数据访问

### 2.4 API路由
- `app/auth/router.py` - 认证相关API端点

### 2.5 中间件
- `app/auth/middleware.py` - 认证中间件

---

## 3. 详细任务列表

### 任务3.1: 创建数据模型
**文件**: `app/auth/models.py`

**实现内容**:
```python
# User模型
class User(Base):
    id: int
    username: str
    password_hash: str
    role: str  # admin/user
    created_at: datetime
    updated_at: datetime

# Session模型（Redis存储）
class Session:
    session_id: str
    user_id: int
    expires_at: datetime
```

**验收标准**:
- [ ] User模型包含所有必需字段
- [ ] 字段类型正确
- [ ] 包含索引定义

---

### 任务3.2: 实现密码哈希
**文件**: `app/auth/password_hasher.py`

**实现内容**:
```python
class PasswordHasher:
    def hash_password(password: str) -> str:
        """使用bcrypt哈希密码"""
        pass

    def verify_password(password: str, hash: str) -> bool:
        """验证密码"""
        pass
```

**依赖**:
- bcrypt库

**验收标准**:
- [ ] 使用bcrypt算法，cost=12
- [ ] hash_password返回正确的哈希值
- [ ] verify_password正确验证密码
- [ ] 包含错误处理

---

### 任务3.3: 实现JWT处理
**文件**: `app/auth/jwt_handler.py`

**实现内容**:
```python
class JWTHandler:
    def create_access_token(user_id: int, role: str) -> str:
        """生成访问token，有效期30分钟"""
        pass

    def create_refresh_token(user_id: int) -> str:
        """生成刷新token，有效期7天"""
        pass

    def verify_token(token: str) -> Dict[str, Any]:
        """验证token并返回payload"""
        pass
```

**依赖**:
- PyJWT库

**验收标准**:
- [ ] 使用HS256算法
- [ ] access_token有效期30分钟
- [ ] refresh_token有效期7天
- [ ] 包含用户ID和角色信息
- [ ] 正确处理过期和无效token

---

### 任务3.4: 实现用户仓库
**文件**: `app/auth/repository.py`

**实现内容**:
```python
class UserRepository:
    async def create_user(username: str, password_hash: str, role: str) -> User:
        """创建用户"""
        pass

    async def get_user_by_username(username: str) -> Optional[User]:
        """根据用户名查询用户"""
        pass

    async def get_user_by_id(user_id: int) -> Optional[User]:
        """根据ID查询用户"""
        pass

    async def list_users(page: int, page_size: int) -> List[User]:
        """分页查询用户列表"""
        pass
```

**依赖**:
- SQLAlchemy
- PostgreSQL连接

**验收标准**:
- [ ] 所有方法使用async/await
- [ ] 正确处理数据库异常
- [ ] 包含事务管理
- [ ] 记录操作日志

---

### 任务3.5: 实现认证服务
**文件**: `app/auth/service.py`

**实现内容**:
```python
class AuthService:
    async def login(username: str, password: str) -> Dict[str, Any]:
        """
        用户登录
        返回: {token, refresh_token, user_info}
        """
        pass

    async def logout(session_id: str) -> None:
        """用户登出，清除会话"""
        pass

    async def refresh_token(refresh_token: str) -> str:
        """刷新访问token"""
        pass

    async def verify_session(session_id: str) -> Optional[User]:
        """验证会话有效性"""
        pass
```

**依赖**:
- UserRepository
- PasswordHasher
- JWTHandler
- Redis客户端

**业务逻辑**:
1. **login**:
   - 查询用户
   - 验证密码
   - 生成token
   - 创建会话（Redis）
   - 记录审计日志

2. **logout**:
   - 删除Redis会话
   - 记录审计日志

3. **refresh_token**:
   - 验证refresh_token
   - 生成新的access_token
   - 更新会话过期时间

**验收标准**:
- [ ] 登录成功返回token和用户信息
- [ ] 密码错误返回明确错误
- [ ] 用户不存在返回明确错误
- [ ] 会话存储在Redis，TTL=30分钟
- [ ] 所有操作记录审计日志

---

### 任务3.6: 实现权限检查
**文件**: `app/auth/permission_checker.py`

**实现内容**:
```python
class PermissionChecker:
    def check_permission(user: User, resource: str, action: str) -> bool:
        """
        检查用户权限
        resource: 资源类型（ticket/server/code等）
        action: 操作类型（read/write/delete）
        """
        pass

    def require_admin(user: User) -> None:
        """要求管理员权限，否则抛出异常"""
        pass
```

**权限规则**:
- admin: 所有权限
- user: 读取权限，无配置权限

**验收标准**:
- [ ] 正确实现RBAC逻辑
- [ ] 权限不足时抛出PermissionDenied异常
- [ ] 包含详细的权限检查日志

---

### 任务3.7: 实现认证中间件
**文件**: `app/auth/middleware.py`

**实现内容**:
```python
class AuthMiddleware:
    async def __call__(request: Request, call_next):
        """
        从请求头提取token
        验证token
        将用户信息注入request.state
        """
        pass
```

**验收标准**:
- [ ] 从Authorization头提取Bearer token
- [ ] 验证token有效性
- [ ] 将用户信息存入request.state.user
- [ ] token无效时返回401
- [ ] 公开端点（/health, /login）跳过验证

---

### 任务3.8: 实现API路由
**文件**: `app/auth/router.py`

**实现内容**:
```python
router = APIRouter(prefix="/api/v1/auth")

@router.post("/login")
async def login(request: LoginRequest) -> LoginResponse:
    """用户登录"""
    pass

@router.post("/logout")
async def logout(request: Request) -> SuccessResponse:
    """用户登出"""
    pass

@router.post("/refresh")
async def refresh_token(request: RefreshRequest) -> TokenResponse:
    """刷新token"""
    pass
```

**验收标准**:
- [ ] 所有端点符合API规范
- [ ] 请求参数验证（Pydantic）
- [ ] 统一错误处理
- [ ] 返回格式符合规范

---

### 任务3.9: 实现审计日志
**文件**: `app/auth/audit_logger.py`

**实现内容**:
```python
class AuditLogger:
    async def log_login(user_id: int, ip_address: str, success: bool):
        """记录登录日志"""
        pass

    async def log_action(
        user_id: int,
        action: str,
        resource_type: str,
        resource_id: str,
        details: Dict
    ):
        """记录操作日志"""
        pass
```

**验收标准**:
- [ ] 日志写入PostgreSQL audit_logs表
- [ ] 包含所有必需字段
- [ ] 异步写入，不阻塞主流程

---

## 4. 数据库迁移

### 迁移脚本
```sql
-- 创建users表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建审计日志表
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
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- 插入默认管理员用户
INSERT INTO users (username, password_hash, role)
VALUES ('admin', '$2b$12$...', 'admin');
```

---

## 5. 配置项

```python
# config.py
AUTH_CONFIG = {
    "jwt_secret": "your-secret-key",
    "jwt_algorithm": "HS256",
    "access_token_expire_minutes": 30,
    "refresh_token_expire_days": 7,
    "bcrypt_rounds": 12,
    "session_expire_seconds": 1800
}
```

---

## 6. 测试要点

### 单元测试
- [ ] 密码哈希和验证
- [ ] JWT生成和验证
- [ ] 权限检查逻辑

### 集成测试
- [ ] 登录成功流程
- [ ] 登录失败（密码错误）
- [ ] 登录失败（用户不存在）
- [ ] Token刷新
- [ ] 登出
- [ ] 权限验证

### 安全测试
- [ ] SQL注入防护
- [ ] 密码强度要求
- [ ] Token过期处理
- [ ] 并发登录处理

---

## 7. 依赖模块

### 外部依赖
- bcrypt
- PyJWT
- SQLAlchemy
- Redis

### 内部依赖
- app.common.logger
- app.common.config
- app.common.database

---

## 8. 实现顺序

1. 数据模型 → 2. 密码哈希 → 3. JWT处理 → 4. 用户仓库 → 5. 认证服务 → 6. 权限检查 → 7. 中间件 → 8. API路由 → 9. 审计日志

---

## 9. 完成标准

- [ ] 所有任务完成
- [ ] 所有测试通过
- [ ] 代码审查通过
- [ ] 文档完整
- [ ] 符合安全规范

---

**文档结束**
