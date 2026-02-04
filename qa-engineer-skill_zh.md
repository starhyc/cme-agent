--------------------

## name: QA工程师描述：当用户要求"测试代码"、"编写测试"、"创建测试用例"、"QA测试"、"质量保证"、"验证功能"或需要根据PRD和设计文档进行质量保证测试时，应使用此技能版本：1.0.0 ##

# QA工程师技能 #

## 目的： ##

进行全面的质量保证测试，包括功能测试和API测试。将手动测试与自动化测试脚本结合起来。根据PRD验收标准、API规范和设计文档进行验证。输出测试用例文档、测试报告和Bug列表。

## 何时使用此技能 ##

当用户需要以下操作时，使用此技能：

 *  测试实现的功能
 *  对照PRD验证功能
 *  测试API端点
 *  创建测试用例
 *  生成测试报告和bug列表
 *  执行质量保证

## 工作流程 ##

### 第一阶段：阅读需求和规范 ###

阅读所有相关文档：

 *  `/docs/requirements/PRD.md`\-了解功能要求和验收标准
 *  `/docs/architecture/APISpec.md`\-了解API规范
 *  `/docs/plans/backend/{module}.md`或`/docs/plans/frontend/{module}.md`\-了解实施范围
 *  `/docs/reports/backend-implementation-{module}.md`或`/docs/reports/frontend-implementation-{module}.md`\-了解实施的内容

### 第二阶段：创建测试用例 ###

根据PRD验收标准和API规范，创建测试用例文档：

 *  功能测试用例（基于PRD）
 *  API测试用例（基于APISpec）
 *  边缘用例测试用例
 *  错误处理测试用例

输出到`/docs/testing/test-cases-{module}.md`

### 第三阶段：执行手动测试 ###

执行手动测试：

 *  测试每个功能需求
 *  测试用户工作流
 *  测试UI/UX（前端）
 *  测试边缘用例
 *  测试错误场景
 *  记录结果

### 第四阶段：执行自动化测试 ###

编写和运行自动化测试脚本：

 *  API集成测试
 *  单元测试（如果需要）
 *  端到端测试（如果需要）
 *  记录测试结果

### 第五阶段：生成测试报告和Bug列表 ###

编译测试结果：

 *  测试报告（通过/失败状态）
 *  包含严重性和详细信息的错误列表
 *  输出到`/docs/testing/test-report-{module}.md`和`/docs/testing/bug-list-{module}.md`

### 第六阶段：与开发人员沟通 ###

如果发现了错误：

 *  向后端或前端开发人员报告bug
 *  提供清晰的再现步骤
 *  等待修复并重新测试

## 测试用例文档格式 ##

```
#测试用例文档：{模块名称}
**版本**：v1.0
**创建时间**：YYYY-MM-DD
**测试范围**：{模块描述}
**PRD参考**：/docs/requirements/PRD.md
**API参考**：/docs/architecture/APISpec.md

##功能测试用例

###用例1：用户注册-正常流程
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

###用例2：用户注册-邮箱已存在
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

###用例3：用户注册-密码强度不足
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

##接口测试用例

###接口用例1:POST/api/v1/users/register-成功注册
**测试目标**：验证注册API正常工作
**请求方法**：POST
**请求URL**：/api/v1/users/register
**请求头**：
```json
{
  "Content-Type": "application/json"
}
```

**请求体：**

```
{
  "email": "test@example.com",
  "password": "SecurePass123",
  "name": "张三"
}
```

**预期响应状态：200预期响应体：**

```
{
  "id": "<UUID>",
  "email": "test@example.com",
  "name": "张三",
  "emailVerified": false,
  "createdAt": "<ISO8601 timestamp>"
}
```

**API规范对应：APISpec.md-POST/api/v1/users/register-响应200**

### API用例2:POST/api/v1/users/register-邮箱已存在 ###

**测试目标：验证重复注册错误处理请求方法：POST请求URL:/api/v1/users/register请求体：**

```
{
  "email": "existing@example.com",
  "password": "SecurePass123",
  "name": "张三"
}
```

**预期响应状态：400预期响应体：**

```
{
  "error": "USER_EXISTS",
  "message": "该邮箱已被注册"
}
```

**API规范对应：APISpec.md-POST/api/v1/users/register-响应400**

### API用例3：获取/api/v1/users/:id -获取用户信息 ###

**测试目标：验证获取用户API请求方法：GET请求URL:/api/v1/users/\{valid-user-id\}请求头：**

```
{
  "Authorization": "Bearer <valid-token>"
}
```

**预期响应状态：200预期响应体：**

```
{
  "id": "<UUID>",
  "email": "test@example.com",
  "name": "张三",
  "emailVerified": true,
  "createdAt": "<ISO8601 timestamp>"
}
```

**API规范对应：APISpec.md-GET/api/v1/users/:id-响应200**

## 边界测试用例 ##

### 边界用例1：邮箱格式验证 ###

**测试数据：**

 *  无效邮箱1：无效邮件
 *  无效邮箱2:@example.com
 *  无效邮箱3：测试@
 *  有效邮箱：test@example.com

**预期结果：只有有效邮箱通过验证**

### 边界用例2：密码长度验证 ###

**测试数据：**

 *  过短密码：Pass1（5位）
 *  最短有效密码：Pass1234（8位）
 *  正常密码：SecurePass123（13个位）
 *  过长密码：（21位）

**预期结果：8-20位密码通过验证**

```
##测试报告格式

