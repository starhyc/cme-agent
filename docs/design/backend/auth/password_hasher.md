# 密码哈希器详细设计

**文件路径**: `backend/app/auth/password_hasher.py`
**模块**: 认证授权模块
**作者**: Architect
**版本**: 1.0

---

## 1. 类概述

### 职责
负责密码的安全哈希和验证，使用bcrypt算法确保密码安全存储。

### 依赖
- `bcrypt`: 密码哈希库
- `app.common.logger`: 日志记录

---

## 2. 类定义

```python
import bcrypt
from typing import Optional

class PasswordHasher:
    """
    密码哈希处理器

    使用bcrypt算法对密码进行安全哈希和验证。
    bcrypt是一种自适应哈希函数，专门设计用于密码存储。
    """

    def __init__(
        self,
        rounds: int = 12
    ):
        """
        初始化密码哈希器

        Args:
            rounds: bcrypt的cost因子，默认12
                   值越大越安全但计算越慢
                   推荐范围: 10-14
        """
        pass
```

---

## 3. 属性列表

| 属性名 | 类型 | 说明 |
|--------|------|------|
| rounds | int | bcrypt的cost因子 |
| logger | Logger | 日志记录器 |

---

## 4. 方法列表

### 4.1 hash_password

```python
def hash_password(
    self,
    password: str
) -> str:
    """
    对密码进行哈希

    Args:
        password: 明文密码

    Returns:
        str: 哈希后的密码字符串（包含salt）

    Raises:
        ValueError: 密码为空或None
        PasswordHashError: 哈希过程失败

    业务逻辑:
        1. 验证密码不为空
        2. 将密码转换为bytes
        3. 生成salt（使用bcrypt.gensalt，rounds参数）
        4. 使用bcrypt.hashpw生成哈希
        5. 将bytes转换为字符串
        6. 记录哈希操作日志（不记录密码内容）
        7. 返回哈希字符串
    """
    pass
```

### 4.2 verify_password

```python
def verify_password(
    self,
    password: str,
    password_hash: str
) -> bool:
    """
    验证密码是否匹配

    Args:
        password: 明文密码
        password_hash: 哈希后的密码

    Returns:
        bool: True表示密码匹配，False表示不匹配

    Raises:
        ValueError: 参数为空或None
        PasswordVerifyError: 验证过程失败

    业务逻辑:
        1. 验证参数不为空
        2. 将密码和哈希转换为bytes
        3. 使用bcrypt.checkpw验证
        4. 记录验证结果日志（不记录密码内容）
        5. 返回验证结果
    """
    pass
```

### 4.3 validate_password_strength

```python
def validate_password_strength(
    self,
    password: str,
    min_length: int = 8,
    require_uppercase: bool = True,
    require_lowercase: bool = True,
    require_digit: bool = True,
    require_special: bool = False
) -> tuple[bool, Optional[str]]:
    """
    验证密码强度

    Args:
        password: 待验证的密码
        min_length: 最小长度
        require_uppercase: 是否要求大写字母
        require_lowercase: 是否要求小写字母
        require_digit: 是否要求数字
        require_special: 是否要求特殊字符

    Returns:
        tuple[bool, Optional[str]]:
            - bool: True表示密码强度足够
            - str: 如果强度不足，返回错误信息；否则返回None

    业务逻辑:
        1. 检查密码长度
        2. 如果require_uppercase，检查是否包含大写字母
        3. 如果require_lowercase，检查是否包含小写字母
        4. 如果require_digit，检查是否包含数字
        5. 如果require_special，检查是否包含特殊字符
        6. 返回验证结果和错误信息
    """
    pass
```

### 4.4 needs_rehash

```python
def needs_rehash(
    self,
    password_hash: str
) -> bool:
    """
    检查密码哈希是否需要重新哈希

    Args:
        password_hash: 现有的密码哈希

    Returns:
        bool: True表示需要重新哈希（cost因子已更新）

    业务逻辑:
        1. 从password_hash中提取cost因子
        2. 与当前配置的rounds比较
        3. 如果不同，返回True
        4. 否则返回False
    """
    pass
```

---

## 5. 异常定义

```python
class PasswordHashError(Exception):
    """密码哈希失败异常"""
    pass

class PasswordVerifyError(Exception):
    """密码验证失败异常"""
    pass

class WeakPasswordError(Exception):
    """密码强度不足异常"""
    pass
```

---

## 6. 使用示例

