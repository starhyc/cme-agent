# PRD Template and Format Specification

This file contains the complete PRD template and detailed format specifications.

## Standard PRD Template

```markdown
# 产品需求文档（PRD）
**版本**：v1.0
**创建时间**：YYYY-MM-DD
**项目类型**：0-1新项目 / 1-n功能迭代

## 一、需求概述
[Brief description of the requirement background and objectives]

## 二、目标用户
[Describe target users and usage scenarios]

## 三、功能需求

### 功能1：[Feature Name]
**功能描述**：
[Detailed description of feature purpose, usage method, input/output]

**验收标准**：
- [ ] Standard 1: Specific testable acceptance condition
- [ ] Standard 2: Specific testable acceptance condition
- [ ] Standard 3: Specific testable acceptance condition

### 功能2：[Feature Name]
**功能描述**：
[Detailed description]

**验收标准**：
- [ ] Standard 1: Specific testable acceptance condition
- [ ] Standard 2: Specific testable acceptance condition

## 四、非功能需求（可选）
[Performance requirements, security requirements, etc.]

## 五、优先级
- P0（必须）：[List critical features]
- P1（重要）：[List important features]
- P2（可选）：[List optional features]
```

## Section Guidelines

### 一、需求概述 (Requirements Overview)

**Purpose**: Provide context and background for the requirements.

**What to include**:
- Problem statement: What problem are we solving?
- Business objectives: Why are we building this?
- Success criteria: How will we measure success?
- Scope: What's included and excluded?

**Example**:
```markdown
## 一、需求概述

本项目旨在构建一个用户管理系统，解决当前系统缺乏用户认证和权限管理的问题。通过实现用户注册、登录、权限控制等功能，确保系统安全性和用户数据隔离。

**业务目标**：
- 支持多用户使用系统
- 保护用户数据安全
- 实现基于角色的权限控制

**成功标准**：
- 用户可以成功注册和登录
- 不同角色用户看到不同功能
- 系统通过安全审计

**范围**：
- 包含：用户注册、登录、权限管理
- 不包含：第三方登录、多因素认证（后续版本）
```

### 二、目标用户 (Target Users)

**Purpose**: Define who will use the system and how.

**What to include**:
- User personas: Who are the users?
- Usage scenarios: When and why will they use it?
- User goals: What do they want to achieve?

**Example**:
```markdown
## 二、目标用户

**主要用户**：
1. **普通用户**：需要注册账号使用系统功能的个人用户
   - 使用场景：首次访问系统时注册账号，后续登录使用
   - 用户目标：快速完成注册，安全访问个人数据

2. **管理员**：负责管理系统用户和权限的运营人员
   - 使用场景：审核用户注册，管理用户权限
   - 用户目标：高效管理用户，确保系统安全
```

### 三、功能需求 (Functional Requirements)

**Purpose**: Define specific features with detailed descriptions and acceptance criteria.

**Feature Description Guidelines**:
- Start with user action: "用户通过..."
- Describe the flow: What happens step by step?
- Specify input and output: What data is involved?
- Include validation rules: What checks are performed?
- Describe success and failure scenarios

**Acceptance Criteria Guidelines**:
- Use checkboxes: `- [ ]`
- Be specific and measurable
- Include exact values: "8-20位" not "足够长"
- Reference standards: "符合RFC 5322标准"
- Cover happy path and error cases
- Make it testable: QA should be able to verify each criterion

**Example**:
```markdown
### 功能1：用户注册
**功能描述**：
用户通过提供邮箱、密码和姓名完成账号注册。系统验证邮箱格式和密码强度，检查邮箱是否已被注册。注册成功后发送验证邮件，用户点击邮件链接完成验证后可登录系统。

**输入**：
- 邮箱地址（必填）
- 密码（必填，8-20位）
- 姓名（必填，1-100字符）

**输出**：
- 注册成功：返回用户ID，发送验证邮件
- 注册失败：返回错误信息（邮箱已存在、格式错误等）

**验收标准**：
- [ ] 用户输入邮箱、密码（8-20位，包含字母和数字）、姓名后点击注册按钮
- [ ] 系统验证邮箱格式正确（符合RFC 5322标准）
- [ ] 系统验证密码强度（至少8位，包含大小写字母和数字）
- [ ] 系统检查邮箱未被注册，若已存在则提示"该邮箱已被注册"
- [ ] 注册成功后向用户邮箱发送验证链接
- [ ] 验证链接有效期为24小时
- [ ] 用户点击验证链接后账号状态变为"已验证"
- [ ] 未验证用户尝试登录时提示"请先验证邮箱"
- [ ] 验证链接过期后提示"链接已过期，请重新发送验证邮件"
```