```markdown
#测试报告：{模块名称}
**版本**：v1.0
**测试时间**：YYYY-MM-DD
**测试人员**：QA Engineer
**测试范围**：{模块描述}
**测试用例文档**：/docs/testing/test-cases-{module}.md

##测试概况
- 总用例数：20
- 通过：18
- 失败：2
- 阻塞：0
- 通过率：90%

##功能测试结果

###用户注册功能
| 用例ID | 用例名称 | 状态 | 备注 |
|--------|----------|------|------|
| TC-001 | 用户注册 - 正常流程 | ✅ 通过 | |
| TC-002 | 用户注册 - 邮箱已存在 | ✅ 通过 | |
| TC-003 | 用户注册 - 密码强度不足 | ❌ 失败 | Bug #001 |
| TC-004 | 用户注册 - 邮箱格式错误 | ✅ 通过 | |

###用户查询功能
| 用例ID | 用例名称 | 状态 | 备注 |
|--------|----------|------|------|
| TC-005 | 获取用户信息 - 正常流程 | ✅ 通过 | |
| TC-006 | 获取用户信息 - 用户不存在 | ❌ 失败 | Bug #002 |
| TC-007 | 获取用户信息 - 未授权 | ✅ 通过 | |

##接口测试结果

### POST /api/v1/users/register
| 场景 | 状态码 | 响应格式 | 状态 | 备注 |
|------|--------|----------|------|------|
| 成功注册 | 200 | ✅ 正确 | ✅ 通过 | |
| 邮箱已存在 | 400 | ✅ 正确 | ✅ 通过 | |
| 密码强度不足 | 400 | ❌ 错误 | ❌ 失败 | Bug #001 |
| 邮箱格式错误 | 400 | ✅ 正确 | ✅ 通过 | |

###获取/api/v1/users/:id
| 场景 | 状态码 | 响应格式 | 状态 | 备注 |
|------|--------|----------|------|------|
| 成功获取 | 200 | ✅ 正确 | ✅ 通过 | |
| 用户不存在 | 404 | ❌ 错误 | ❌ 失败 | Bug #002 |
| 未授权 | 401 | ✅ 正确 | ✅ 通过 | |

##验收标准验证

###PRD功能1：用户注册
| 验收标准 | 状态 | 备注 |
|----------|------|------|
| 用户输入邮箱、密码、姓名后点击注册按钮 | ✅ 通过 | |
| 系统验证邮箱格式正确 | ✅ 通过 | |
| 系统验证密码强度 | ❌ 失败 | Bug #001 |
| 系统检查邮箱未被注册 | ✅ 通过 | |
| 注册成功后发送验证邮件 | ✅ 通过 | |
| 用户点击验证链接后账号状态变为"已验证" | ✅ 通过 | |

##自动化测试结果

###测试脚本执行
```

测试套件：用户模块©POST/api/v1/users/register-成功(245ms)©POST/api/v1/users/register-电子邮件存在(123ms) ✗ POST /api/v1/users/register -弱口令(156ms)©GET/api/v1/users/:id-成功(98ms) ✗ GET /api/v1/users/:id -未找到(87ms)©GET/api/v1/users/:id-未经授权(76ms)

测试：4次通过，2次失败，6次总时间：785ms

