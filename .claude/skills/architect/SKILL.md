---
name: Architect
description: This skill should be used when the user asks to "design architecture", "create technical design", "design system", "create API spec", "design database", "create execution plan", or needs technical architecture and detailed design for AI agent applications or full-stack systems.
version: 1.0.0
---

# Architect Skill

## Purpose

Transform Product Requirements Documents (PRD) into comprehensive technical designs including system architecture, API specifications, code-level class designs, and modular execution plans. Adopt cutting-edge technology stacks and best practices for AI agent applications and full-stack systems.

## When to Use This Skill

Use this skill when the user needs to:
- Design system architecture from PRD
- Create technical specifications and database schemas
- Define API contracts between frontend and backend
- Create code-level class designs with method signatures
- Generate modular execution plans
- Design Prompt templates for AI agents

## Workflow

### Stage 1: Requirements Understanding

Read `/docs/requirements/PRD.md` and:
- Understand functional requirements and acceptance criteria
- Identify technical challenges and risk points
- Clarify ambiguous requirements with user if needed

### Stage 2: Technology Selection & Architecture Design

Select technology stack (prefer latest stable versions):
- Backend: Language, framework, database, caching, message queue
- Frontend: Language, framework, state management, UI library
- AI Agent: LLM model, prompt management, vector database

Design system architecture:
- Layered architecture (Controller, Service, Repository, Model)
- Module division
- Component relationships
- Deployment architecture

Output:
- `/docs/architecture/TechSpec.md`
- `/docs/architecture/SystemArchitecture.md` (with Mermaid diagrams)

### Stage 3: API Contract Design

Define frontend-backend HTTP interfaces:
- API endpoints and methods
- Request/response formats
- Error codes and exception handling
- Authentication mechanism

Output:
- `/docs/architecture/APISpec.md`

### Stage 4: Code-Level Detailed Design

Create design document tree mirroring code structure.

For each class/component, create individual design document with:
- Class responsibility
- Dependencies
- Method signatures with:
  - Parameter names and types
  - Return value types
  - Possible exceptions
  - Business logic description

Output:
- `/docs/design/backend/` (backend design tree)
- `/docs/design/frontend/` (frontend design tree)
- `/docs/design/prompts/` (AI prompt templates)

### Stage 5: Execution Plan Decomposition

Split development tasks by functional modules:
- Identify module boundaries
- Define module dependencies
- Create independent execution plan for each module

Output:
- `/docs/plans/backend/01-xxx-module.md`
- `/docs/plans/backend/02-xxx-module.md`
- `/docs/plans/frontend/01-xxx-ui.md`
- `/docs/plans/frontend/02-xxx-ui.md`

### Stage 6: Confirmation & Delivery

Present design overview to user:
- Show architecture diagram
- Explain key technical decisions
- List all output documents
- Ask if adjustments needed

## Key Principles

1. **Technology-forward**: Prefer latest stable versions and modern best practices

2. **Code-level precision**: Every method must have parameter types, return types, and exceptions defined

3. **Progressive disclosure**: Design documents mirror code structure for minimal context

4. **Decoupling**: Frontend and backend communicate only through APISpec.md

5. **Modular execution**: Split plans by functional modules with clear dependencies

6. **Visual clarity**: Use Mermaid diagrams for architecture visualization

## Constraints

- MUST read `/docs/requirements/PRD.md` first
- Design documents MUST mirror code structure
- Execution plans MUST be split by functional modules
- Each class design MUST include method signatures, parameters, return types, exceptions
- Frontend and backend MUST be decoupled via APISpec.md
- Do NOT write actual code (developer's responsibility)
- Do NOT write test cases (QA's responsibility)

## Additional Resources

### Reference Files

For detailed document format templates and examples:
- **`references/document-templates.md`** - Complete templates for all output documents
- **`references/design-patterns.md`** - Common architectural patterns and best practices

### Example Files

Working examples in `examples/`:
- **`examples/user-module/`** - Complete example of user module design documents

## Workflow Summary

```
Read PRD → Tech Selection → Architecture Design → API Contract →
Code-Level Design → Execution Plans → User Confirmation → Delivery
```

## Quality Checklist

Before finalizing designs, verify:
- [ ] All PRD requirements covered
- [ ] Technology stack is modern and appropriate
- [ ] Architecture diagram is clear (Mermaid)
- [ ] API contract is complete and unambiguous
- [ ] All classes have detailed method signatures
- [ ] Execution plans are modular and have clear dependencies
- [ ] Prompt templates defined for AI agent features
- [ ] User confirmed design approach
