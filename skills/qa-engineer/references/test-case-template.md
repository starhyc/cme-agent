# Test Case Template

This file contains the complete test case document format with detailed guidelines.

## Test Case Document Structure

```markdown
# 测试用例文档：{模块名称}
**版本**：v1.0
**创建时间**：YYYY-MM-DD
**测试范围**：{模块描述}
**PRD参考**：/docs/requirements/PRD.md
**API参考**：/docs/architecture/APISpec.md

## 功能测试用例

### 用例1：{功能名称} - {场景}
**测试目标**：{测试目标描述}
**前置条件**：{前置条件}
**测试步骤**：
1. {步骤1}
2. {步骤2}
3. {步骤3}

**预期结果**：
- {预期结果1}
- {预期结果2}

**验收标准对应**：PRD - 功能X - 验收标准Y

## API测试用例

### API用例1：{METHOD} {endpoint} - {场景}
**测试目标**：{测试目标}
**请求方法**：{GET/POST/PUT/DELETE}
**请求URL**：{endpoint}
**请求头**：
\`\`\`json
{
  "Content-Type": "application/json"
}
\`\`\`

**请求体**：
\`\`\`json
{
  "field": "value"
}
\`\`\`

**预期响应状态**：{200/400/404/500}
**预期响应体**：
\`\`\`json
{
  "field": "value"
}
\`\`\`

**API规范对应**：APISpec.md - {METHOD} {endpoint} - 响应{status}

## 边界测试用例

### 边界用例1：{测试项}
**测试数据**：
- 数据1：{描述}
- 数据2：{描述}

**预期结果**：{预期结果}
```

## Functional Test Case Guidelines

### Test Case Components

1. **测试目标**: Clear statement of what is being tested
2. **前置条件**: State that must exist before test execution
3. **测试步骤**: Numbered, sequential steps to execute
4. **预期结果**: Expected outcome after execution
5. **验收标准对应**: Link to PRD acceptance criteria

### Writing Good Test Steps

**Good test steps are**:
- Specific and actionable
- Sequential and numbered
- Include exact values to use
- Clear about what to click/enter/verify

**Example - Good**:
```markdown
**测试步骤**：
1. 访问注册页面 http://localhost:3000/register
2. 在"邮箱"字段输入：test@example.com
3. 在"密码"字段输入：SecurePass123
4. 在"姓名"字段输入：张三
5. 点击"注册"按钮
6. 观察页面显示的消息
```

**Example - Bad**:
```markdown
**测试步骤**：
1. 打开注册页面
2. 填写表单
3. 提交
```

### Test Scenarios to Cover

For each feature, create test cases for:

1. **Happy path**: Normal, expected usage
2. **Error cases**: Invalid input, missing data
3. **Edge cases**: Boundary values, empty states
4. **Duplicate operations**: Repeated actions
5. **Permission cases**: Unauthorized access

### Example: User Registration Test Cases

```markdown
## 功能测试用例

### 用例1：用户注册 - 正常流程
**测试目标**：验证用户可以成功注册
**前置条件**：邮箱test@example.com未注册
**测试步骤**：
1. 访问注册页面
2. 输入有效邮箱：test@example.com
3. 输入有效密码：SecurePass123
4. 输入姓名：张三
5. 点击注册按钮

**预期结果**：
- 注册成功
- 显示消息："注册成功！请查收验证邮件"
- 发送验证邮件到test@example.com
- 数据库中创建用户记录，状态为"未验证"

**验收标准对应**：PRD - 功能1：用户注册 - 验收标准1

### 用例2：用户注册 - 邮箱已存在
**测试目标**：验证系统正确处理重复注册
**前置条件**：邮箱test@example.com已注册
**测试步骤**：
1. 访问注册页面
2. 输入已存在邮箱：test@example.com
3. 输入密码：SecurePass123
4. 输入姓名：李四
5. 点击注册按钮

**预期结果**：
- 注册失败
- 显示错误消息："该邮箱已被注册"
- 不发送邮件
- 数据库中不创建新记录

**验收标准对应**：PRD - 功能1：用户注册 - 验收标准4

### 用例3：用户注册 - 密码强度不足
**测试目标**：验证密码强度验证
**前置条件**：无
**测试步骤**：
1. 访问注册页面
2. 输入有效邮箱：newuser@example.com
3. 输入弱密码：123456
4. 输入姓名：王五
5. 点击注册按钮

**预期结果**：
- 注册失败
- 显示错误消息："密码必须至少8位，包含大小写字母和数字"
- 不发送邮件
- 数据库中不创建记录

**验收标准对应**：PRD - 功能1：用户注册 - 验收标准3

### 用例4：用户注册 - 邮箱格式错误
**测试目标**：验证邮箱格式验证
**前置条件**：无
**测试步骤**：
1. 访问注册页面
2. 输入无效邮箱：invalid-email
3. 输入密码：SecurePass123
4. 输入姓名：赵六
5. 点击注册按钮

**预期结果**：
- 注册失败
- 显示错误消息："请输入有效的邮箱地址"
- 不发送邮件

**验收标准对应**：PRD - 功能1：用户注册 - 验收标准2
```

## API Test Case Guidelines

### API Test Case Components

