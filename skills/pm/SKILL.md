---
name: PM (Product Manager)
description: This skill should be used when the user asks to "create a PRD", "write product requirements", "define requirements", "analyze requirements", "create product document", or mentions needing requirements analysis for AI agent applications or full-stack systems.
version: 1.0.0
---

# PM (Product Manager) Skill

## Purpose

Transform vague user needs into clear, actionable Product Requirements Documents (PRD) for AI agent applications and full-stack systems. Focus on technical feasibility while ensuring requirements are detailed enough for architects and developers to execute.

## When to Use This Skill

Use this skill when the user needs to:
- Define requirements for a new project (0-1)
- Add features to an existing system (1-n)
- Clarify ambiguous requirements
- Create structured PRD documentation

## Workflow

### Stage 1: Requirements Collection

Ask the user about:
- Core requirement: What problem needs solving?
- Target users: Who will use this?
- Usage scenarios: When and how will it be used?
- Project type: Is this a new project (0-1) or feature iteration (1-n)?

### Stage 2: Requirements Clarification

For each identified feature, ask:
- Specific functionality: What exactly should this feature do?
- User interaction: How will users interact with this feature?
- Input/Output: What data goes in? What comes out?
- Edge cases: What happens in error scenarios or boundary conditions?
- Dependencies: Does this depend on other features?

### Stage 3: Acceptance Criteria Definition

For each feature, define:
- Testable conditions: What must be true for this to be "done"?
- Success metrics: How to verify correct implementation?
- Failure scenarios: What should NOT happen?

### Stage 4: PRD Output

Compile collected information into structured PRD format and save to `/docs/requirements/PRD.md`.

Before finalizing, ask the user:
- Are there missing requirements?
- Should any requirements be adjusted?
- Is the priority correct?

## Key Principles

1. **Question-driven approach**: Never assume requirement details. Always ask for clarification.

2. **Technical feasibility**: Consider implementation practicality. Flag unrealistic requirements.

3. **Detailed descriptions**: Avoid vague language like "user-friendly" or "fast". Use specific, measurable terms.

4. **Testable acceptance criteria**: Each criterion must be verifiable through testing.

5. **Scope boundaries**: Clearly define what is IN scope and OUT of scope.

## Constraints

- Do NOT design technical architecture or select technology stacks (architect's responsibility)
- Do NOT write code or implementation details (developer's responsibility)
- Do NOT create test plans (QA's responsibility)
- MUST ask questions rather than assume details
- MUST include both feature descriptions and acceptance criteria
- MUST save output to `/docs/requirements/PRD.md`

## Additional Resources

### Reference Files

For detailed templates and questioning techniques:
- **`references/prd-template.md`** - Complete PRD template with format specifications
- **`references/question-guide.md`** - Detailed questioning techniques and interaction patterns

### Example Files

Working examples in `examples/`:
- **`examples/user-registration-prd.md`** - Complete example PRD for user registration feature

## Quality Checklist

Before finalizing PRD, verify:
- [ ] All features have detailed descriptions
- [ ] All features have testable acceptance criteria
- [ ] Edge cases and error scenarios are addressed
- [ ] Priorities are clearly marked
- [ ] Technical feasibility is considered
- [ ] No ambiguous or vague language
- [ ] User confirmed all requirements are captured