```python
# 初始化密码哈希器
password_hasher = PasswordHasher(rounds=12)

# 哈希密码
password = "MySecurePassword123"
password_hash = password_hasher.hash_password(password)
print(f"哈希后的密码: {password_hash}")

# 验证密码
is_valid = password_hasher.verify_password(password, password_hash)
if is_valid:
    print("密码验证成功")
else:
    print("密码验证失败")

# 验证错误密码
is_valid = password_hasher.verify_password("WrongPassword", password_hash)
print(f"错误密码验证结果: {is_valid}")  # False

# 验证密码强度
is_strong, error_msg = password_hasher.validate_password_strength(
    password="weak",
    min_length=8,
    require_uppercase=True,
    require_lowercase=True,
    require_digit=True
)
if not is_strong:
    print(f"密码强度不足: {error_msg}")

# 检查是否需要重新哈希
if password_hasher.needs_rehash(password_hash):
    print("密码需要重新哈希（cost因子已更新）")
    new_hash = password_hasher.hash_password(password)
```

---

## 7. 依赖关系

### 依赖的模块
- `bcrypt`: 密码哈希算法
- `app.common.logger`: 日志记录

### 被依赖的模块
- `app.auth.service.AuthService`: 认证服务
- `app.auth.repository.UserRepository`: 用户数据访问

---

## 8. 配置项

```python
# config.py
PASSWORD_CONFIG = {
    "bcrypt_rounds": 12,  # bcrypt cost因子
    "min_length": 8,  # 最小密码长度
    "require_uppercase": True,  # 要求大写字母
    "require_lowercase": True,  # 要求小写字母
    "require_digit": True,  # 要求数字
    "require_special": False  # 要求特殊字符
}
```

---

## 9. bcrypt哈希格式

bcrypt生成的哈希格式如下：
```
$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW
\__/\/ \____________________/\_____________________________/
 |  |          |                          |
 |  |          |                          哈希值（31字符）
 |  |          salt（22字符）
 |  cost因子（12）
 算法版本（2b）
```

---

## 10. 性能考虑

### bcrypt cost因子选择
| Rounds | 哈希时间 | 安全性 | 推荐场景 |
|--------|---------|--------|---------|
| 10 | ~100ms | 中等 | 开发环境 |
| 12 | ~400ms | 高 | 生产环境（推荐） |
| 14 | ~1.6s | 很高 | 高安全要求 |

### 性能优化建议
1. **异步处理**: 密码哈希是CPU密集型操作，建议在后台线程执行
2. **合理选择rounds**: 平衡安全性和性能，推荐12
3. **避免频繁哈希**: 只在注册和修改密码时哈希
4. **缓存验证结果**: 短时间内重复验证可以缓存结果（谨慎使用）

---

## 11. 安全考虑

1. **Salt自动生成**: bcrypt自动为每个密码生成唯一的salt
2. **慢哈希算法**: bcrypt设计为慢速算法，抵抗暴力破解
3. **自适应**: 可以通过增加rounds提高安全性
4. **时间恒定**: bcrypt验证时间恒定，防止时序攻击
5. **不可逆**: 哈希过程不可逆，无法从哈希还原密码

### 常见安全错误
- ❌ 使用MD5或SHA1哈希密码（不安全）
- ❌ 不使用salt（容易被彩虹表攻击）
- ❌ 使用固定salt（所有用户相同salt）
- ❌ 在日志中记录明文密码
- ✅ 使用bcrypt、scrypt或Argon2
- ✅ 每个密码使用唯一salt
- ✅ 使用足够的cost因子

---

## 12. 测试要点

### 单元测试
- [ ] 哈希密码成功
- [ ] 验证正确密码成功
- [ ] 验证错误密码失败
- [ ] 空密码抛出异常
- [ ] 密码强度验证（长度不足）
- [ ] 密码强度验证（缺少大写字母）
- [ ] 密码强度验证（缺少小写字母）
- [ ] 密码强度验证（缺少数字）
- [ ] 密码强度验证（缺少特殊字符）
- [ ] 检查是否需要重新哈希

### 性能测试
- [ ] 哈希操作时间在可接受范围内（<500ms）
- [ ] 验证操作时间在可接受范围内（<500ms）
- [ ] 并发哈希测试

### 安全测试
- [ ] 相同密码生成不同哈希（salt唯一性）
- [ ] 哈希不可逆（无法还原密码）
- [ ] 时序攻击防护（验证时间恒定）

---

**文档结束**
