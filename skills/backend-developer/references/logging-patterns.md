# Logging Patterns and Best Practices

This file contains logging best practices and common patterns for backend implementation.

## Logging Levels

### INFO - Key Operations

Use `logger.info()` for important business operations:
- User registration, login, logout
- Data creation, updates, deletion
- External API calls
- Payment transactions
- Email sending

```typescript
logger.info('开始创建用户', { email: userData.email });
logger.info('用户保存成功', { userId: savedUser.id });
logger.info('验证邮件发送成功', { userId: savedUser.id });
```

### DEBUG - Detailed Flow

Use `logger.debug()` for detailed execution flow:
- Validation steps
- Intermediate results
- Algorithm steps

```typescript
logger.debug('邮箱格式验证通过', { email: userData.email });
logger.debug('密码强度验证通过');
logger.debug('密码加密完成');
```

### WARN - Recoverable Issues

Use `logger.warn()` for issues that don't prevent operation:
- Resource not found (when it's expected)
- Duplicate operations
- Deprecated feature usage

```typescript
logger.warn('用户已存在', { email: userData.email });
logger.warn('用户不存在', { userId });
```

### ERROR - Failures

Use `logger.error()` for failures and exceptions:
- Exceptions caught
- External service failures
- Database errors

```typescript
logger.error('验证邮件发送失败', { userId: savedUser.id, error });
logger.error('数据库连接失败', { error });
```

## Logging Patterns

### Pattern 1: Operation Start and End

Log at the start and end of important operations:

```typescript
async createUser(userData: UserCreateDTO): Promise<User> {
  logger.info('开始创建用户', { email: userData.email });

  // ... implementation ...

  logger.info('用户创建成功', { userId: savedUser.id });
  return savedUser;
}
```

### Pattern 2: Validation Steps

Log validation results:

```typescript
// 验证邮箱格式
this.validationService.validateEmail(userData.email);
logger.debug('邮箱格式验证通过', { email: userData.email });

// 验证密码强度
this.validationService.validatePassword(userData.password);
logger.debug('密码强度验证通过');
```

### Pattern 3: Conditional Logic

Log important conditions:

```typescript
const existingUser = await this.userRepository.findByEmail(userData.email);
if (existingUser) {
  logger.warn('用户已存在', { email: userData.email });
  throw new UserExistsError('该邮箱已被注册');
}
```

### Pattern 4: Try-Catch with Error Logging

Always log errors in catch blocks:

```typescript
try {
  await this.emailService.sendVerificationEmail(email, token);
  logger.info('验证邮件发送成功', { userId });
} catch (error) {
  logger.error('验证邮件发送失败', { userId, error });
  throw new EmailSendError('验证邮件发送失败');
}
```

### Pattern 5: External Service Calls

Log before and after external calls:

```typescript
logger.info('调用支付网关', { orderId, amount });
try {
  const result = await paymentGateway.charge(orderId, amount);
  logger.info('支付成功', { orderId, transactionId: result.id });
  return result;
} catch (error) {
  logger.error('支付失败', { orderId, error });
  throw new PaymentError('支付失败');
}
```

## Context Data

### Include Relevant Context

Always include relevant identifiers and data:

```typescript
// ✅ Good - includes context
logger.info('开始创建用户', { email: userData.email });
logger.info('用户保存成功', { userId: savedUser.id });

// ❌ Bad - no context
logger.info('开始创建用户');
logger.info('用户保存成功');
```

### Sensitive Data

Never log sensitive information:

```typescript
// ❌ Bad - logs password
logger.info('创建用户', { email, password });

// ✅ Good - no sensitive data
logger.info('创建用户', { email });
```

**Never log**:
- Passwords (plain or hashed)
- Credit card numbers
- API keys or tokens
- Personal identification numbers
- Social security numbers

### Structured Logging

Use structured logging with objects:

```typescript
// ✅ Good - structured
logger.info('用户登录', {
  userId: user.id,
  email: user.email,
  ip: req.ip,
  userAgent: req.headers['user-agent']
});

// ❌ Bad - string concatenation
logger.info(`用户登录: ${user.id}, ${user.email}`);
```

## Complete Examples

### Example 1: CRUD Service

```typescript
export class UserService {
  async createUser(userData: UserCreateDTO): Promise<User> {
    logger.info('开始创建用户', { email: userData.email });

    // 验证
    this.validationService.validateEmail(userData.email);
    logger.debug('邮箱格式验证通过', { email: userData.email });

    // 检查重复
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      logger.warn('用户已存在', { email: userData.email });
      throw new UserExistsError('该邮箱已被注册');
    }

    // 保存
    const savedUser = await this.userRepository.save(userData);
    logger.info('用户保存成功', { userId: savedUser.id });

    return savedUser;
  }

  async getUserById(userId: string): Promise<User | null> {
    logger.info('查询用户', { userId });

    const user = await this.userRepository.findById(userId);

    if (!user) {
      logger.warn('用户不存在', { userId });
      return null;
    }

    logger.info('用户查询成功', { userId });
    return user;
  }

  async updateUser(userId: string, updateData: UserUpdateDTO): Promise<User> {
    logger.info('开始更新用户', { userId, updateData });

    const user = await this.getUserById(userId);
    if (!user) {
      logger.warn('用户不存在，无法更新', { userId });
      throw new UserNotFoundError('用户不存在');
    }

    const updatedUser = await this.userRepository.update(userId, updateData);
    logger.info('用户更新成功', { userId });

    return updatedUser;
  }

  async deleteUser(userId: string): Promise<void> {
    logger.info('开始删除用户', { userId });

    const user = await this.getUserById(userId);
    if (!user) {
      logger.warn('用户不存在，无法删除', { userId });
      throw new UserNotFoundError('用户不存在');
    }

    await this.userRepository.delete(userId);
    logger.info('用户删除成功', { userId });
  }
}
```

### Example 2: External Service Integration

```typescript
export class EmailService {
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    logger.info('开始发送验证邮件', { email });

    const emailContent = this.buildVerificationEmail(token);
    logger.debug('邮件内容生成完成', { email });

    try {
      await this.emailProvider.send({
        to: email,
        subject: '验证您的邮箱',
        html: emailContent
      });
      logger.info('验证邮件发送成功', { email });
    } catch (error) {
      logger.error('验证邮件发送失败', { email, error });
      throw new EmailSendError('验证邮件发送失败');
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    logger.info('开始发送密码重置邮件', { email });

    const emailContent = this.buildPasswordResetEmail(token);
    logger.debug('邮件内容生成完成', { email });

    try {
      await this.emailProvider.send({
        to: email,
        subject: '重置您的密码',
        html: emailContent
      });
      logger.info('密码重置邮件发送成功', { email });
    } catch (error) {
      logger.error('密码重置邮件发送失败', { email, error });
      throw new EmailSendError('密码重置邮件发送失败');
    }
  }
}
```

### Example 3: Controller with Request Logging

```typescript
export class UserController {
  async register(req: Request, res: Response): Promise<void> {
    logger.info('收到注册请求', {
      email: req.body.email,
      ip: req.ip
    });

    try {
      const user = await this.userService.createUser(req.body);
      logger.info('注册成功', { userId: user.id });

      res.status(201).json(user);
    } catch (error) {
      if (error instanceof UserExistsError) {
        logger.warn('注册失败：用户已存在', { email: req.body.email });
        res.status(400).json({ error: 'USER_EXISTS', message: error.message });
      } else if (error instanceof ValidationError) {
        logger.warn('注册失败：验证错误', { email: req.body.email, error: error.message });
        res.status(400).json({ error: 'VALIDATION_ERROR', message: error.message });
      } else {
        logger.error('注册失败：未知错误', { email: req.body.email, error });
        res.status(500).json({ error: 'INTERNAL_ERROR', message: '服务器内部错误' });
      }
    }
  }
}
```

## Logger Configuration

### TypeScript/Node.js (Winston)

```typescript
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Python (logging)

```python
import logging
import json

class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            'timestamp': self.formatTime(record),
            'level': record.levelname,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName
        }
        if hasattr(record, 'extra'):
            log_data.update(record.extra)
        return json.dumps(log_data)

logger = logging.getLogger(__name__)
handler = logging.StreamHandler()
handler.setFormatter(JsonFormatter())
logger.addHandler(handler)
logger.setLevel(logging.INFO)
```

## Best Practices Summary

1. **Log at boundaries**: Start and end of operations
2. **Include context**: Always add relevant identifiers
3. **Use appropriate levels**: INFO for operations, DEBUG for details, WARN for issues, ERROR for failures
4. **Structured logging**: Use objects, not string concatenation
5. **Never log sensitive data**: Passwords, tokens, credit cards
6. **Log errors with context**: Include error object and relevant data
7. **Be consistent**: Use same format across codebase
8. **Log external calls**: Before and after external service calls
