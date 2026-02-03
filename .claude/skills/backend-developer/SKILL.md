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

## Additional Resources

### Reference Files

For detailed implementation patterns and templates:
- **`references/code-examples.md`** - Complete code examples with Chinese comments and logging
- **`references/report-template.md`** - Implementation report format and guidelines
- **`references/logging-patterns.md`** - Logging best practices and patterns

### Example Files

Working examples in `examples/`:
- **`examples/user-service/`** - Complete UserService implementation example

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
