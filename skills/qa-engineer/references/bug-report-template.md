# Bug Report Template

This file contains the bug report format with detailed guidelines and examples.

## Bug Report Structure

```markdown
## Bug #{number}：{简短描述}

**严重程度**：{低/中/高/严重}
**优先级**：{P0/P1/P2}
**状态**：{待修复/修复中/已修复/已验证}
**发现时间**：YYYY-MM-DD

**所属模块**：{模块名称}
**影响功能**：{功能描述或API endpoint}

**Bug描述**：
{详细描述Bug的表现}

**复现步骤**：
1. {步骤1}
2. {步骤2}
3. {步骤3}

**预期结果**：
{应该发生什么}

**实际结果**：
{实际发生了什么}

**API规范参考**：{如适用}
**测试用例参考**：{测试用例ID}

**影响范围**：
- {影响1}
- {影响2}

**建议修复方案**：
{建议的修复方法}

**相关文件**：
- {文件路径1}
- {文件路径2}

**日志信息**：{如适用}
\`\`\`
{日志内容}
\`\`\`
```

## Severity Levels

### 严重 (Critical)
- System crash or data loss
- Security vulnerabilities
- Complete feature failure
- Blocks all users

**Example**: Database connection fails, no one can use the system

### 高 (High)
- Major feature not working
- Incorrect data displayed
- Significant user impact
- No workaround available

**Example**: User registration fails with 500 error

### 中 (Medium)
- Feature partially working
- Minor data issues
- Workaround available
- Affects some users

**Example**: Error message in English instead of Chinese

### 低 (Low)
- Cosmetic issues
- Minor UI problems
- Rare edge cases
- Minimal user impact

**Example**: Button alignment slightly off

## Priority Levels

### P0 (Must Fix)
- Blocks release
- Critical functionality broken
- Security issues
- Data corruption

### P1 (Should Fix)
- Important features affected
- Significant user experience issues
- Should be fixed before release

### P2 (Nice to Fix)
- Minor issues
- Edge cases
- Can be deferred to next release

## Complete Bug Report Examples

### Example 1: API Error Response Bug

```markdown
## Bug #001：密码强度验证错误消息不符合规范

**严重程度**：中
**优先级**：P1
**状态**：待修复
**发现时间**：2026-02-02

**所属模块**：用户注册
**影响功能**：POST /api/v1/users/register

**Bug描述**：
当用户输入弱密码时，API返回的错误消息与APISpec.md规范不一致。错误码和消息都不匹配规范定义。

**复现步骤**：
1. 发送POST请求到 /api/v1/users/register
2. 请求体包含弱密码（如"123456"）
3. 观察响应

**预期结果**：
- 状态码：400
- 响应体：
\`\`\`json
{
  "error": "WEAK_PASSWORD",
  "message": "密码强度不足"
}
\`\`\`

**实际结果**：
- 状态码：400
- 响应体：
\`\`\`json
{
  "error": "VALIDATION_ERROR",
  "message": "Password validation failed"
}
\`\`\`

**API规范参考**：APISpec.md - POST /api/v1/users/register - 响应400
**测试用例参考**：test-cases-user-module.md - TC-003

**影响范围**：
- 前端无法正确识别错误类型，无法显示针对性的错误提示
- 错误消息为英文，不符合中文要求
- 用户体验差，不知道如何修正密码

**建议修复方案**：
1. 修改 UserService.ts 中的密码验证逻辑
2. 抛出 WeakPasswordError 而非 ValidationError
3. 使用中文错误消息："密码强度不足"
4. 在 UserController.ts 中正确映射错误类型到响应

**相关文件**：
- /src/backend/services/UserService.ts (密码验证逻辑)
- /src/backend/controllers/UserController.ts (错误处理)
- /src/backend/errors/WeakPasswordError.ts (可能需要创建)
```

### Example 2: Null Pointer Bug

