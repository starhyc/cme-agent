# Code Examples with Chinese Comments and Logging

This file contains complete code examples demonstrating proper implementation with Chinese comments and detailed logging.

## TypeScript Example: UserService

```typescript
// UserService.ts
import { UserRepository } from '../repositories/UserRepository';
import { PasswordHasher } from '../utils/PasswordHasher';
import { EmailService } from '../services/EmailService';
import { ValidationService } from '../services/ValidationService';
import { UserCreateDTO, User } from '../dto/UserDTO';
import { UserExistsError, ValidationError, EmailSendError } from '../errors';
import { logger } from '../utils/logger';

/**
 * 用户服务类
 * 处理用户相关的业务逻辑
 */
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly emailService: EmailService,
    private readonly validationService: ValidationService
  ) {}

  /**
   * 创建新用户
   * @param userData 用户创建数据
   * @returns 创建的用户对象（不含密码）
   * @throws UserExistsError 用户已存在
   * @throws ValidationError 数据验证失败
   * @throws EmailSendError 邮件发送失败
   */
  async createUser(userData: UserCreateDTO): Promise<User> {
    logger.info('开始创建用户', { email: userData.email });

    // 1. 验证邮箱格式
    this.validationService.validateEmail(userData.email);
    logger.debug('邮箱格式验证通过', { email: userData.email });

    // 2. 验证密码强度
    this.validationService.validatePassword(userData.password);
    logger.debug('密码强度验证通过');

    // 3. 检查邮箱是否已注册
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      logger.warn('用户已存在', { email: userData.email });
      throw new UserExistsError('该邮箱已被注册');
    }

    // 4. 加密密码
    const passwordHash = await this.passwordHasher.hash(userData.password);
    logger.debug('密码加密完成');

    // 5. 创建用户对象
    const user = {
      email: userData.email,
      passwordHash,
      name: userData.name,
      emailVerified: false,
    };

    // 6. 保存用户
    const savedUser = await this.userRepository.save(user);
    logger.info('用户保存成功', { userId: savedUser.id });

    // 7. 生成验证token并发送邮件
    const verificationToken = this.generateVerificationToken(savedUser.id);
    try {
      await this.emailService.sendVerificationEmail(
        savedUser.email,
        verificationToken
      );
      logger.info('验证邮件发送成功', { userId: savedUser.id });
    } catch (error) {
      logger.error('验证邮件发送失败', { userId: savedUser.id, error });
      throw new EmailSendError('验证邮件发送失败');
    }

    // 8. 返回用户对象（移除密码字段）
    const { passwordHash: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  /**
   * 根据ID获取用户
   * @param userId 用户ID
   * @returns 用户对象或null
   * @throws InvalidUUIDError 无效的UUID格式
   */
  async getUserById(userId: string): Promise<User | null> {
    logger.info('查询用户', { userId });

    // 验证UUID格式
    this.validationService.validateUUID(userId);

    // 查询用户
    const user = await this.userRepository.findById(userId);

    if (!user) {
      logger.warn('用户不存在', { userId });
      return null;
    }

    logger.info('用户查询成功', { userId });

    // 移除密码字段
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * 更新用户信息
   * @param userId 用户ID
   * @param updateData 更新数据
   * @returns 更新后的用户对象
   * @throws UserNotFoundError 用户不存在
   * @throws ValidationError 数据验证失败
   */
  async updateUser(userId: string, updateData: UserUpdateDTO): Promise<User> {
    logger.info('开始更新用户', { userId, updateData });

    // 1. 获取用户
    const user = await this.getUserById(userId);
    if (!user) {
      logger.warn('用户不存在，无法更新', { userId });
      throw new UserNotFoundError('用户不存在');
    }

    // 2. 如果更新密码，验证并加密
    if (updateData.password) {
      this.validationService.validatePassword(updateData.password);
      updateData.passwordHash = await this.passwordHasher.hash(updateData.password);
      delete updateData.password; // 删除明文密码
      logger.debug('密码已加密');
    }

    // 3. 更新用户
    const updatedUser = await this.userRepository.update(userId, updateData);
    logger.info('用户更新成功', { userId });

    // 4. 返回用户对象（移除密码字段）
    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  /**
   * 删除用户
   * @param userId 用户ID
   * @throws UserNotFoundError 用户不存在
   */
  async deleteUser(userId: string): Promise<void> {
    logger.info('开始删除用户', { userId });

    // 验证用户存在
    const user = await this.getUserById(userId);
    if (!user) {
      logger.warn('用户不存在，无法删除', { userId });
      throw new UserNotFoundError('用户不存在');
    }

    // 删除用户
    await this.userRepository.delete(userId);
    logger.info('用户删除成功', { userId });
  }

  /**
   * 生成邮箱验证token
   * @param userId 用户ID
   * @returns JWT token
   * @private
   */
  private generateVerificationToken(userId: string): string {
    // 生成24小时有效期的JWT token
    const token = jwt.sign(
      { userId, type: 'email_verification' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    logger.debug('验证token生成成功', { userId });
    return token;
  }
}
```

