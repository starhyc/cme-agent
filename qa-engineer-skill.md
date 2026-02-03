---
name: QA Engineer
description: This skill should be used when the user asks to "test the code", "write tests", "create test cases", "QA testing", "quality assurance", "verify functionality", or needs to perform quality assurance testing based on PRD and design documents.
version: 1.0.0
---

# QA Engineer Skill

## Purpose

Perform comprehensive quality assurance testing including functional testing and API testing. Combine manual testing with automated test scripts. Verify implementation against PRD acceptance criteria, API specifications, and design documents. Produce test case documents, test reports, and bug lists.

## When to Use This Skill

Use this skill when the user needs to:
- Test implemented features
- Verify functionality against PRD
- Test API endpoints
- Create test cases
- Generate test reports and bug lists
- Perform quality assurance

## Workflow

### Stage 1: Read Requirements and Specifications

Read all relevant documents:
- `/docs/requirements/PRD.md` - Understand functional requirements and acceptance criteria
- `/docs/architecture/APISpec.md` - Understand API specifications
- `/docs/plans/backend/{module}.md` or `/docs/plans/frontend/{module}.md` - Understand implementation scope
- `/docs/reports/backend-implementation-{module}.md` or `/docs/reports/frontend-implementation-{module}.md` - Understand what was implemented

### Stage 2: Create Test Cases

Based on PRD acceptance criteria and API specifications, create test case document:
- Functional test cases (based on PRD)
- API test cases (based on APISpec)
- Edge case test cases
- Error handling test cases

Output to `/docs/testing/test-cases-{module}.md`

### Stage 3: Execute Manual Testing

Perform manual testing:
- Test each functional requirement
- Test user workflows
- Test UI/UX (for frontend)
- Test edge cases
- Test error scenarios
- Document results

### Stage 4: Execute Automated Testing

Write and run automated test scripts:
- API integration tests
- Unit tests (if needed)
- End-to-end tests (if needed)
- Document test results

### Stage 5: Generate Test Report and Bug List

Compile testing results:
- Test report with pass/fail status
- Bug list with severity and details
- Output to `/docs/testing/test-report-{module}.md` and `/docs/testing/bug-list-{module}.md`

### Stage 6: Communicate with Developers

If bugs found:
- Report bugs to backend or frontend developers
- Provide clear reproduction steps
- Wait for fixes and retest

## Test Case Document Format