1. **测试目标**: What API behavior is being tested
2. **请求方法**: HTTP method (GET, POST, PUT, DELETE)
3. **请求URL**: Full endpoint path
4. **请求头**: Required headers
5. **请求体**: Request payload (for POST/PUT)
6. **预期响应状态**: Expected HTTP status code
7. **预期响应体**: Expected response structure and values
8. **API规范对应**: Link to APISpec

### Example: API Test Cases

```markdown
## API测试用例

### API用例1：POST /api/v1/users/register - 成功注册
**测试目标**：验证注册API正常工作
**请求方法**：POST
**请求URL**：/api/v1/users/register
**请求头**：
\`\`\`json
{
  "Content-Type": "application/json"
}
\`\`\`

**请求体**：
\`\`\`json
{
  "email": "test@example.com",
  "password": "SecurePass123",
  "name": "张三"
}
\`\`\`

**预期响应状态**：200
**预期响应体**：
\`\`\`json
{
  "id": "<UUID>",
  "email": "test@example.com",
  "name": "张三",
  "emailVerified": false,
  "createdAt": "<ISO8601 timestamp>"
}
\`\`\`

**API规范对应**：APISpec.md - POST /api/v1/users/register - 响应200

### API用例2：POST /api/v1/users/register - 邮箱已存在
**测试目标**：验证重复注册错误处理
**请求方法**：POST
**请求URL**：/api/v1/users/register
**请求体**：
\`\`\`json
{
  "email": "existing@example.com",
  "password": "SecurePass123",
  "name": "李四"
}
\`\`\`

**预期响应状态**：400
**预期响应体**：
\`\`\`json
{
  "error": "USER_EXISTS",
  "message": "该邮箱已被注册"
}
\`\`\`

**API规范对应**：APISpec.md - POST /api/v1/users/register - 响应400

### API用例3：GET /api/v1/users/:id - 获取用户信息
**测试目标**：验证获取用户API
**请求方法**：GET
**请求URL**：/api/v1/users/{valid-user-id}
**请求头**：
\`\`\`json
{
  "Authorization": "Bearer <valid-token>"
}
\`\`\`

**预期响应状态**：200
**预期响应体**：
\`\`\`json
{
  "id": "<UUID>",
  "email": "test@example.com",
  "name": "张三",
  "emailVerified": true,
  "createdAt": "<ISO8601 timestamp>"
}
\`\`\`

**API规范对应**：APISpec.md - GET /api/v1/users/:id - 响应200

### API用例4：GET /api/v1/users/:id - 用户不存在
**测试目标**：验证用户不存在时的错误处理
**请求方法**：GET
**请求URL**：/api/v1/users/non-existent-id
**请求头**：
\`\`\`json
{
  "Authorization": "Bearer <valid-token>"
}
\`\`\`

**预期响应状态**：404
**预期响应体**：
\`\`\`json
{
  "error": "NOT_FOUND",
  "message": "用户不存在"
}
\`\`\`

**API规范对应**：APISpec.md - GET /api/v1/users/:id - 响应404
```

## Edge Case Test Guidelines

### Common Edge Cases

1. **Empty/Null values**: Empty strings, null, undefined
2. **Boundary values**: Min/max lengths, min/max numbers
3. **Special characters**: Unicode, emojis, SQL injection attempts
4. **Large data**: Very long strings, large files
5. **Concurrent operations**: Multiple users, race conditions

### Example: Edge Case Tests

```markdown
## 边界测试用例

### 边界用例1：邮箱格式验证
**测试数据**：
- 无效邮箱1：invalid-email (缺少@和域名)
- 无效邮箱2：@example.com (缺少用户名)
- 无效邮箱3：test@ (缺少域名)
- 无效邮箱4：test@example (缺少顶级域名)
- 有效邮箱：test@example.com

**预期结果**：只有有效邮箱通过验证，其他显示"请输入有效的邮箱地址"

### 边界用例2：密码长度验证
**测试数据**：
- 过短密码：Pass1 (5位)
- 最短有效密码：Pass1234 (8位)
- 正常密码：SecurePass123 (13位)
- 最长有效密码：(20位，包含大小写字母和数字)
- 过长密码：(21位)

**预期结果**：8-20位密码通过验证，其他显示相应错误消息

### 边界用例3：姓名长度验证
**测试数据**：
- 空姓名：""
- 最短姓名：张 (1字符)
- 正常姓名：张三 (2字符)
- 长姓名：(100字符)
- 超长姓名：(101字符)

**预期结果**：1-100字符姓名通过验证

### 边界用例4：特殊字符处理
**测试数据**：
- SQL注入：' OR '1'='1
- XSS攻击：<script>alert('xss')</script>
- Unicode字符：测试用户🎉
- 换行符：test\nuser

**预期结果**：系统正确转义或拒绝特殊字符，不产生安全漏洞
```

## Best Practices

1. **Link to requirements**: Always reference PRD acceptance criteria
2. **Be specific**: Use exact values, not "valid email" but "test@example.com"
3. **Cover all scenarios**: Happy path, errors, edge cases
4. **Make reproducible**: Anyone should be able to follow steps and get same result
5. **Test one thing**: Each test case should verify one specific behavior
6. **Use realistic data**: Test with data similar to production