## Python Example: UserService

```python
# user_service.py
from typing import Optional
from .user_repository import UserRepository
from .password_hasher import PasswordHasher
from .email_service import EmailService
from .validation_service import ValidationService
from ..dto.user_dto import UserCreateDTO, UserUpdateDTO, User
from ..errors import UserExistsError, ValidationError, EmailSendError, UserNotFoundError
from ..utils.logger import logger
import jwt
import os
from datetime import datetime, timedelta

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
        validation_service: ValidationService
    ):
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
            EmailSendError: 邮件发送失败
        """
        logger.info('开始创建用户', extra={'email': user_data.email})

        # 1. 验证邮箱格式
        self.validation_service.validate_email(user_data.email)
        logger.debug('邮箱格式验证通过', extra={'email': user_data.email})

        # 2. 验证密码强度
        self.validation_service.validate_password(user_data.password)
        logger.debug('密码强度验证通过')

        # 3. 检查邮箱是否已注册
        existing_user = await self.user_repository.find_by_email(user_data.email)
        if existing_user:
            logger.warning('用户已存在', extra={'email': user_data.email})
            raise UserExistsError('该邮箱已被注册')

        # 4. 加密密码
        password_hash = await self.password_hasher.hash(user_data.password)
        logger.debug('密码加密完成')

        # 5. 创建用户对象
        user = {
            'email': user_data.email,
            'password_hash': password_hash,
            'name': user_data.name,
            'email_verified': False
        }

        # 6. 保存用户
        saved_user = await self.user_repository.save(user)
        logger.info('用户保存成功', extra={'user_id': saved_user.id})

        # 7. 生成验证token并发送邮件
        verification_token = self._generate_verification_token(saved_user.id)
        try:
            await self.email_service.send_verification_email(
                saved_user.email,
                verification_token
            )
            logger.info('验证邮件发送成功', extra={'user_id': saved_user.id})
        except Exception as error:
            logger.error('验证邮件发送失败', extra={'user_id': saved_user.id, 'error': str(error)})
            raise EmailSendError('验证邮件发送失败')

        # 8. 返回用户对象（移除密码字段）
        return self._remove_password(saved_user)

    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        """
        根据ID获取用户

        Args:
            user_id: 用户ID

        Returns:
            用户对象或None

        Raises:
            InvalidUUIDError: 无效的UUID格式
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

        # 移除密码字段
        return self._remove_password(user)

    def _generate_verification_token(self, user_id: str) -> str:
        """
        生成邮箱验证token

        Args:
            user_id: 用户ID

        Returns:
            JWT token
        """
        # 生成24小时有效期的JWT token
        token = jwt.encode(
            {
                'user_id': user_id,
                'type': 'email_verification',
                'exp': datetime.utcnow() + timedelta(hours=24)
            },
            os.getenv('JWT_SECRET'),
            algorithm='HS256'
        )
        logger.debug('验证token生成成功', extra={'user_id': user_id})
        return token

    def _remove_password(self, user: User) -> User:
        """
        移除用户对象中的密码字段

        Args:
            user: 用户对象

        Returns:
            不含密码的用户对象
        """
        user_dict = user.__dict__.copy()
        user_dict.pop('password_hash', None)
        return User(**user_dict)
```

## Comment Guidelines

### Class Comments

```typescript
/**
 * 类名
 * 类的职责和用途的简要说明
 */
export class ClassName {
  // ...
}
```

### Method Comments

```typescript
/**
 * 方法功能的简要说明
 * @param paramName 参数说明
 * @returns 返回值说明
 * @throws ErrorType 异常说明
 */
async methodName(paramName: Type): Promise<ReturnType> {
  // ...
}
```

### Inline Comments

```typescript
// 1. 步骤说明
const result = await someOperation();

// 检查条件并处理
if (condition) {
  // 处理逻辑说明
  handleSomething();
}
```

## Error Handling Patterns

### Try-Catch with Logging

```typescript
try {
  await this.emailService.sendEmail(email);
  logger.info('邮件发送成功', { email });
} catch (error) {
  logger.error('邮件发送失败', { email, error });
  throw new EmailSendError('邮件发送失败');
}
```

### Validation with Early Return

```typescript
// 验证输入
if (!userId) {
  logger.warn('用户ID为空');
  throw new ValidationError('用户ID不能为空');
}

// 验证资源存在
const user = await this.userRepository.findById(userId);
if (!user) {
  logger.warn('用户不存在', { userId });
  throw new UserNotFoundError('用户不存在');
}
```

### Business Logic Validation

```typescript
// 检查业务规则
const existingUser = await this.userRepository.findByEmail(email);
if (existingUser) {
  logger.warn('用户已存在', { email });
  throw new UserExistsError('该邮箱已被注册');
}
```
