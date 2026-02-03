# 虚拟开发团队使用指导手册

**版本**：v1.0
**创建时间**：2026-02-02
**适用场景**：AI智能体应用、全栈系统开发

---

## 一、团队概览

本虚拟开发团队由5个AI Skill组成，模拟真实软件开发团队的协作流程：

| 角色 | Skill文件 | 核心职责 |
|------|-----------|----------|
| 产品经理（PM） | `pm-skill.md` | 需求分析与PRD输出 |
| 架构师（Architect） | `architect-skill.md` | 技术设计与执行计划 |
| 后端工程师（Backend Dev） | `backend-developer-skill.md` | 后端代码实现 |
| 前端工程师（Frontend Dev） | `frontend-developer-skill.md` | 前端代码实现 |
| QA工程师（QA） | `qa-engineer-skill.md` | 质量保证与测试 |

---

## 二、角色详细说明

### 2.1 产品经理（PM）

**核心职责**：
- 通过提问引导用户，深入理解需求
- 将模糊需求转化为清晰的产品需求文档（PRD）
- 定义功能描述和验收标准

**输入**：
- 用户的初始需求描述
- 业务目标和使用场景

**输出**：
- `/docs/requirements/PRD.md`
  - 需求概述
  - 目标用户
  - 功能需求（含验收标准）
  - 优先级

**工作特点**：
- 技术导向，考虑实现可行性
- 提问引导式，不假设需求细节
- 输出详细清晰，避免模糊表述

**调用方式**：
```
请使用PM角色，帮我分析以下需求：[需求描述]
```

---

### 2.2 架构师（Architect）

**核心职责**：
- 设计系统架构和技术方案
- 输出代码级详细设计（类、方法、参数、返回值、异常）
- 定义前后端API契约
- 按功能模块拆分执行计划
- 设计AI智能体的Prompt模板

**输入**：
- `/docs/requirements/PRD.md`

**输出**：
- `/docs/architecture/TechSpec.md` - 技术选型和数据库设计
- `/docs/architecture/SystemArchitecture.md` - 系统架构（含Mermaid图）
- `/docs/architecture/APISpec.md` - 前后端API契约
- `/docs/design/backend/` - 后端设计文档树（按代码结构镜像）
- `/docs/design/frontend/` - 前端设计文档树
- `/docs/design/prompts/` - Prompt模板设计
- `/docs/plans/backend/` - 后端执行计划（按模块拆分）
- `/docs/plans/frontend/` - 前端执行计划（按模块拆分）

**工作特点**：
- 技术激进，倾向于最新稳定技术栈
- 设计精细到方法级别
- 前后端通过APISpec解耦
- 执行计划按模块拆分，最小化上下文

**调用方式**：
```
请使用Architect角色，根据PRD设计技术方案
```

---

### 2.3 后端工程师（Backend Developer）

**核心职责**：
- 严格按照架构师的设计文档实现后端代码
- 编写符合代码风格规范的代码
- 添加中文注释和详细错误日志
- 输出实现报告

**输入**：
- `/docs/plans/backend/{module}.md` - 执行计划
- `/docs/design/backend/` - 设计文档
- `/docs/architecture/APISpec.md` - API规范
- `/docs/standards/code-style-{language}.md` - 代码风格模板

**输出**：
- `/src/backend/` - 后端代码实现
- `/docs/reports/backend-implementation-{module}.md` - 实现报告

**工作特点**：
- 严格按设计实现，不自行修改设计
- 发现设计问题立即通知架构师
- 中文注释，详细日志
- 遵循代码风格模板

**调用方式**：
```
请使用Backend Developer角色，实现用户模块
```

---

### 2.4 前端工程师（Frontend Developer）

**核心职责**：
- 严格按照架构师的设计文档实现前端代码
- 关注UI/UX细节
- 实现响应式设计（移动端优先）
- 性能优化（懒加载、代码分割）
- 输出实现报告

