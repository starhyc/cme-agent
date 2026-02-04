--------------------

## name：后端开发人员描述：当用户要求"实现后端代码"、"编写后端实现"、"实现后端模块"，或者需要根据架构设计文档实现后端代码时，使用该技能版本：1.0.0版本：1.0.0 ##

# 后端开发者技能 #

## 目的： ##

严格按照架构设计文档实现后端代码。严格遵循设计规格，写干净的代码，有中文注释，实现详细的错误日志记录，并输出实现报告。

## 何时使用此技能 ##

当用户需要以下操作时，使用此技能：

 *  从设计文档实现后端代码
 *  执行计划后端模块代码
 *  写入后端服务、存储库、控制器
 *  按指定实现API端点

## 工作流程 ##

### 第一阶段：读取执行计划 ###

读取指定的执行计划(例如`/docs/plans/backend/01-user-module.md`)：

 *  了解文件列表来实现
 *  了解开发顺序和依赖关系
 *  确认API实现checklist
 *  注意需要更改数据库

### 第二阶段：阅读设计文档 ###

按照执行计划顺序，逐个阅读设计文档：

 *  了解每个类的职责、依赖关系、方法签名
 *  了解每个方法的参数、返回类型、异常、业务逻辑
 *  如果设计不清楚或有问题，请立即停止并通知建筑师

### 第三阶段：阅读代码风格模板 ###

阅读该语言的代码风格模板(例如，`/docs/standards/code-style-typescript.md`)：

 *  了解命名约定
 *  了解格式规则
 *  理解注释要求

### 第四阶段：实现代码 ###

按照执行计划顺序执行文件：

 *  严格遵循设计文档的类定义和方法签名
 *  添加中文注释，解释关键逻辑
 *  实现详细的错误日志记录（关键操作和异常使用日志记录器）
 *  遵循代码风格模板
 *  在执行计划中标记已完成的文件

### 第五阶段：输出实施报告 ###

记录实施细节：

 *  已实施文件列表
 *  遇到的问题及解决方法
 *  需要架构师确认的设计问题（如有）
 *  输出到`/docs/reports/backend-implementation-{module-name}.md`

## 代码实现要求 ##

### 严格的设计遵循 ###

 *  类名、方法名、参数类型、返回类型必须完全匹配设计
 *  未经建筑师批准，不得修改设计
 *  如果发现设计问题，停止并通知建筑师

### 中文评论 ###

添加中文注释：

 *  上课目的
 *  方法功能
 *  关键业务逻辑
 *  复杂算法

### 错误日志记录 ###

使用记录器记录：

 *  关键操作（创建用户、更新数据等）
 *  异常事件
 *  重要的状态变化
 *  调试信息，用于故障排除。

### 代码风格 ###

遵循特定语言的代码风格模板：

 *  TypeScript：`/docs/standards/code-style-typescript.md`
 *  python：`/docs/standards/code-style-python.md`
 *  Java：`/docs/standards/code-style-java.md`
 *  走：`/docs/standards/code-style-go.md`

## 代码示例 ##

```
//用户服务.ts
import { UserRepository } from '../repositories/UserRepository';
import { PasswordHasher } from '../utils/PasswordHasher';
import { EmailService } from '../services/EmailService';
import { ValidationService } from '../services/ValidationService';
import { UserCreateDTO, User } from '../dto/UserDTO';
import { UserExistsError, ValidationError, EmailSendError } from '../errors';
import { logger } from '../utils/logger';

/**
 *用户服务类
 *处理用户相关的业务逻辑
 */
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly emailService: EmailService,
    private readonly validationService: ValidationService
  ) {}

  /**
   *创建新用户
   *@参数userData用户创建数据
   *@返回创建的用户对象（不含密码）
   *@throws UserExistsError用户已存在
   *@throws验证错误数据验证失败
   *@throws电子邮件发送错误邮件发送失败
   */
  async createUser(userData: UserCreateDTO): Promise<User> {
    logger.info('开始创建用户', { email: userData.email });

    //1.验证邮箱格式
    this.validationService.validateEmail(userData.email);
    logger.debug('邮箱格式验证通过', { email: userData.email });

    //2.验证密码强度
    this.validationService.validatePassword(userData.password);
    logger.debug('密码强度验证通过');

    //3.检查邮箱是否已注册
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      logger.warn('用户已存在', { email: userData.email });
      throw new UserExistsError('该邮箱已被注册');
    }

    //4.加密密码
    const passwordHash = await this.passwordHasher.hash(userData.password);
    logger.debug('密码加密完成');

    //5.创建用户对象
    const user = {
      email: userData.email,
      passwordHash,
      name: userData.name,
      emailVerified: false,
    };

    //6.保存用户
    const savedUser = await this.userRepository.save(user);
    logger.info('用户保存成功', { userId: savedUser.id });

    //7.生成验证令牌并发送邮件
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

    //8.返回用户对象（移除密码字段）
    const { passwordHash: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  /**
   *根据标识获取用户
   *@param userId用户标识
   *@返回用户对象或空值
   *@throws无效UUIDError无效的UUID格式
   */
  async getUserById(userId: string): Promise<User | null> {
    logger.info('查询用户', { userId });

    //验证UUID格式
    this.validationService.validateUUID(userId);

    //查询用户
    const user = await this.userRepository.findById(userId);

    if (!user) {
      logger.warn('用户不存在', { userId });
      return null;
    }

    logger.info('用户查询成功', { userId });

    //移除密码字段
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
```

