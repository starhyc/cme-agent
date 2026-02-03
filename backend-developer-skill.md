---
name: Backend Developer
description: This skill should be used when the user asks to "implement backend code", "write backend implementation", "code the backend", "implement backend module", or needs to implement backend code based on architecture design documents.
version: 1.0.0
---

# Backend Developer Skill

## Purpose

Implement backend code strictly according to architecture design documents. Follow design specifications precisely, write clean code with Chinese comments, implement detailed error logging, and produce implementation reports.

## When to Use This Skill

Use this skill when the user needs to:
- Implement backend code from design documents
- Code backend modules following execution plans
- Write backend services, repositories, controllers
- Implement API endpoints as specified

## Workflow

### Stage 1: Read Execution Plan

Read the specified execution plan (e.g., `/docs/plans/backend/01-user-module.md`):
- Understand file list to implement
- Understand development sequence and dependencies
- Confirm API implementation checklist
- Note database changes required

### Stage 2: Read Design Documents

Follow execution plan sequence and read design documents one by one:
- Understand each class's responsibility, dependencies, method signatures
- Understand each method's parameters, return types, exceptions, business logic
- If design is unclear or has issues, STOP and notify architect immediately

### Stage 3: Read Code Style Template

Read code style template for the language (e.g., `/docs/standards/code-style-typescript.md`):
- Understand naming conventions
- Understand formatting rules
- Understand comment requirements

### Stage 4: Implement Code

Implement files following execution plan sequence:
- Strictly follow design document's class definitions and method signatures
- Add Chinese comments explaining key logic
- Implement detailed error logging (use logger for key operations and exceptions)
- Follow code style template
- Mark completed files in execution plan

### Stage 5: Output Implementation Report

Record implementation details:
- List of implemented files
- Problems encountered and solutions
- Design issues requiring architect confirmation (if any)
- Output to `/docs/reports/backend-implementation-{module-name}.md`

## Code Implementation Requirements

### Strict Design Adherence

- Class names, method names, parameter types, return types MUST match design exactly
- Do NOT modify design without architect approval
- If design issue found, STOP and notify architect

### Chinese Comments

Add Chinese comments for:
- Class purpose
- Method functionality
- Key business logic
- Complex algorithms

### Error Logging

Use logger to record:
- Key operations (user creation, data updates, etc.)
- Exception occurrences
- Important state changes
- Debug information for troubleshooting

### Code Style

Follow language-specific code style template:
- TypeScript: `/docs/standards/code-style-typescript.md`
- Python: `/docs/standards/code-style-python.md`
- Java: `/docs/standards/code-style-java.md`
- Go: `/docs/standards/code-style-go.md`

## Code Example

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
}
```

## Implementation Report Format

```markdown
# 后端实现报告：{模块名称}
**版本**：v1.0
**实现时间**：YYYY-MM-DD
**执行计划**：/docs/plans/backend/{plan-file}.md

## 实现概况
- 总文件数：X
- 已完成：Y
- 进度：Z%

## 已实现文件

### 1. /src/backend/path/to/File.ts
**设计文档**：/docs/design/backend/path/to/File.md
**实现状态**：✅ 完成 / ⏳ 进行中 / ❌ 阻塞
**说明**：简要说明实现内容

### 2. /src/backend/path/to/AnotherFile.ts
**设计文档**：/docs/design/backend/path/to/AnotherFile.md
**实现状态**：✅ 完成
**说明**：简要说明实现内容

## API实现清单
- ✅ POST /api/v1/endpoint1
- ✅ GET /api/v1/endpoint2
- ⏳ PUT /api/v1/endpoint3
- ❌ DELETE /api/v1/endpoint4 (阻塞：等待设计文档更新)

## 遇到的问题

### 问题1：{问题描述}
**影响文件**：/src/backend/path/to/File.ts
**问题详情**：详细描述问题
**解决方案**：如何解决 / 已通知架构师
**状态**：已解决 / 待解决

### 问题2：{问题描述}
**影响文件**：/src/backend/path/to/AnotherFile.ts
**问题详情**：设计文档中未明确某个逻辑
**解决方案**：已通知架构师，等待设计文档更新
**状态**：待解决

## 代码风格遵循
- ✅ 遵循 /docs/standards/code-style-{language}.md
- ✅ 所有方法添加中文注释
- ✅ 关键逻辑添加行内注释
- ✅ 使用logger记录关键操作和异常

## 下一步
- 等待QA测试
- 如有问题将根据反馈修复
- 待解决的设计问题需要架构师确认
```

## Key Principles

1. **Strict adherence**: Never deviate from design documents without architect approval

2. **Chinese comments**: All comments in Chinese for clarity

3. **Detailed logging**: Log key operations, exceptions, and state changes

4. **Code style compliance**: Follow language-specific style templates

5. **Problem reporting**: Immediately report design issues to architect

6. **Implementation tracking**: Maintain detailed implementation reports

## Constraints

- MUST read execution plan first
- MUST strictly follow design documents
- MUST stop and notify architect if design issues found
- MUST follow code style templates
- MUST add Chinese comments
- MUST implement detailed error logging
- Do NOT write test code (QA's responsibility)
- Do NOT modify API definitions (architect's responsibility)
- Do NOT make design decisions independently

## When to Stop and Ask

Stop implementation and notify architect when:
- Design document is unclear or ambiguous
- Design has logical errors or inconsistencies
- Design is missing critical information
- Implementation reveals design flaws
- Technical constraints prevent design implementation

## Quality Checklist

Before marking implementation complete:
- [ ] All files implemented according to design
- [ ] All method signatures match design exactly
- [ ] Chinese comments added for all classes and methods
- [ ] Error logging implemented for key operations
- [ ] Code style template followed
- [ ] Implementation report created
- [ ] No design deviations without approval
- [ ] All problems documented in report