**输入**：
- `/docs/plans/frontend/{module}.md` - 执行计划
- `/docs/design/frontend/` - 设计文档
- `/docs/architecture/APISpec.md` - API规范
- `/docs/standards/code-style-{language}.md` - 代码风格模板

**输出**：
- `/src/frontend/` - 前端代码实现
- `/docs/reports/frontend-implementation-{module}.md` - 实现报告

**工作特点**：
- 严格按设计实现
- UI/UX细节关注（加载、错误、空状态）
- 响应式设计（mobile-first）
- 性能优化（lazy loading, code splitting, memoization）

**调用方式**：
```
请使用Frontend Developer角色，实现用户界面模块
```

---

### 2.5 QA工程师（QA Engineer）

**核心职责**：
- 功能测试（验证PRD验收标准）
- API测试（验证APISpec规范）
- 手工测试和自动化测试结合
- 输出测试用例、测试报告、Bug清单

**输入**：
- `/docs/requirements/PRD.md` - 需求文档
- `/docs/architecture/APISpec.md` - API规范
- `/docs/plans/` - 执行计划
- `/docs/reports/` - 实现报告
- `/src/` - 实现代码

**输出**：
- `/docs/testing/test-cases-{module}.md` - 测试用例文档
- `/docs/testing/test-report-{module}.md` - 测试报告
- `/docs/testing/bug-list-{module}.md` - Bug清单

**工作特点**：
- 验证PRD验收标准
- 验证API响应格式
- 测试边界条件和异常场景
- 清晰的Bug复现步骤和修复建议

**调用方式**：
```
请使用QA Engineer角色，测试用户模块
```

---

## 三、标准作业程序（SOP）

### 3.1 场景A：0-1新项目开发

**完整流程**：

```
用户需求
    ↓
【第1步】PM - 需求分析
    输入：用户描述
    输出：PRD.md
    ↓
【第2步】Architect - 技术设计
    输入：PRD.md
    输出：TechSpec.md, SystemArchitecture.md, APISpec.md,
          设计文档树, 执行计划
    ↓
【第3步】Backend Developer - 后端实现（按模块）
    输入：backend执行计划 + 设计文档
    输出：后端代码 + 实现报告
    ↓
【第4步】Frontend Developer - 前端实现（按模块）
    输入：frontend执行计划 + 设计文档
    输出：前端代码 + 实现报告
    ↓
【第5步】QA Engineer - 测试验证
    输入：PRD + APISpec + 代码
    输出：测试用例 + 测试报告 + Bug清单
    ↓
【第6步】Bug修复（如有）
    Backend/Frontend Developer根据Bug清单修复
    ↓
【第7步】回归测试
    QA Engineer重新测试
    ↓
交付上线
```

**调用示例**：

```bash
# 步骤1：需求分析
> 请使用PM角色，帮我分析一个用户管理系统的需求

# 步骤2：技术设计
> 请使用Architect角色，根据PRD设计技术方案

# 步骤3：后端实现
> 请使用Backend Developer角色，实现用户模块（01-user-module）

# 步骤4：前端实现
> 请使用Frontend Developer角色，实现用户界面模块（01-user-ui）

# 步骤5：测试
> 请使用QA Engineer角色，测试用户模块

# 步骤6：修复Bug（如有）
> 请使用Backend Developer角色，修复Bug #001

# 步骤7：回归测试
> 请使用QA Engineer角色，重新测试用户模块
```

---

### 3.2 场景B：1-n功能迭代

**简化流程**：

```
新功能需求
    ↓
【第1步】PM - 需求分析
    输入：新功能描述
    输出：PRD.md（更新版本）
    ↓
【第2步】Architect - 更新设计
    输入：PRD.md
    输出：更新设计文档 + 新执行计划
    （可能更新APISpec.md）
    ↓
【第3步】Backend/Frontend Developer - 实现
    输入：执行计划 + 设计文档
    输出：代码 + 实现报告
    ↓
【第4步】QA Engineer - 测试
    输入：PRD + 代码
    输出：测试报告 + Bug清单
    ↓
【第5步】修复与回归测试
    ↓
交付上线
```

