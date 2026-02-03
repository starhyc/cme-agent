# 认证中间件详细设计

**文件路径**: `backend/app/auth/middleware.py`
**模块**: 认证授权模块
**作者**: Architect
**版本**: 1.0

---

## 1. 类概述

### 职责
拦截HTTP请求，验证JWT Token，将用户信息注入到请求上下文中。

### 依赖
- `fastapi`: Web框架
- `app.auth.jwt_handler.JWTHandler`: JWT处理
- `app.auth.service.AuthService`: 认证服务
- `app.common.logger`: 日志记录

---

## 2. 类定义

```python
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Callable

class AuthMiddleware(BaseHTTPMiddleware):
    """
    认证中间件

    拦截所有HTTP请求，验证JWT Token，将用户信息注入到request.state中。
    """

    def __init__(
        self,
        app,
        jwt_handler: JWTHandler,
        auth_service: AuthService,
        exclude_paths: List[str] = None
    ):
        """
        初始化认证中间件

        Args:
            app: FastAPI应用实例
            jwt_handler: JWT处理器
            auth_service: 认证服务
            exclude_paths: 不需要认证的路径列表
        """
        super().__init__(app)
        self.jwt_handler = jwt_handler
        self.auth_service = auth_service
        self.exclude_paths = exclude_paths or [
            "/api/v1/auth/login",
            "/api/v1/health",
            "/docs",
            "/openapi.json"
        ]
```

---

## 3. 属性列表

| 属性名 | 类型 | 说明 |
|--------|------|------|
| jwt_handler | JWTHandler | JWT处理器 |
| auth_service | AuthService | 认证服务 |
| exclude_paths | List[str] | 不需要认证的路径列表 |
| logger | Logger | 日志记录器 |

---

## 4. 方法列表

### 4.1 dispatch

```python
async def dispatch(
    self,
    request: Request,
    call_next: Callable
) -> Response:
    """
    处理HTTP请求

    Args:
        request: HTTP请求对象
        call_next: 下一个中间件或路由处理器

    Returns:
        Response: HTTP响应

    业务逻辑:
        1. 检查请求路径是否在exclude_paths中
        2. 如果在，直接调用call_next
        3. 从请求头提取Authorization
        4. 验证Token格式（Bearer {token}）
        5. 验证Token有效性
        6. 获取用户信息
        7. 将用户信息注入到request.state.user
        8. 调用call_next
        9. 如果Token无效，返回401错误
        10. 记录认证日志
    """
    pass
```

### 4.2 _extract_token

```python
def _extract_token(
    self,
    request: Request
) -> Optional[str]:
    """
    从请求头提取Token（私有方法）

    Args:
        request: HTTP请求对象

    Returns:
        Optional[str]: Token字符串，如果不存在返回None

    业务逻辑:
        1. 获取Authorization头
        2. 检查格式是否为"Bearer {token}"
        3. 提取token部分
        4. 返回token
    """
    pass
```

### 4.3 _is_excluded_path

```python
def _is_excluded_path(
    self,
    path: str
) -> bool:
    """
    检查路径是否需要跳过认证（私有方法）

    Args:
        path: 请求路径

    Returns:
        bool: True表示跳过认证

    业务逻辑:
        1. 遍历exclude_paths
        2. 支持通配符匹配（如/api/v1/public/*）
        3. 返回是否匹配
    """
    pass
```

---

## 5. 依赖注入支持

```python
from fastapi import Depends, Request

async def get_current_user(request: Request) -> User:
    """
    依赖注入函数：获取当前用户

    用法:
        @router.get("/tickets")
        async def list_tickets(user: User = Depends(get_current_user)):
            pass

    Args:
        request: HTTP请求对象

    Returns:
        User: 当前用户对象

    Raises:
        HTTPException: 401 未认证
    """
    if not hasattr(request.state, "user"):
        raise HTTPException(
            status_code=401,
            detail="未认证"
        )
    return request.state.user

async def get_current_admin(user: User = Depends(get_current_user)) -> User:
    """
    依赖注入函数：要求管理员权限

    用法:
        @router.delete("/users/{user_id}")
        async def delete_user(
            user_id: int,
            admin: User = Depends(get_current_admin)
        ):
            pass

    Args:
        user: 当前用户（通过get_current_user注入）

    Returns:
        User: 管理员用户对象

    Raises:
        HTTPException: 403 权限不足
    """
    if user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="需要管理员权限"
        )
    return user
```

