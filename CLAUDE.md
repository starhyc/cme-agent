# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Virtual Development Team** framework that uses AI skills to simulate a complete software development team. The framework consists of 5 specialized roles that collaborate through document-driven workflows to build AI agent applications and full-stack systems.

## Team Roles and Skills

The repository contains 5 skill files that define specialized AI roles:

1. **PM (Product Manager)** - `pm-skill.md`
   - Transforms user requirements into detailed PRD documents
   - Uses question-driven approach to clarify ambiguous requirements
   - Outputs: `/docs/requirements/PRD.md`

2. **Architect** - `architect-skill.md`
   - Designs system architecture and technical specifications
   - Creates code-level detailed designs (class, method, parameter level)
   - Defines API contracts between frontend and backend
   - Outputs: Architecture docs, design document trees, execution plans

3. **Backend Developer** - `backend-developer-skill.md`
   - Implements backend code strictly following design documents
   - Uses Chinese comments and detailed error logging
   - Outputs: Backend code + implementation reports

4. **Frontend Developer** - `frontend-developer-skill.md`
   - Implements frontend code with focus on UI/UX and responsive design
   - Applies performance optimizations (lazy loading, code splitting, memoization)
   - Outputs: Frontend code + implementation reports

5. **QA Engineer** - `qa-engineer-skill.md`
   - Performs functional and API testing
   - Verifies against PRD acceptance criteria and API specifications
   - Outputs: Test cases, test reports, bug lists

## Standard Development Workflow

### 0-1 New Project Development

```
User Requirement
    ↓
PM → PRD.md
    ↓
Architect → TechSpec.md, SystemArchitecture.md, APISpec.md, Design Docs, Execution Plans
    ↓
Backend Developer → Backend Code (by module)
    ↓
Frontend Developer → Frontend Code (by module)
    ↓
QA Engineer → Test Cases, Test Reports, Bug Lists
    ↓
Bug Fixes → Regression Testing → Delivery
```

### 1-n Feature Iteration

```
New Feature Request
    ↓
PM → Update PRD.md
    ↓
Architect → Update Design Docs + Execution Plans
    ↓
Backend/Frontend Developer → Implement
    ↓
QA Engineer → Test → Bug Fixes → Delivery
```

## Document Structure

The framework uses a strict document-driven approach:

```
docs/
├── requirements/
│   └── PRD.md                          # PM output
├── architecture/
│   ├── TechSpec.md                     # Technology stack and database design
│   ├── SystemArchitecture.md           # System architecture with Mermaid diagrams
│   └── APISpec.md                      # Frontend-backend API contract
├── design/
│   ├── backend/                        # Backend design tree (mirrors code structure)
│   ├── frontend/                       # Frontend design tree (mirrors code structure)
│   └── prompts/                        # AI agent prompt templates
├── plans/
│   ├── backend/                        # Backend execution plans (by module)
│   └── frontend/                       # Frontend execution plans (by module)
├── reports/
│   ├── backend-implementation-*.md     # Backend implementation reports
│   └── frontend-implementation-*.md    # Frontend implementation reports
├── testing/
│   ├── test-cases-*.md                 # Test case documents
│   ├── test-report-*.md                # Test reports
│   └── bug-list-*.md                   # Bug lists
└── standards/
    ├── code-style-typescript.md        # TypeScript code style template
    ├── code-style-python.md            # Python code style template
    ├── code-style-go.md                # Go code style template
    └── code-style-java.md              # Java code style template
```

## Key Principles

### Design-First Approach
- All code implementation must follow detailed design documents
- Developers stop and notify architect if design issues are found
- Design documents specify classes, methods, parameters, return types, and exceptions

### Document-Driven Collaboration
- Each role reads specific input documents and produces standardized output documents
- Frontend and backend are decoupled through APISpec.md
- All documents are versioned

### Modular Development
- Execution plans are split by functional modules
- Each module has clear dependencies
- Minimizes context and enables parallel development

### Quality Gates
- PM stage: User confirms PRD
- Architect stage: User confirms design
- Dev stage: Implementation reports
- QA stage: Test reports and bug lists
- Post-fix: Regression testing

## Code Style Requirements

### Chinese Comments
All code must include Chinese comments for:
- Class/component purpose
- Method functionality
- Key business logic
- Complex algorithms

### Error Logging
Use logger to record:
- Key operations
- Exception occurrences
- Important state changes
- Debug information

### Performance Optimization (Frontend)
- Lazy load components and routes
- Code splitting for large bundles
- Memoize expensive computations (useMemo, useCallback)
- Optimize re-renders (React.memo)
- Debounce/throttle frequent operations

### Responsive Design (Frontend)
- Mobile-first approach
- Breakpoints: mobile (< 640px), tablet (640px-1024px), desktop (> 1024px)
- Touch-friendly interactions (minimum 44x44px)
- Handle loading, error, and empty states

## Working with This Repository

### To Start a New Project
1. Invoke PM skill to create PRD
2. Invoke Architect skill to design system
3. Invoke Backend Developer skill to implement backend (by module)
4. Invoke Frontend Developer skill to implement frontend (by module)
5. Invoke QA Engineer skill to test

### To Add a Feature
1. Invoke PM skill to update PRD
2. Invoke Architect skill to update design
3. Invoke appropriate Developer skill to implement
4. Invoke QA Engineer skill to test

### When Design Issues Are Found
1. Developer stops implementation
2. Notify architect (describe the issue)
3. Architect updates design documents
4. Developer continues with updated design

## Important Constraints

### PM Constraints
- Do NOT design technical architecture
- Do NOT write code
- MUST ask questions rather than assume details

### Architect Constraints
- MUST read PRD first
- Design documents MUST mirror code structure
- Do NOT write actual code
- Do NOT write test cases

### Developer Constraints
- MUST read execution plan and design documents first
- MUST strictly follow design documents
- MUST stop if design issues found
- Do NOT modify API definitions
- Do NOT make design decisions independently
- Do NOT write test code

### QA Constraints
- MUST verify against PRD acceptance criteria
- MUST verify API responses match APISpec
- MUST provide clear reproduction steps for bugs
- Do NOT modify code

## Reference Documentation

- **Virtual Team Guide**: `virtual-team-guide.md` - Comprehensive guide to the virtual team workflow
- **Code Style Standards**: `docs/standards/code-style-*.md` - Language-specific code style templates
- **Skill Definitions**: `*-skill.md` files - Detailed skill specifications for each role