**调用示例**：

```bash
# 步骤1：需求分析
> 请使用PM角色，分析新增"用户头像上传"功能

# 步骤2：更新设计
> 请使用Architect角色，为"用户头像上传"功能更新设计

# 步骤3：实现
> 请使用Backend Developer角色，实现头像上传功能
> 请使用Frontend Developer角色，实现头像上传UI

# 步骤4：测试
> 请使用QA Engineer角色，测试头像上传功能
```

---

### 3.3 场景C：设计变更流程

当开发工程师发现设计问题时：

```
Backend/Frontend Developer发现设计问题
    ↓
停止实现，通知架构师
    ↓
【Architect】更新设计文档
    更新对应的设计文档
    更新执行计划版本号
    如涉及API变更，更新APISpec.md
    ↓
【Backend/Frontend Developer】继续实现
    基于更新后的设计文档
```

**调用示例**：

```bash
# 开发工程师发现问题
> 我在实现UserService时发现设计文档中未明确邮箱验证token的生成方式，
  请使用Architect角色更新设计

# 架构师更新设计
> [Architect更新UserService.md设计文档]

# 开发工程师继续实现
> 请使用Backend Developer角色，继续实现UserService
```

---

## 四、角色间的输入输出关系

### 4.1 文档流转图

```
PRD.md
  ↓
  ├─→ TechSpec.md
  ├─→ SystemArchitecture.md
  ├─→ APISpec.md ←─────────┐
  ├─→ 设计文档树           │
  └─→ 执行计划             │
       ↓                   │
       ├─→ 后端代码 ────────┤
       ├─→ 前端代码 ────────┘
       └─→ 实现报告
            ↓
            ├─→ 测试用例
            ├─→ 测试报告
            └─→ Bug清单
```

### 4.2 关键文档说明

| 文档 | 创建者 | 使用者 | 作用 |
|------|--------|--------|------|
| PRD.md | PM | Architect, QA | 需求定义和验收标准 |
| TechSpec.md | Architect | Backend Dev, Frontend Dev | 技术选型和数据库设计 |
| SystemArchitecture.md | Architect | Backend Dev, Frontend Dev | 系统架构理解 |
| APISpec.md | Architect | Backend Dev, Frontend Dev, QA | 前后端契约 |
| 设计文档树 | Architect | Backend Dev, Frontend Dev | 代码级实现规范 |
| 执行计划 | Architect | Backend Dev, Frontend Dev | 开发任务和顺序 |
| 实现报告 | Backend/Frontend Dev | QA, Architect | 实现情况和问题 |
| 测试用例 | QA | QA, 开发团队 | 测试覆盖范围 |
| 测试报告 | QA | 全团队 | 质量状态 |
| Bug清单 | QA | Backend/Frontend Dev | 问题修复指引 |

---

## 五、最佳实践

### 5.1 模块化开发

**原则**：按功能模块拆分，降低复杂度

**实践**：
1. 架构师按模块拆分执行计划（如 01-user-module, 02-auth-module）
2. 开发工程师按模块顺序实现
3. QA工程师按模块测试
4. 每个模块独立验收

**优势**：
- 上下文最小化
- 并行开发可能性
- 问题隔离
- 进度可视化

---

### 5.2 设计先行

**原则**：代码实现前必须有详细设计

**实践**：
1. 架构师输出完整设计文档
2. 开发工程师严格按设计实现
3. 发现设计问题立即反馈
4. 更新设计后继续实现

**优势**：
- 减少返工
- 保证一致性
- 便于协作
- 降低沟通成本

---

### 5.3 文档驱动

**原则**：所有协作通过文档进行

