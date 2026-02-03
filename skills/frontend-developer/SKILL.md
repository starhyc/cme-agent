---
name: Frontend Developer
description: This skill should be used when the user asks to "implement frontend code", "write frontend implementation", "code the frontend", "implement frontend module", "create UI components", or needs to implement frontend code based on architecture design documents.
version: 1.0.0
---

# Frontend Developer Skill

## Purpose

Implement frontend code strictly according to architecture design documents. Follow design specifications precisely, write clean code with Chinese comments, focus on UI/UX details, implement responsive design, optimize performance, and produce implementation reports.

## When to Use This Skill

Use this skill when the user needs to:
- Implement frontend code from design documents
- Code frontend modules following execution plans
- Create UI components, pages, services
- Implement responsive and performant user interfaces

## Workflow

### Stage 1: Read Execution Plan

Read the specified execution plan (e.g., `/docs/plans/frontend/01-user-ui.md`):
- Understand file list to implement
- Understand development sequence and dependencies
- Confirm API calling checklist
- Note UI/UX requirements

### Stage 2: Read Design Documents

Follow execution plan sequence and read design documents one by one:
- Understand each component's responsibility, props, state, methods
- Understand API service methods and data flow
- Understand UI/UX requirements and responsive breakpoints
- If design is unclear or has issues, STOP and notify architect immediately

### Stage 3: Read Code Style Template

Read code style template for the language (e.g., `/docs/standards/code-style-typescript.md`):
- Understand naming conventions
- Understand formatting rules
- Understand comment requirements

### Stage 4: Implement Code

Implement files following execution plan sequence:
- Strictly follow design document's component definitions and method signatures
- Add Chinese comments explaining key logic
- Implement responsive design (mobile-first approach)
- Optimize performance (lazy loading, code splitting, memoization)
- Focus on UI/UX details (animations, transitions, loading states, error states)
- Follow code style template
- Mark completed files in execution plan

### Stage 5: Output Implementation Report

Record implementation details:
- List of implemented files
- Problems encountered and solutions
- Design issues requiring architect confirmation (if any)
- Performance optimizations applied
- Output to `/docs/reports/frontend-implementation-{module-name}.md`

## Key Principles

1. **Strict adherence**: Never deviate from design documents without architect approval

2. **Chinese comments**: All comments in Chinese for clarity

3. **UI/UX focus**: Pay attention to visual details, interactions, and user experience

4. **Responsive design**: Mobile-first approach with proper breakpoints

5. **Performance optimization**: Apply lazy loading, code splitting, and memoization

6. **Problem reporting**: Immediately report design issues to architect

7. **Implementation tracking**: Maintain detailed implementation reports

## Constraints

- MUST read execution plan first
- MUST strictly follow design documents
- MUST stop and notify architect if design issues found
- MUST follow code style templates
- MUST add Chinese comments
- MUST implement responsive design
- MUST optimize performance
- Do NOT write test code (QA's responsibility)
- Do NOT modify API definitions (architect's responsibility)
- Do NOT make design decisions independently

## Additional Resources

### Reference Files

For detailed patterns and guidelines:
- **`references/component-patterns.md`** - React component patterns with Chinese comments
- **`references/responsive-design.md`** - Responsive design guidelines and breakpoints
- **`references/performance-optimization.md`** - Performance optimization techniques
- **`references/state-management.md`** - State management patterns

### Example Files

Working examples in `examples/`:
- **`examples/user-profile/`** - Complete UserProfile component example

## When to Stop and Ask

Stop implementation and notify architect when:
- Design document is unclear or ambiguous
- Design has logical errors or inconsistencies
- Design is missing critical information (props, state, methods)
- Implementation reveals design flaws
- UI/UX requirements conflict with technical constraints
- Performance requirements cannot be met with current design

## Quality Checklist

Before marking implementation complete:
- [ ] All files implemented according to design
- [ ] All component signatures match design exactly
- [ ] Chinese comments added for all components and methods
- [ ] Code style template followed
- [ ] Responsive design implemented (mobile, tablet, desktop)
- [ ] Loading, error, and empty states handled
- [ ] Performance optimizations applied
- [ ] Implementation report created
- [ ] No design deviations without approval
- [ ] All problems documented in report
