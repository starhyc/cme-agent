# Test Cases: User Module

**Module**: User Management
**Version**: 1.0.0
**Created**: 2024-01-15

---

## TC-001: User Registration with Valid Data

**Priority**: High
**Type**: Functional

### Preconditions
- User is not logged in
- Email does not exist in system

### Test Steps
1. Navigate to registration page
2. Enter name: "John Doe"
3. Enter email: "john@example.com"
4. Enter password: "Password123!"
5. Click "Register" button

### Expected Results
- User is created successfully
- User is redirected to dashboard
- Welcome message displays user name

### Acceptance Criteria
- REQ-001: System shall allow user registration with valid data

---

## TC-002: User Registration with Duplicate Email

**Priority**: High
**Type**: Functional

### Preconditions
- Email "existing@example.com" already exists in system

### Test Steps
1. Navigate to registration page
2. Enter name: "Jane Doe"
3. Enter email: "existing@example.com"
4. Enter password: "Password123!"
5. Click "Register" button

### Expected Results
- Error message: "邮箱已存在"
- User remains on registration page
- No new user created

### Acceptance Criteria
- REQ-002: System shall prevent duplicate email registration

---

## TC-003: User Login with Valid Credentials

**Priority**: High
**Type**: Functional

### Preconditions
- User exists with email "user@example.com" and password "Password123!"

### Test Steps
1. Navigate to login page
2. Enter email: "user@example.com"
3. Enter password: "Password123!"
4. Click "Login" button

### Expected Results
- User is authenticated
- User is redirected to dashboard
- Session token is stored

### Acceptance Criteria
- REQ-003: System shall authenticate users with valid credentials

---

## API-001: GET /api/users/:id

**Priority**: High
**Type**: API

### Request
```
GET /api/users/123
Authorization: Bearer {token}
```

### Expected Response
```json
{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### Status Code
- 200 OK

### Acceptance Criteria
- API-001: GET /api/users/:id returns user data

---

## API-002: POST /api/users

**Priority**: High
**Type**: API

### Request
```
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

### Expected Response
```json
{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### Status Code
- 201 Created

### Acceptance Criteria
- API-002: POST /api/users creates new user
