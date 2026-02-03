# Python 代码风格规范

**版本**：v1.0
**适用范围**：Python 3.8+ 项目

---

## 一、命名规范

### 1.1 文件命名
- 模块文件：snake_case（如 `user_service.py`）
- 包目录：snake_case（如 `user_management/`）

### 1.2 变量命名
```python
# 普通变量：snake_case
user_name = 'John'
is_active = True

# 常量：UPPER_SNAKE_CASE
MAX_RETRY_COUNT = 3
API_BASE_URL = 'https://api.example.com'

# 私有变量：以单下划线开头
_internal_state = {}

# 强私有变量：以双下划线开头（名称改编）
__private_var = 'secret'
```

### 1.3 函数命名
```python
# 函数：snake_case，动词开头
def get_user_by_id(user_id: str) -> User:
    pass

def calculate_total(items: list[Item]) -> float:
    pass

def is_valid_email(email: str) -> bool:
    pass
```

### 1.4 类命名
```python
# 类：PascalCase
class UserService:
    pass

class HttpClient:
    pass

# 异常类：以Error结尾
class UserExistsError(Exception):
    pass

class ValidationError(Exception):
    pass
```

---

## 二、代码格式

### 2.1 缩进和空格
- 使用 **4个空格** 缩进（不使用Tab）
- 运算符两侧加空格
- 逗号后加空格

```python
# ✅ 正确
sum_value = a + b
arr = [1, 2, 3]
def foo(a: int, b: int) -> int:
    pass

# ❌ 错误
sum_value=a+b
arr=[1,2,3]
def foo(a:int,b:int)->int:
    pass
```

### 2.2 行长度
- 每行最多 **88个字符**（Black默认）
- 超过时换行

```python
# ✅ 正确
result = await user_service.create_user(
    email='test@example.com',
    password='SecurePass123',
    name='张三'
)

# ❌ 错误（超过88字符）
result = await user_service.create_user(email='test@example.com', password='SecurePass123', name='张三')
```

### 2.3 空行
- 顶层函数和类之间：2个空行
- 类方法之间：1个空行
- 函数内逻辑块之间：1个空行

```python
class UserService:
    def __init__(self):
        pass

    def create_user(self):
        # 逻辑块1
        self._validate()

        # 逻辑块2
        self._save()
```

### 2.4 引号
- 字符串使用 **单引号**
- 文档字符串使用 **三引号**

```python
# ✅ 正确
name = 'John'
"""这是文档字符串"""

# ❌ 错误
name = "John"
```

---

## 三、类型注解

### 3.1 函数类型注解
```python
from typing import Optional, List, Dict

# ✅ 必须有类型注解
def get_user_by_id(user_id: str) -> Optional[User]:
    pass

def get_all_users() -> List[User]:
    pass

def get_user_map() -> Dict[str, User]:
    pass
```

### 3.2 变量类型注解
```python
# 复杂类型需要注解
users: List[User] = []
config: Dict[str, Any] = {}

# 简单类型可以省略（类型推断）
count = 0
name = 'John'
```

### 3.3 Python 3.10+ 新语法
```python
# 使用 | 代替 Optional
def get_user(user_id: str) -> User | None:
    pass

# 使用内置类型代替 typing
def process_items(items: list[str]) -> dict[str, int]:
    pass
```

---

## 四、注释规范

### 4.1 文档字符串（Docstring）
```python
def create_user(user_data: UserCreateDTO) -> User:
    """
    创建新用户

    Args:
        user_data: 用户创建数据

    Returns:
        创建的用户对象（不含密码）

    Raises:
        UserExistsError: 用户已存在
        ValidationError: 数据验证失败
    """
    pass
```

### 4.2 类文档字符串
```python
class UserService:
    """
    用户服务类
    处理用户相关的业务逻辑
    """

    def __init__(self, repository: UserRepository):
        """
        初始化用户服务

        Args:
            repository: 用户数据仓库
        """
        self.repository = repository
```

### 4.3 行内注释
```python
# 验证邮箱格式
self.validation_service.validate_email(user_data.email)

# 加密密码（使用bcrypt，salt rounds = 10）
password_hash = self.password_hasher.hash(user_data.password)
```

---

## 五、函数和方法

### 5.1 函数长度
- 单个函数不超过 **50行**
- 超过时拆分为多个小函数

