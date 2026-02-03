# Test Report Template

## Test Report: {Module Name}

**Test Date**: YYYY-MM-DD
**Tester**: {Tester Name}
**Module**: {Module Name}
**Version**: {Version Number}

---

## 1. Test Summary

| Metric | Count |
|--------|-------|
| Total Test Cases | X |
| Passed | X |
| Failed | X |
| Blocked | X |
| Pass Rate | X% |

---

## 2. Test Environment

- **Backend**: {URL/Environment}
- **Frontend**: {URL/Environment}
- **Database**: {Database Type/Version}
- **Browser**: {Browser Name/Version} (for frontend)
- **OS**: {Operating System}

---

## 3. Test Execution Details

### 3.1 Functional Tests

| Test Case ID | Test Case Name | Status | Notes |
|--------------|----------------|--------|-------|
| TC-001 | {Test case name} | ✅ Pass | - |
| TC-002 | {Test case name} | ❌ Fail | See Bug #001 |
| TC-003 | {Test case name} | ✅ Pass | - |

### 3.2 API Tests

| API Endpoint | Method | Status | Response Time | Notes |
|--------------|--------|--------|---------------|-------|
| /api/users | GET | ✅ Pass | 120ms | - |
| /api/users | POST | ❌ Fail | - | See Bug #002 |
| /api/users/:id | PUT | ✅ Pass | 95ms | - |

### 3.3 Edge Case Tests

| Test Case ID | Test Case Name | Status | Notes |
|--------------|----------------|--------|-------|
| TC-E01 | {Edge case name} | ✅ Pass | - |
| TC-E02 | {Edge case name} | ❌ Fail | See Bug #003 |

---

## 4. Bugs Found

| Bug ID | Severity | Description | Status |
|--------|----------|-------------|--------|
| BUG-001 | High | {Brief description} | Open |
| BUG-002 | Medium | {Brief description} | Open |
| BUG-003 | Low | {Brief description} | Open |

See detailed bug list: `/docs/testing/bug-list-{module}.md`

---

## 5. PRD Acceptance Criteria Verification

| Requirement ID | Acceptance Criteria | Status | Notes |
|----------------|---------------------|--------|-------|
| REQ-001 | {Criteria description} | ✅ Pass | - |
| REQ-002 | {Criteria description} | ❌ Fail | See Bug #001 |
| REQ-003 | {Criteria description} | ✅ Pass | - |

---

## 6. Test Coverage

- **Functional Coverage**: X% (X out of X requirements tested)
- **API Coverage**: X% (X out of X endpoints tested)
- **Edge Case Coverage**: X% (X out of X edge cases tested)

---

## 7. Issues and Risks

### 7.1 Blocking Issues
- {Issue description and impact}

### 7.2 Known Limitations
- {Limitation description}

### 7.3 Risks
- {Risk description and mitigation}

---

## 8. Recommendations

1. {Recommendation 1}
2. {Recommendation 2}
3. {Recommendation 3}

---

## 9. Conclusion

{Overall assessment of the module quality and readiness for release}

**Release Recommendation**: ✅ Ready / ⚠️ Ready with known issues / ❌ Not ready

---

## Example: User Module Test Report

**Test Date**: 2024-01-15
**Tester**: QA Engineer
**Module**: User Management Module
**Version**: 1.0.0

---

### Test Summary

| Metric | Count |
|--------|-------|
| Total Test Cases | 15 |
| Passed | 12 |
| Failed | 3 |
| Blocked | 0 |
| Pass Rate | 80% |

---

### Test Environment

- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173
- **Database**: PostgreSQL 15
- **Browser**: Chrome 120
- **OS**: macOS 14

---

### Functional Tests

| Test Case ID | Test Case Name | Status | Notes |
|--------------|----------------|--------|-------|
| TC-001 | User registration with valid data | ✅ Pass | - |
| TC-002 | User registration with duplicate email | ❌ Fail | See Bug #001 |
| TC-003 | User login with valid credentials | ✅ Pass | - |
| TC-004 | User profile update | ✅ Pass | - |

---

### API Tests

| API Endpoint | Method | Status | Response Time | Notes |
|--------------|--------|--------|---------------|-------|
| /api/users | GET | ✅ Pass | 85ms | - |
| /api/users | POST | ❌ Fail | - | See Bug #001 |
| /api/users/:id | GET | ✅ Pass | 62ms | - |
| /api/users/:id | PUT | ✅ Pass | 78ms | - |

---

### Bugs Found

| Bug ID | Severity | Description | Status |
|--------|----------|-------------|--------|
| BUG-001 | High | Duplicate email not properly validated | Open |
| BUG-002 | Medium | Error message not user-friendly | Open |
| BUG-003 | Low | Loading spinner missing on profile update | Open |

---

### Conclusion

The User Management Module has 80% pass rate. Three bugs were found, with one high-severity issue that must be fixed before release. After fixing Bug #001, the module should be ready for release.

**Release Recommendation**: ⚠️ Ready with known issues (after fixing Bug #001)