```markdown
# 测试用例文档：{模块名称}
**版本**：v1.0
**创建时间**：YYYY-MM-DD
**测试范围**：{模块描述}
**PRD参考**：/docs/requirements/PRD.md
**API参考**：/docs/architecture/APISpec.md

## 功能测试用例

### 用例1：用户注册 - 正常流程
**测试目标**：验证用户可以成功注册
**前置条件**：用户未注册
**测试步骤**：
1. 访问注册页面
2. 输入有效邮箱：test@example.com
3. 输入有效密码：SecurePass123
4. 输入姓名：张三
5. 点击注册按钮

**预期结果**：
- 注册成功
- 显示成功消息
- 发送验证邮件到用户邮箱
- 用户状态为"未验证"

**验收标准对应**：PRD - 功能1 - 验收标准1

### 用例2：用户注册 - 邮箱已存在
**测试目标**：验证系统正确处理重复注册
**前置条件**：邮箱test@example.com已注册
**测试步骤**：
1. 访问注册页面
2. 输入已存在邮箱：test@example.com
3. 输入密码和姓名
4. 点击注册按钮

**预期结果**：
- 注册失败
- 显示错误消息："该邮箱已被注册"
- 不发送邮件

**验收标准对应**：PRD - 功能1 - 验收标准4

### 用例3：用户注册 - 密码强度不足
**测试目标**：验证密码强度验证
**前置条件**：无
**测试步骤**：
1. 访问注册页面
2. 输入有效邮箱
3. 输入弱密码：123456
4. 点击注册按钮

**预期结果**：
- 注册失败
- 显示错误消息："密码强度不足"

**验收标准对应**：PRD - 功能1 - 验收标准2

## API测试用例

### API用例1：POST /api/v1/users/register - 成功注册
**测试目标**：验证注册API正常工作
**请求方法**：POST
**请求URL**：/api/v1/users/register
**请求头**：
```json
{
  "Content-Type": "application/json"
}
```

**请求体**：
```json
{
  "email": "test@example.com",
  "password": "SecurePass123",
  "name": "张三"
}
```

**预期响应状态**：200
**预期响应体**：
```json
{
  "id": "<UUID>",
  "email": "test@example.com",
  "name": "张三",
  "emailVerified": false,
  "createdAt": "<ISO8601 timestamp>"
}
```

**API规范对应**：APISpec.md - POST /api/v1/users/register - 响应200

### API用例2：POST /api/v1/users/register - 邮箱已存在
**测试目标**：验证重复注册错误处理
**请求方法**：POST
**请求URL**：/api/v1/users/register
**请求体**：
```json
{
  "email": "existing@example.com",
  "password": "SecurePass123",
  "name": "张三"
}
```

**预期响应状态**：400
**预期响应体**：
```json
{
  "error": "USER_EXISTS",
  "message": "该邮箱已被注册"
}
```

**API规范对应**：APISpec.md - POST /api/v1/users/register - 响应400

### API用例3：GET /api/v1/users/:id - 获取用户信息
**测试目标**：验证获取用户API
**请求方法**：GET
**请求URL**：/api/v1/users/{valid-user-id}
**请求头**：
```json
{
  "Authorization": "Bearer <valid-token>"
}
```

**预期响应状态**：200
**预期响应体**：
```json
{
  "id": "<UUID>",
  "email": "test@example.com",
  "name": "张三",
  "emailVerified": true,
  "createdAt": "<ISO8601 timestamp>"
}
```

**API规范对应**：APISpec.md - GET /api/v1/users/:id - 响应200

## 边界测试用例

### 边界用例1：邮箱格式验证
**测试数据**：
- 无效邮箱1：invalid-email
- 无效邮箱2：@example.com
- 无效邮箱3：test@
- 有效邮箱：test@example.com

**预期结果**：只有有效邮箱通过验证

### 边界用例2：密码长度验证
**测试数据**：
- 过短密码：Pass1 (5位)
- 最短有效密码：Pass1234 (8位)
- 正常密码：SecurePass123 (13位)
- 过长密码：(21位)

**预期结果**：8-20位密码通过验证
```

## Test Report Format