### 5.2 参数数量
- 参数不超过 **5个**
- 超过时使用数据类或字典

```python
# ✅ 正确
def create_user(user_data: UserCreateDTO) -> User:
    pass

# ❌ 错误（参数过多）
def create_user(email: str, password: str, name: str, age: int, phone: str) -> User:
    pass
```

### 5.3 返回值
```python
# ✅ 明确返回类型
def get_user(user_id: str) -> User | None:
    if user:
        return user
    return None

# ❌ 隐式返回None
def get_user(user_id: str) -> User | None:
    if user:
        return user
    # 缺少显式return None
```

---

## 六、异步处理

### 6.1 使用 async/await
```python
# ✅ 正确
async def fetch_user(user_id: str) -> User:
    response = await http_client.get(f'/api/users/{user_id}')
    data = await response.json()
    return data

# 异步上下文管理器
async with aiohttp.ClientSession() as session:
    async with session.get(url) as response:
        return await response.json()
```

### 6.2 错误处理
```python
async def fetch_user(user_id: str) -> User:
    try:
        response = await http_client.get(f'/api/users/{user_id}')
        response.raise_for_status()
        return await response.json()
    except HTTPError as e:
        logger.error(f'获取用户失败: {user_id}', exc_info=e)
        raise
```

---

## 七、导入规范

### 7.1 导入顺序
```python
# 1. 标准库
import os
import sys
from typing import Optional, List

# 2. 第三方库
import requests
from fastapi import FastAPI

# 3. 本地模块
from app.services.user_service import UserService
from app.models.user import User

# 4. 相对导入
from .utils import format_date
from ..models import User
```

### 7.2 导入方式
```python
# ✅ 正确
from typing import Optional, List
from app.services import UserService

# ❌ 错误（通配符导入）
from typing import *
from app.services import *
```

---

## 八、类和数据结构

### 8.1 数据类
```python
from dataclasses import dataclass

@dataclass
class User:
    """用户数据类"""
    id: str
    email: str
    name: str
    email_verified: bool = False
```

### 8.2 类方法和静态方法
```python
class UserService:
    @classmethod
    def from_config(cls, config: dict) -> 'UserService':
        """从配置创建实例"""
        return cls(config['repository'])

    @staticmethod
    def validate_email(email: str) -> bool:
        """验证邮箱格式"""
        return '@' in email
```

### 8.3 属性装饰器
```python
class User:
    def __init__(self, name: str):
        self._name = name

    @property
    def name(self) -> str:
        """获取用户名"""
        return self._name

    @name.setter
    def name(self, value: str) -> None:
        """设置用户名"""
        self._name = value
```

---

## 九、错误处理

### 9.1 自定义异常
```python
class UserExistsError(Exception):
    """用户已存在异常"""
    pass

class ValidationError(Exception):
    """数据验证异常"""
    def __init__(self, message: str, field: str):
        super().__init__(message)
        self.field = field
```

### 9.2 异常处理
```python
try:
    user = await user_service.create_user(user_data)
except UserExistsError:
    logger.warning(f'用户已存在: {user_data.email}')
    raise
except ValidationError as e:
    logger.error(f'验证失败: {e.field}', exc_info=e)
    raise
except Exception as e:
    logger.error('未知错误', exc_info=e)
    raise
```

---

## 十、日志记录

### 10.1 日志级别
```python
import logging

logger = logging.getLogger(__name__)

# DEBUG: 详细调试信息
logger.debug('邮箱格式验证通过', extra={'email': email})

# INFO: 关键操作信息
logger.info('开始创建用户', extra={'email': email})

# WARNING: 警告信息
logger.warning('用户已存在', extra={'email': email})

# ERROR: 错误信息
logger.error('创建用户失败', exc_info=True)
```

### 10.2 结构化日志
```python
logger.info(
    '用户创建成功',
    extra={
        'user_id': user.id,
        'email': user.email,
        'timestamp': datetime.now().isoformat()
    }
)
```

---

## 十一、测试规范

### 11.1 测试文件命名
- 测试文件：`test_*.py` 或 `*_test.py`
- 测试类：`Test*`
- 测试方法：`test_*`