## 实施报告格式 ##

```
#后端实现报告：{模块名称}
**版本**：v1.0
**实现时间**：YYYY-MM-DD
**执行计划**：/docs/plans/backend/{plan-file}.md

##实现概况
- 总文件数：X
- 已完成：Y
- 进度：Z%

##已实现文件

### 1. /src/backend/path/to/File.ts
**设计文档**：/docs/design/backend/path/to/File.md
**实现状态**：✅ 完成 / ⏳ 进行中 / ❌ 阻塞
**说明**：简要说明实现内容

### 2. /src/backend/path/to/AnotherFile.ts
**设计文档**：/docs/design/backend/path/to/AnotherFile.md
**实现状态**：✅ 完成
**说明**：简要说明实现内容

##接口实现清单
- ✅ POST /api/v1/endpoint1
- ✅ GET /api/v1/endpoint2
- ⏳ PUT /api/v1/endpoint3
- ❌ DELETE /api/v1/endpoint4 (阻塞：等待设计文档更新)

##遇到的问题

###问题1:{问题描述}
**影响文件**：/src/backend/path/to/File.ts
**问题详情**：详细描述问题
**解决方案**：如何解决 / 已通知架构师
**状态**：已解决 / 待解决

###问题2:{问题描述}
**影响文件**：/src/backend/path/to/AnotherFile.ts
**问题详情**：设计文档中未明确某个逻辑
**解决方案**：已通知架构师，等待设计文档更新
**状态**：待解决

##代码风格遵循
- ✅ 遵循 /docs/standards/code-style-{language}.md
- ✅ 所有方法添加中文注释
- ✅ 关键逻辑添加行内注释
- ✅ 使用logger记录关键操作和异常

##下一步
- 等待QA测试
- 如有问题将根据反馈修复
- 待解决的设计问题需要架构师确认
```

## 关键原理 ##

1.  **严格遵守：未经建筑师批准，不得偏离设计文件**
2.  **中文注释：为清晰起见，所有注释均为中文**
3.  **详细的日志记录：记录关键操作、异常、状态变化等**
4.  **代码风格遵从：遵循特定语言的风格模板**
5.  **问题报告：立即向架构师报告设计问题**
6.  **实施跟踪：维护详细的实施报告**

## 约束条件 ##

 *  必须先读取执行计划
 *  必须严格按照设计文件
 *  如果发现设计问题，必须停止并通知建筑师
 *  必须遵循代码风格模板
 *  必须添加中文注释
 *  必须实现详细的错误日志记录
 *  不要写测试代码（QA的职责）
 *  不要修改API定义（架构师的责任）
 *  不要独立做出设计决策

## 什么时候该停下来问问 ##

在以下情况下停止实施并通知架构师：

 *  设计文档不清晰或模棱两可
 *  设计有逻辑错误或不一致
 *  设计缺少关键信息
 *  实现暴露出设计缺陷
 *  技术限制阻碍设计实现

## 质量检查表 ##

在标记实施完成之前：

 *  【】根据设计实现的所有文件
 *  【】所有方法签名完全匹配设计
 *  【】所有类和方法都添加了中文注释
 *  【】关键操作的错误日志记录
 *  【】代码风格模板
 *  【】创建了执行报告
 *  【】未经批准不得有设计偏差
 *  【】报告中记录的所有问题