```markdown
## Bug #002：用户不存在时返回500而非404

**严重程度**：高
**优先级**：P0
**状态**：待修复
**发现时间**：2026-02-02

**所属模块**：用户查询
**影响功能**：GET /api/v1/users/:id

**Bug描述**：
当查询不存在的用户时，API返回500内部错误，而不是404未找到。这是因为代码没有检查null值就直接访问用户对象的属性。

**复现步骤**：
1. 发送GET请求到 /api/v1/users/non-existent-id
2. 使用有效的认证token
3. 观察响应状态码和响应体

**预期结果**：
- 状态码：404
- 响应体：
\`\`\`json
{
  "error": "NOT_FOUND",
  "message": "用户不存在"
}
\`\`\`

**实际结果**：
- 状态码：500
- 响应体：
\`\`\`json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "Cannot read property 'id' of null"
}
\`\`\`

**API规范参考**：APISpec.md - GET /api/v1/users/:id - 响应404
**测试用例参考**：test-cases-user-module.md - TC-006

**影响范围**：
- 前端无法正确处理用户不存在的情况
- 暴露了内部实现细节（安全问题）
- 错误日志中会记录大量500错误，影响监控
- 用户看到不友好的错误消息

**建议修复方案**：
在 UserController.ts 的 getUser 方法中添加null检查：

\`\`\`typescript
async getUser(req: Request, res: Response) {
  const userId = req.params.id;
  const user = await this.userService.getUserById(userId);

  // 添加null检查
  if (!user) {
    return res.status(404).json({
      error: 'NOT_FOUND',
      message: '用户不存在'
    });
  }

  res.json(user);
}
\`\`\`

**相关文件**：
- /src/backend/controllers/UserController.ts:45 (需要添加null检查)
- /src/backend/services/UserService.ts (getUserById方法返回null)

**日志信息**：
\`\`\`
[ERROR] 2026-02-02 10:30:15 - TypeError: Cannot read property 'id' of null
    at UserController.getUser (UserController.ts:45)
    at Layer.handle [as handle_request] (express/lib/router/layer.js:95:5)
    at next (express/lib/router/route.js:137:13)
\`\`\`
```

### Example 3: UI Bug

```markdown
## Bug #003：移动端注册按钮被遮挡

**严重程度**：中
**优先级**：P1
**状态**：待修复
**发现时间**：2026-02-02

**所属模块**：用户注册UI
**影响功能**：注册页面

**Bug描述**：
在移动端（屏幕宽度 < 640px）访问注册页面时，注册按钮被底部导航栏遮挡，用户无法点击。

**复现步骤**：
1. 使用Chrome DevTools切换到移动设备模式（iPhone SE, 375x667）
2. 访问注册页面 http://localhost:3000/register
3. 滚动到页面底部
4. 尝试点击注册按钮

**预期结果**：
- 注册按钮完全可见
- 按钮可以正常点击
- 按钮与底部导航栏有足够间距

**实际结果**：
- 注册按钮下半部分被底部导航栏遮挡
- 无法点击按钮
- 需要横屏才能看到完整按钮

**测试用例参考**：test-cases-user-ui.md - TC-015

**影响范围**：
- 移动端用户无法完成注册
- 影响所有屏幕宽度 < 640px 的设备
- 用户体验极差

**建议修复方案**：
在 RegisterPage.tsx 中为表单容器添加底部内边距：

\`\`\`typescript
<form className="
  pb-20        // 添加底部内边距，避免被导航栏遮挡
  sm:pb-6      // 桌面端使用正常内边距
">
  {/* 表单内容 */}
  <button type="submit">注册</button>
</form>
\`\`\`

**相关文件**：
- /src/frontend/pages/RegisterPage.tsx:67 (表单容器)

**截图**：
[附上移动端截图显示按钮被遮挡]
```

## Writing Good Bug Reports

### Do's

✅ **Be specific**: Include exact values, URLs, error messages
✅ **Provide context**: Environment, browser, user role
✅ **Include steps**: Numbered, reproducible steps
✅ **Show evidence**: Screenshots, logs, network traces
✅ **Suggest fixes**: If you know how to fix it
✅ **Link to specs**: Reference PRD, APISpec, design docs
✅ **Assess impact**: Who is affected, how severely

### Don'ts

❌ **Be vague**: "It doesn't work" - what doesn't work?
❌ **Skip steps**: "Just try to register" - be specific
❌ **Assume knowledge**: Explain what you did
❌ **Mix bugs**: One bug per report
❌ **Blame**: Focus on the issue, not who caused it
❌ **Omit details**: Include all relevant information

## Bug Report Checklist

Before submitting a bug report:
- [ ] Clear, descriptive title
- [ ] Severity and priority assigned
- [ ] Detailed description of the issue
- [ ] Step-by-step reproduction steps
- [ ] Expected vs actual results clearly stated
- [ ] References to specs and test cases
- [ ] Impact analysis included
- [ ] Suggested fix provided (if known)
- [ ] Related files identified
- [ ] Logs or screenshots attached (if applicable)
