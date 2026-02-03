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

## Additional Resources

### Reference Files

For detailed templates and examples:
- **`references/test-case-template.md`** - Complete test case document format
- **`references/test-report-template.md`** - Test report format and guidelines
- **`references/bug-report-template.md`** - Bug report format with examples
- **`references/automated-testing.md`** - Automated test script examples

### Example Files

Working examples in `examples/`:
- **`examples/user-module-testing/`** - Complete testing example for user module

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