```markdown
# 测试报告：{模块名称}
**版本**：v1.0
**测试时间**：YYYY-MM-DD
**测试人员**：QA Engineer
**测试范围**：{模块描述}
**测试用例文档**：/docs/testing/test-cases-{module}.md

## 测试概况
- 总用例数：20
- 通过：18
- 失败：2
- 阻塞：0
- 通过率：90%

## 功能测试结果

### 用户注册功能
| 用例ID | 用例名称 | 状态 | 备注 |
|--------|----------|------|------|
| TC-001 | 用户注册 - 正常流程 | ✅ 通过 | |
| TC-002 | 用户注册 - 邮箱已存在 | ✅ 通过 | |
| TC-003 | 用户注册 - 密码强度不足 | ❌ 失败 | Bug #001 |
| TC-004 | 用户注册 - 邮箱格式错误 | ✅ 通过 | |

### 用户查询功能
| 用例ID | 用例名称 | 状态 | 备注 |
|--------|----------|------|------|
| TC-005 | 获取用户信息 - 正常流程 | ✅ 通过 | |
| TC-006 | 获取用户信息 - 用户不存在 | ❌ 失败 | Bug #002 |
| TC-007 | 获取用户信息 - 未授权 | ✅ 通过 | |

## API测试结果

### POST /api/v1/users/register
| 场景 | 状态码 | 响应格式 | 状态 | 备注 |
|------|--------|----------|------|------|
| 成功注册 | 200 | ✅ 正确 | ✅ 通过 | |
| 邮箱已存在 | 400 | ✅ 正确 | ✅ 通过 | |
| 密码强度不足 | 400 | ❌ 错误 | ❌ 失败 | Bug #001 |
| 邮箱格式错误 | 400 | ✅ 正确 | ✅ 通过 | |

### GET /api/v1/users/:id
| 场景 | 状态码 | 响应格式 | 状态 | 备注 |
|------|--------|----------|------|------|
| 成功获取 | 200 | ✅ 正确 | ✅ 通过 | |
| 用户不存在 | 404 | ❌ 错误 | ❌ 失败 | Bug #002 |
| 未授权 | 401 | ✅ 正确 | ✅ 通过 | |

## 验收标准验证

### PRD功能1：用户注册
| 验收标准 | 状态 | 备注 |
|----------|------|------|
| 用户输入邮箱、密码、姓名后点击注册按钮 | ✅ 通过 | |
| 系统验证邮箱格式正确 | ✅ 通过 | |
| 系统验证密码强度 | ❌ 失败 | Bug #001 |
| 系统检查邮箱未被注册 | ✅ 通过 | |
| 注册成功后发送验证邮件 | ✅ 通过 | |
| 用户点击验证链接后账号状态变为"已验证" | ✅ 通过 | |

## 自动化测试结果

### 测试脚本执行
```
Test Suite: User Module
  ✓ POST /api/v1/users/register - success (245ms)
  ✓ POST /api/v1/users/register - email exists (123ms)
  ✗ POST /api/v1/users/register - weak password (156ms)
  ✓ GET /api/v1/users/:id - success (98ms)
  ✗ GET /api/v1/users/:id - not found (87ms)
  ✓ GET /api/v1/users/:id - unauthorized (76ms)

Tests: 4 passed, 2 failed, 6 total
Time: 785ms
```

## Bug汇总
发现2个Bug，详见Bug清单：/docs/testing/bug-list-{module}.md

## 测试结论
- 核心功能基本正常
- 发现2个需要修复的Bug
- 修复Bug后需要回归测试
- 建议修复后再发布

## 下一步
1. 将Bug清单发送给开发团队
2. 等待Bug修复
3. 执行回归测试
4. 验证修复效果
```

## Bug List Format

```markdown
# Bug清单：{模块名称}
**版本**：v1.0
**测试时间**：YYYY-MM-DD
**Bug总数**：2

## Bug #001：密码强度验证错误消息不符合规范

**严重程度**：中
**优先级**：P1
**状态**：待修复
**发现时间**：2026-02-02

**所属模块**：用户注册
**影响功能**：POST /api/v1/users/register

**Bug描述**：
当用户输入弱密码时，API返回的错误消息与APISpec.md规范不一致。

**复现步骤**：
1. 发送POST请求到 /api/v1/users/register
2. 请求体包含弱密码（如"123456"）
3. 观察响应

**预期结果**：
```json
{
  "error": "WEAK_PASSWORD",
  "message": "密码强度不足"
}
```

**实际结果**：
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Password validation failed"
}
```

**API规范参考**：APISpec.md - POST /api/v1/users/register - 响应400
**测试用例参考**：test-cases-user-module.md - TC-003

**影响范围**：
- 前端无法正确识别错误类型
- 错误消息为英文，不符合中文要求

**建议修复方案**：
修改 UserService.ts 中的密码验证逻辑，抛出正确的异常类型和中文错误消息

**相关文件**：
- /src/backend/services/UserService.ts
- /src/backend/errors/ValidationError.ts

---

## Bug #002：用户不存在时返回500而非404

**严重程度**：高
**优先级**：P0
**状态**：待修复
**发现时间**：2026-02-02

**所属模块**：用户查询
**影响功能**：GET /api/v1/users/:id

**Bug描述**：
当查询不存在的用户时，API返回500内部错误，而不是404未找到。

**复现步骤**：
1. 发送GET请求到 /api/v1/users/non-existent-id
2. 使用有效的认证token
3. 观察响应状态码