```
##错误汇总
发现2个Bug，详见Bug清单：/docs/testing/bug-list-{module}.md

##测试结论
- 核心功能基本正常
- 发现2个需要修复的Bug
- 修复Bug后需要回归测试
- 建议修复后再发布

##下一步
1. 将Bug清单发送给开发团队
2. 等待Bug修复
3. 执行回归测试
4. 验证修复效果
```

## Bug列表格式 ##

```
#错误清单：{模块名称}
**版本**：v1.0
**测试时间**：YYYY-MM-DD
**Bug总数**：2

##错误#001：密码强度验证错误消息不符合规范

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

**实际结果：**

```
{
  "error": "VALIDATION_ERROR",
  "message": "Password validation failed"
}
```

**API规范参考：APISpec.md-POST/api/v1/users/register-响应400测试用例参考：test-cases-user-module.md-TC-003**

**影响范围：**

 *  前端无法正确识别错误类型
 *  错误消息为英文，不符合中文要求

**建议修复方案：修改UserService.ts中的密码验证逻辑，抛出正确的异常类型和中文错误消息**

**相关文件：**

 *  /src/backend/services/UserService.ts
 *  /src/backend/errors/ValidationError.ts

--------------------

## 错误\#002：用户不存在时返回500而非404 ##

**严重程度：高优先级：P0状态：待修复发现时间：2026-02-02**

**所属模块：用户查询影响功能：GET/api/v1/users/:id**

**错误描述：当查询不存在的用户时，API返回500内部错误，而不是404未找到。**

**复现步骤：**

1.  发送获取请求到/api/v1/users/不存在的ID
2.  使用有效的认证令牌
3.  观察响应状态码

**预期结果：**

 *  状态码：404
 *  响应体：

```
{
  "error": "NOT_FOUND",
  "message": "用户不存在"
}
```

**实际结果：**

 *  状态码：500
 *  响应体：

```
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "Cannot read property 'id' of null"
}
```

**API规范参考：APISpec.md-GET/api/v1/users/:id-响应404测试用例参考：test-cases-user-module.md-TC-006**

**影响范围：**

 *  前端无法正确处理用户不存在的情况
 *  暴露了内部实现细节（安全问题）
 *  错误日志中会记录大量500错误

**建议修复方案：在UserController.ts中添加null检查，当用户不存在时返回404**

**相关文件：**

 *  /src/backend/controllers/UserController.ts
 *  /src/backend/services/UserService.ts

**日志信息：**

```
[ERROR] 2026-02-02 10:30:15 - TypeError: Cannot read property 'id' of null
    at UserController.getUser (UserController.ts:45)
```

```
##自动化测试脚本示例

```typescript
//测试/api/user.test.ts
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { UserService } from '../../src/backend/services/UserService';
import { testDb } from '../helpers/testDb';

describe('User API Tests', () => {
  beforeAll(async () => {
    //初始化测试数据库
    await testDb.setup();
  });

  afterAll(async () => {
    //清理测试数据库
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
      //先注册一个用户
      await fetch('/api/v1/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'existing@example.com',
          password: 'SecurePass123',
          name: '张三'
        })
      });

      //尝试用相同邮箱再次注册
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
      //先创建用户
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

      //获取用户信息
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

## 关键原理 ##

1.  **按需求验证：按PRD验收标准和API规范进行测试**
2.  **全面覆盖：测试正常流、边缘用例、错误场景**
3.  **将手动和自动相结合：使用两种方法进行全面测试**
4.  **清晰的文档：提供详细的测试用例、报告和bug描述**
5.  **可操作的错误报告：包括重现步骤、预期结果与实际结果以及建议的修复**
6.  **沟通：用所有必要的上下文向开发人员清楚地报告bug**

## 约束条件 ##

 *  必须先阅读PRD、APISpec和实现报告
 *  必须根据PRD验收标准进行验证
 *  必须验证API响应是否与APISpec匹配
 *  测试前必须创建测试用例文档
 *  必须为bug提供清晰的复现步骤
 *  必须包括错误的严重性和优先级
 *  不要修改代码（开发人员的责任）
 *  没有正当理由，不要跳过测试用例

## 质量检查表 ##

在完成测试之前：

 *  【】测试的所有PRD验收标准
 *  【】测试的所有API端点
 *  【】测试的边缘用例和错误场景
 *  【】已创建测试用例文档
 *  【】生成的测试报告具有通过/失败状态
 *  【】创建的Bug列表，描述清晰
 *  【】报告给开发人员的Bug
 *  【】编写的自动化测试脚本（如果适用）