---

## 6. 异常处理

```python
from fastapi import status
from fastapi.responses import JSONResponse

async def auth_exception_handler(request: Request, exc: Exception):
    """
    认证异常处理器

    Args:
        request: HTTP请求
        exc: 异常对象

    Returns:
        JSONResponse: 错误响应
    """
    if isinstance(exc, InvalidTokenError):
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={
                "success": False,
                "error": {
                    "code": "AUTH_INVALID",
                    "message": "Token无效或已过期"
                }
            }
        )
    elif isinstance(exc, PermissionDeniedError):
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={
                "success": False,
                "error": {
                    "code": "PERMISSION_DENIED",
                    "message": "权限不足"
                }
            }
        )
    # 其他异常...
```

---

## 7. 使用示例

```python
from fastapi import FastAPI
from app.auth.middleware import AuthMiddleware

# 创建FastAPI应用
app = FastAPI()

# 添加认证中间件
app.add_middleware(
    AuthMiddleware,
    jwt_handler=jwt_handler,
    auth_service=auth_service,
    exclude_paths=[
        "/api/v1/auth/login",
        "/api/v1/health",
        "/docs",
        "/openapi.json"
    ]
)

# 使用依赖注入
from fastapi import Depends
from app.auth.middleware import get_current_user, get_current_admin

@app.get("/api/v1/tickets")
async def list_tickets(user: User = Depends(get_current_user)):
    """需要认证的端点"""
    return {"user_id": user.id}

@app.delete("/api/v1/users/{user_id}")
async def delete_user(
    user_id: int,
    admin: User = Depends(get_current_admin)
):
    """需要管理员权限的端点"""
    return {"message": "用户已删除"}
```

---

## 8. 依赖关系

### 依赖的模块
- `fastapi`: Web框架
- `app.auth.jwt_handler.JWTHandler`: JWT处理
- `app.auth.service.AuthService`: 认证服务
- `app.common.logger`: 日志记录

### 被依赖的模块
- 所有需要认证的API端点

---

## 9. 配置项

```python
# config.py
MIDDLEWARE_CONFIG = {
    "exclude_paths": [
        "/api/v1/auth/login",
        "/api/v1/auth/refresh",
        "/api/v1/health",
        "/docs",
        "/redoc",
        "/openapi.json"
    ],
    "log_auth_attempts": True,
    "rate_limit_enabled": True
}
```

---

## 10. 性能优化

1. **路径匹配缓存**: 缓存exclude_paths的匹配结果
2. **Token缓存**: 短时间内相同Token的验证结果可以缓存（谨慎使用）
3. **异步处理**: 所有I/O操作使用async/await
4. **早期返回**: 对于exclude_paths，尽早返回，避免不必要的处理

---

## 11. 安全考虑

1. **Token传输**: 只接受Authorization头，不接受URL参数中的Token
2. **HTTPS**: 生产环境必须使用HTTPS
3. **Token过期**: 严格验证Token过期时间
4. **日志脱敏**: 日志中不记录完整Token
5. **速率限制**: 防止暴力破解（配合rate limiting中间件）

---

## 12. 测试要点

### 单元测试
- [ ] 公开路径跳过认证
- [ ] 有效Token通过认证
- [ ] 无效Token返回401
- [ ] 过期Token返回401
- [ ] 缺少Token返回401
- [ ] Token格式错误返回401
- [ ] 用户信息正确注入request.state

### 集成测试
- [ ] 端到端认证流程
- [ ] 依赖注入正确工作
- [ ] 管理员权限检查生效

---

**文档结束**