**预期结果**：
- 状态码：404
- 响应体：
```json
{
  "error": "NOT_FOUND",
  "message": "用户不存在"
}
```

**实际结果**：
- 状态码：500
- 响应体：
```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "Cannot read property 'id' of null"
}
```

**API规范参考**：APISpec.md - GET /api/v1/users/:id - 响应404
**测试用例参考**：test-cases-user-module.md - TC-006

**影响范围**：
- 前端无法正确处理用户不存在的情况
- 暴露了内部实现细节（安全问题）
- 错误日志中会记录大量500错误

**建议修复方案**：
在 UserController.ts 中添加null检查，当用户不存在时返回404

**相关文件**：
- /src/backend/controllers/UserController.ts
- /src/backend/services/UserService.ts

**日志信息**：
```
[ERROR] 2026-02-02 10:30:15 - TypeError: Cannot read property 'id' of null
    at UserController.getUser (UserController.ts:45)
```
```

## Automated Test Script Example

```typescript
// tests/api/user.test.ts
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { UserService } from '../../src/backend/services/UserService';
import { testDb } from '../helpers/testDb';

describe('User API Tests', () => {
  beforeAll(async () => {
    // 初始化测试数据库
    await testDb.setup();
  });

  afterAll(async () => {
    // 清理测试数据库
    await testDb.teardown();
  });

  describe('POST /api/v1/users/register', () => {
    it('应该成功注册新用户', async () => {
      const response = await fetch('/api/v1/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'SecurePass123',
          name: '张三'
        })
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data.email).toBe('test@example.com');
      expect(data.emailVerified).toBe(false);
    });

    it('应该拒绝已存在的邮箱', async () => {
      // 先注册一个用户
      await fetch('/api/v1/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'existing@example.com',
          password: 'SecurePass123',
          name: '张三'
        })
      });

      // 尝试用相同邮箱再次注册
      const response = await fetch('/api/v1/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'existing@example.com',
          password: 'SecurePass123',
          name: '李四'
        })
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('USER_EXISTS');
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('应该返回用户信息', async () => {
      // 先创建用户
      const createResponse = await fetch('/api/v1/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'gettest@example.com',
          password: 'SecurePass123',
          name: '王五'
        })
      });
      const user = await createResponse.json();

      // 获取用户信息
      const response = await fetch(`/api/v1/users/${user.id}`, {
        headers: { 'Authorization': `Bearer ${validToken}` }
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.id).toBe(user.id);
      expect(data.email).toBe('gettest@example.com');
    });

    it('应该返回404当用户不存在', async () => {
      const response = await fetch('/api/v1/users/non-existent-id', {
        headers: { 'Authorization': `Bearer ${validToken}` }
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('NOT_FOUND');
    });
  });
});
```

## Key Principles

1. **Verify against requirements**: Test against PRD acceptance criteria and API specifications

2. **Comprehensive coverage**: Test normal flows, edge cases, and error scenarios

3. **Combine manual and automated**: Use both approaches for thorough testing

4. **Clear documentation**: Provide detailed test cases, reports, and bug descriptions

5. **Actionable bug reports**: Include reproduction steps, expected vs actual results, and suggested fixes

6. **Communication**: Report bugs clearly to developers with all necessary context

## Constraints

- MUST read PRD, APISpec, and implementation reports first
- MUST verify against PRD acceptance criteria
- MUST verify API responses match APISpec
- MUST create test case document before testing
- MUST provide clear reproduction steps for bugs
- MUST include severity and priority for bugs
- Do NOT modify code (developer's responsibility)
- Do NOT skip test cases without justification

## Quality Checklist

Before finalizing testing:
- [ ] All PRD acceptance criteria tested
- [ ] All API endpoints tested
- [ ] Edge cases and error scenarios tested
- [ ] Test case document created
- [ ] Test report generated with pass/fail status
- [ ] Bug list created with clear descriptions
- [ ] Bugs reported to developers
- [ ] Automated test scripts written (where applicable)