### 四、非功能需求 (Non-Functional Requirements)

**Purpose**: Define quality attributes and constraints.

**Categories**:
- Performance: Response time, throughput, scalability
- Security: Authentication, authorization, data protection
- Usability: User experience, accessibility
- Reliability: Uptime, error handling
- Maintainability: Code quality, documentation

**Example**:
```markdown
## 四、非功能需求

**性能要求**：
- 注册接口响应时间 < 2秒
- 登录接口响应时间 < 1秒
- 系统支持并发1000用户

**安全要求**：
- 密码使用bcrypt加密存储
- 使用HTTPS传输
- 实施CSRF保护
- 登录失败5次后锁定账号15分钟

**可用性要求**：
- 系统可用性 > 99.9%
- 数据库每日备份
- 支持灾难恢复

**用户体验**：
- 注册流程不超过3步
- 错误提示清晰明确
- 支持移动端响应式设计
```

### 五、优先级 (Priority)

**Purpose**: Define implementation priority for features.

**Priority Levels**:
- **P0 (必须)**: Critical features, system cannot function without them
- **P1 (重要)**: Important features, significantly improve user experience
- **P2 (可选)**: Nice-to-have features, can be deferred

**Example**:
```markdown
## 五、优先级

**P0（必须）**：
- 用户注册
- 用户登录
- 密码加密存储
- 邮箱验证

**P1（重要）**：
- 忘记密码
- 修改密码
- 用户资料编辑

**P2（可选）**：
- 第三方登录（Google, GitHub）
- 多因素认证
- 用户头像上传
```

## Writing Style Guidelines

### Be Specific, Not Vague

❌ **Bad**:
- "系统应该快速响应"
- "界面要用户友好"
- "密码要足够强"

✅ **Good**:
- "注册接口响应时间 < 2秒"
- "注册流程不超过3步，每步都有清晰的提示"
- "密码至少8位，包含大小写字母和数字"

### Use Measurable Terms

❌ **Bad**:
- "支持大量用户"
- "高可用性"
- "良好的性能"

✅ **Good**:
- "支持并发1000用户"
- "系统可用性 > 99.9%"
- "API响应时间 < 1秒"

### Include Edge Cases

Always consider:
- What happens when input is invalid?
- What happens when resources are unavailable?
- What happens when operations fail?
- What happens at boundaries (empty, max, min)?

**Example**:
```markdown
**验收标准**：
- [ ] 邮箱格式正确时通过验证
- [ ] 邮箱格式错误时提示"邮箱格式不正确"
- [ ] 邮箱为空时提示"邮箱不能为空"
- [ ] 邮箱超过255字符时提示"邮箱长度不能超过255字符"
- [ ] 邮箱已被注册时提示"该邮箱已被注册"
```

## Iteration Support

### For 1-n Feature Iterations

When adding features to an existing system:

1. **Reference existing PRD**:
```markdown
# 产品需求文档（PRD）
**版本**：v1.1
**创建时间**：2026-02-03
**项目类型**：1-n功能迭代
**基于版本**：v1.0 (2026-01-15)
```

2. **Mark new vs modified features**:
```markdown
### 功能3：忘记密码 [新增]
**功能描述**：...

### 功能1：用户注册 [修改]
**变更说明**：增加手机号注册方式
**功能描述**：...
```

3. **Note dependencies**:
```markdown
**依赖关系**：
- 忘记密码功能依赖邮件服务（已在v1.0实现）
- 手机号注册依赖短信服务（需新增）
```

## Progressive Workflow

For complex projects, break into phases:

```markdown
## 实施阶段

**第一阶段（MVP）**：
- 用户注册（邮箱）
- 用户登录
- 邮箱验证

**第二阶段**：
- 忘记密码
- 修改密码
- 用户资料编辑

**第三阶段**：
- 第三方登录
- 多因素认证
```

## Common Patterns

### Authentication Features

Typical requirements:
- User registration
- User login
- Email/phone verification
- Password reset
- Session management
- Logout

### CRUD Features

For any entity (users, posts, products):
- Create: Add new entity
- Read: View entity details, list entities
- Update: Edit entity
- Delete: Remove entity (soft delete vs hard delete)

### Search Features

Requirements to consider:
- Search criteria (what fields?)
- Search operators (exact, contains, starts with?)
- Sorting options
- Pagination
- Filters
- Search performance

### File Upload Features

Requirements to consider:
- File types allowed
- File size limits
- Storage location
- Virus scanning
- Preview/thumbnail generation
- Download functionality