### 11.2 测试结构
```python
import pytest
from app.services.user_service import UserService

class TestUserService:
    """用户服务测试类"""

    @pytest.fixture
    def user_service(self):
        """创建用户服务实例"""
        return UserService()

    def test_create_user_success(self, user_service):
        """测试成功创建用户"""
        user = user_service.create_user({
            'email': 'test@example.com',
            'password': 'SecurePass123',
            'name': '张三'
        })
        assert user.email == 'test@example.com'

    def test_create_user_duplicate_email(self, user_service):
        """测试重复邮箱注册"""
        with pytest.raises(UserExistsError):
            user_service.create_user({'email': 'existing@example.com'})
```

---

## 十二、代码检查工具配置

### 12.1 Black配置（pyproject.toml）
```toml
[tool.black]
line-length = 88
target-version = ['py38', 'py39', 'py310']
include = '\.pyi?$'
```

### 12.2 isort配置
```toml
[tool.isort]
profile = "black"
line_length = 88
```

### 12.3 pylint配置
```ini
[MASTER]
max-line-length=88

[MESSAGES CONTROL]
disable=C0111  # missing-docstring
```

---

## 十三、示例代码

### 完整示例：user_service.py
```python
"""
用户服务模块
处理用户相关的业务逻辑
"""
import logging
from typing import Optional

from app.repositories.user_repository import UserRepository
from app.utils.password_hasher import PasswordHasher
from app.services.email_service import EmailService
from app.services.validation_service import ValidationService
from app.dto.user_dto import UserCreateDTO, User
from app.errors import UserExistsError, ValidationError

logger = logging.getLogger(__name__)


class UserService:
    """
    用户服务类
    处理用户相关的业务逻辑
    """

    def __init__(
        self,
        user_repository: UserRepository,
        password_hasher: PasswordHasher,
        email_service: EmailService,
        validation_service: ValidationService,
    ):
        """
        初始化用户服务

        Args:
            user_repository: 用户数据仓库
            password_hasher: 密码加密工具
            email_service: 邮件服务
            validation_service: 验证服务
        """
        self.user_repository = user_repository
        self.password_hasher = password_hasher
        self.email_service = email_service
        self.validation_service = validation_service

    async def create_user(self, user_data: UserCreateDTO) -> User:
        """
        创建新用户

        Args:
            user_data: 用户创建数据

        Returns:
            创建的用户对象（不含密码）

        Raises:
            UserExistsError: 用户已存在
            ValidationError: 数据验证失败
        """
        logger.info('开始创建用户', extra={'email': user_data.email})

        # 验证邮箱格式
        self.validation_service.validate_email(user_data.email)
        logger.debug('邮箱格式验证通过', extra={'email': user_data.email})

        # 验证密码强度
        self.validation_service.validate_password(user_data.password)
        logger.debug('密码强度验证通过')

        # 检查邮箱是否已注册
        existing_user = await self.user_repository.find_by_email(user_data.email)
        if existing_user:
            logger.warning('用户已存在', extra={'email': user_data.email})
            raise UserExistsError('该邮箱已被注册')

        # 加密密码
        password_hash = await self.password_hasher.hash(user_data.password)
        logger.debug('密码加密完成')

        # 保存用户
        saved_user = await self.user_repository.save({
            'email': user_data.email,
            'password_hash': password_hash,
            'name': user_data.name,
            'email_verified': False,
        })
        logger.info('用户保存成功', extra={'user_id': saved_user.id})

        # 发送验证邮件
        verification_token = self._generate_verification_token(saved_user.id)
        await self.email_service.send_verification_email(
            saved_user.email,
            verification_token
        )

        # 返回用户对象（移除密码字段）
        return User(
            id=saved_user.id,
            email=saved_user.email,
            name=saved_user.name,
            email_verified=saved_user.email_verified,
        )

    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        """
        根据ID获取用户

        Args:
            user_id: 用户ID

        Returns:
            用户对象或None
        """
        logger.info('查询用户', extra={'user_id': user_id})

        # 验证UUID格式
        self.validation_service.validate_uuid(user_id)

        # 查询用户
        user = await self.user_repository.find_by_id(user_id)

        if not user:
            logger.warning('用户不存在', extra={'user_id': user_id})
            return None

        logger.info('用户查询成功', extra={'user_id': user_id})
        return user

    def _generate_verification_token(self, user_id: str) -> str:
        """
        生成邮箱验证token

        Args:
            user_id: 用户ID

        Returns:
            JWT token
        """
        # 实现token生成逻辑
        return ''
```

---

**遵循此规范可以保证Python代码的一致性、可读性和可维护性。**