**实践**：
1. 每个角色只读取指定的输入文档
2. 每个角色输出标准化文档
3. 文档版本化管理
4. 文档路径固定

**优势**：
- 上下文隔离
- 可追溯性
- 便于异步协作
- 减少误解

---

### 5.4 质量关卡

**原则**：每个阶段都有质量验证

**实践**：
1. PM阶段：用户确认PRD
2. Architect阶段：用户确认设计方案
3. Dev阶段：输出实现报告
4. QA阶段：测试报告和Bug清单
5. 修复后：回归测试

**优势**：
- 早期发现问题
- 降低修复成本
- 保证交付质量

---

## 六、常见问题（FAQ）

### Q1：如何开始一个新项目？

**A**：按照以下顺序调用角色：
```
1. PM角色 → 输出PRD
2. Architect角色 → 输出设计文档和执行计划
3. Backend Developer角色 → 实现后端（按模块）
4. Frontend Developer角色 → 实现前端（按模块）
5. QA Engineer角色 → 测试验证
```

---

### Q2：如何添加新功能？

**A**：
```
1. PM角色 → 更新PRD
2. Architect角色 → 更新设计文档和执行计划
3. Backend/Frontend Developer角色 → 实现新功能
4. QA Engineer角色 → 测试新功能
```

---

### Q3：开发过程中发现设计问题怎么办？

**A**：
```
1. 开发工程师停止实现
2. 通知架构师（在对话中说明问题）
3. Architect角色更新设计文档
4. 开发工程师继续实现
```

---

### Q4：前后端如何协调API？

**A**：
- 前后端通过 `APISpec.md` 解耦
- 架构师定义API契约
- 后端严格按APISpec实现接口
- 前端严格按APISpec调用接口
- 如需修改API，必须由架构师更新APISpec

---

### Q5：如何保证代码质量？

**A**：
1. 架构师提供详细设计（到方法级别）
2. 开发工程师遵循代码风格模板
3. 开发工程师添加中文注释和日志
4. QA工程师全面测试
5. Bug修复后回归测试

---

### Q6：如何处理多个模块的依赖关系？

**A**：
- 架构师在执行计划中明确标注依赖关系
- 按依赖顺序实现模块
- 例如：认证模块依赖用户模块，则先实现用户模块

---

### Q7：测试发现Bug后怎么办？

**A**：
```
1. QA输出Bug清单（含复现步骤和修复建议）
2. Backend/Frontend Developer根据Bug清单修复
3. 开发工程师更新实现报告
4. QA重新测试（回归测试）
5. 确认修复后标记Bug为已解决
```

---

### Q8：如何优化性能？

**A**：
- 架构师在设计阶段考虑性能（数据库索引、缓存策略）
- 前端工程师应用性能优化（懒加载、代码分割、memoization）
- QA工程师可以进行性能测试（如需要）

---

### Q9：代码风格模板在哪里？

**A**：
- 代码风格模板需要预先创建在 `/docs/standards/` 目录
- 例如：`code-style-typescript.md`, `code-style-python.md`
- 开发工程师实现代码时必须遵循对应的模板

---

### Q10：如何管理文档版本？

**A**：
- 每个文档都有版本号（如 v1.0, v1.1）
- 修改文档时更新版本号和更新时间
- 执行计划中引用文档版本
- 便于追溯和回滚

---

## 七、项目目录结构

```
project-root/
├── docs/
│   ├── requirements/
│   │   └── PRD.md                          # PM输出
│   │
│   ├── architecture/
│   │   ├── TechSpec.md                     # Architect输出
│   │   ├── SystemArchitecture.md           # Architect输出
│   │   └── APISpec.md                      # Architect输出
│   │
│   ├── design/                             # Architect输出
│   │   ├── backend/
│   │   │   ├── services/
│   │   │   │   ├── UserService.md
│   │   │   │   └── AuthService.md
│   │   │   ├── repositories/
│   │   │   │   └── UserRepository.md
│   │   │   └── controllers/
│   │   │       └── UserController.md
│   │   │
│   │   ├── frontend/
│   │   │   ├── components/
│   │   │   │   └── UserProfile.md
│   │   │   └── services/
│   │   │       └── UserService.md
│   │   │
│   │   └── prompts/
│   │       └── AgentPrompt.md
│   │
│   ├── plans/                              # Architect输出
│   │   ├── backend/
│   │   │   ├── 01-user-module.md
│   │   │   └── 02-auth-module.md
│   │   │
│   │   └── frontend/
│   │       ├── 01-user-ui.md
│   │       └── 02-auth-ui.md
│   │
│   ├── reports/                            # Developer输出
│   │   ├── backend-implementation-user-module.md
│   │   └── frontend-implementation-user-ui.md
│   │
│   ├── testing/                            # QA输出
│   │   ├── test-cases-user-module.md
│   │   ├── test-report-user-module.md
│   │   └── bug-list-user-module.md
│   │
│   └── standards/                          # 预先创建
│       ├── code-style-typescript.md
│       ├── code-style-python.md
│       └── code-style-java.md
│
└── src/
    ├── backend/                            # Backend Developer输出
    │   ├── services/
    │   ├── repositories/
    │   ├── controllers/
    │   └── models/
    │
    └── frontend/                           # Frontend Developer输出
        ├── components/
        ├── services/
        └── pages/
```

---

## 八、快速开始示例

### 示例：开发一个用户注册功能

**步骤1：需求分析**
```
用户：我需要一个用户注册功能

AI：请使用PM角色，帮我分析用户注册功能的需求

PM：[通过提问收集需求，输出PRD.md]
```

**步骤2：技术设计**
```
用户：根据PRD设计技术方案

AI：请使用Architect角色，根据PRD设计用户注册功能的技术方案

Architect：[输出TechSpec.md, SystemArchitecture.md, APISpec.md,
           设计文档, 执行计划]
```

**步骤3：后端实现**
```
用户：实现后端代码

AI：请使用Backend Developer角色，实现用户模块

Backend Developer：[读取执行计划和设计文档，实现代码，
                   输出实现报告]
```

**步骤4：前端实现**
```
用户：实现前端代码

AI：请使用Frontend Developer角色，实现用户注册界面

Frontend Developer：[读取执行计划和设计文档，实现代码，
                    输出实现报告]
```

**步骤5：测试**
```
用户：测试用户注册功能

AI：请使用QA Engineer角色，测试用户注册功能

QA Engineer：[创建测试用例，执行测试，输出测试报告和Bug清单]
```

**步骤6：修复Bug（如有）**
```
用户：修复Bug #001

AI：请使用Backend Developer角色，修复Bug #001

Backend Developer：[根据Bug清单修复代码]
```

**步骤7：回归测试**
```
用户：重新测试

AI：请使用QA Engineer角色，重新测试用户注册功能

QA Engineer：[执行回归测试，确认Bug已修复]
```

---

## 九、总结

本虚拟开发团队通过5个专业角色的协作，实现了从需求到交付的完整开发流程：

**核心优势**：
1. **角色分工明确**：每个角色专注于自己的职责
2. **文档驱动协作**：通过标准化文档传递信息
3. **设计先行**：代码实现前有详细设计
4. **模块化开发**：降低复杂度，便于并行
5. **质量保证**：每个阶段都有验证机制

**适用场景**：
- 0-1新项目开发
- 1-n功能迭代
- 复杂系统重构
- AI智能体应用开发
- 全栈系统开发

**使用建议**：
1. 严格按照SOP流程执行
2. 不要跳过任何角色
3. 重视文档的完整性和准确性
4. 及时沟通设计问题
5. 保持文档版本化管理

---

**祝你使用愉快！如有问题，请参考本手册的FAQ部分。**
