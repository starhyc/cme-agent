# Question Guide for Requirements Gathering

This file contains detailed questioning techniques and interaction patterns for effective requirements gathering.

## Question-Driven Approach

The PM role uses a question-driven approach to transform vague user needs into clear requirements. Never assume details—always ask.

## Core Questions Framework

### Initial Discovery Questions

**Purpose**: Understand the big picture before diving into details.

**Questions to ask**:
1. "What problem are you trying to solve?"
2. "Who will use this system?"
3. "When and how will they use it?"
4. "Is this a new project (0-1) or adding to an existing system (1-n)?"
5. "What does success look like?"

**Example interaction**:
```
User: "I need a user management system"

PM: "To understand your requirements better, I need to know:

1. What problem are you trying to solve with user management?
2. Who will be using this system? (end users, admins, both?)
3. Is this for a new project or adding to an existing system?
4. What are the must-have features vs nice-to-have features?"
```

### Feature-Specific Questions

For each feature mentioned, drill down with specific questions.

#### Registration Feature Questions

```
User: "I need user registration"

PM: "To define the registration requirements, I need to understand:

1. What information should users provide during registration?
   - Email only?
   - Email + password + name?
   - Additional fields like phone, address?

2. Should there be email verification or phone verification?
   - Immediate verification required?
   - Can users use the system before verification?

3. What validation rules apply?
   - Password strength requirements?
   - Email format validation?
   - Name length limits?

4. What happens after successful registration?
   - Auto-login?
   - Redirect to a specific page?
   - Show a confirmation message?

5. How should duplicate registrations be handled?
   - Show error immediately?
   - Send email to existing account?

6. Are there any third-party login options needed?
   - Google, GitHub, Facebook?
   - Or just email/password for now?"
```

#### Login Feature Questions

```
User: "Users need to login"

PM: "To define the login requirements:

1. What credentials will users use to login?
   - Email + password?
   - Username + password?
   - Phone + SMS code?

2. What should happen after successful login?
   - Redirect to dashboard?
   - Return to previous page?
   - Show welcome message?

3. How should failed login attempts be handled?
   - Show generic error or specific error (wrong email vs wrong password)?
   - Lock account after X failed attempts?
   - Implement CAPTCHA?

4. Should there be a "Remember me" option?
   - How long should the session last?
   - Different duration for "remember me" vs normal login?

5. What about "Forgot password" functionality?
   - Email reset link?
   - Security questions?
   - SMS verification?"
```

#### Search Feature Questions

```
User: "Users should be able to search"

PM: "To define the search requirements:

1. What should users be able to search for?
   - Which fields? (name, email, description, etc.)
   - Full-text search or exact match?

2. How should search results be displayed?
   - List view or grid view?
   - What information to show in results?
   - How many results per page?

3. Should there be filters or sorting options?
   - Filter by category, date, status?
   - Sort by relevance, date, name?

4. What about search performance?
   - Expected number of records?
   - Acceptable response time?
   - Need for search indexing?

5. Should search support advanced features?
   - Autocomplete/suggestions?
   - Search history?
   - Saved searches?"
```

## Clarification Techniques

### When Requirements Are Vague

❌ **User says**: "Make it user-friendly"

✅ **PM asks**:
```
"When you say 'user-friendly', what specific aspects are important?

1. Should the registration process be simple? (e.g., fewer than 3 steps?)
2. Should error messages be clear and actionable?
3. Should the interface work well on mobile devices?
4. Should there be helpful tooltips or guidance?

Please describe what 'user-friendly' means for your users."
```

❌ **User says**: "It should be fast"

✅ **PM asks**:
```
"To define performance requirements:

1. What operations need to be fast?
   - Page load time?
   - API response time?
   - Search results?

2. What's an acceptable response time?
   - Under 1 second?
   - Under 2 seconds?
   - Under 5 seconds?

3. How many concurrent users should the system support?
   - 10 users?
   - 100 users?
   - 1000+ users?"
```

### When Requirements Conflict

**Scenario**: User wants both "simple registration" and "comprehensive user profiles"

**PM response**:
```
"I notice there might be a tension between these requirements:

1. Simple registration (minimal fields)
2. Comprehensive user profiles (many fields)

We could approach this in a few ways:

Option A: Minimal registration (email + password only), then prompt users to complete their profile later

Option B: Required registration fields (email, password, name), optional profile fields can be added later

Option C: Progressive registration - collect basic info first, then ask for more details over time

Which approach fits your users' needs better?"
```

## Edge Case Discovery

Always ask about edge cases and error scenarios.

### Standard Edge Case Questions

For any feature, ask:

1. **Empty/Null cases**:
   - "What happens if the user doesn't provide [field]?"
   - "What if the search returns no results?"

2. **Boundary cases**:
   - "What's the minimum/maximum length for [field]?"
   - "What if the user uploads a very large file?"

3. **Duplicate cases**:
   - "What if the user tries to register with an existing email?"
   - "What if two users create the same resource simultaneously?"

4. **Permission cases**:
   - "What if a user tries to access something they don't have permission for?"
   - "What if a user's session expires during an operation?"

5. **Failure cases**:
   - "What if the email service is down?"
   - "What if the database connection fails?"
   - "What if the payment gateway times out?"

### Example Edge Case Exploration

```
User: "Users can upload profile pictures"

PM: "For the profile picture upload feature, I need to understand edge cases:

1. File type restrictions:
   - Which formats are allowed? (JPEG, PNG, GIF?)
   - What if user uploads a PDF or video?

2. File size limits:
   - What's the maximum file size? (1MB, 5MB, 10MB?)
   - What error message if file is too large?

3. Image dimensions:
   - Any minimum or maximum dimensions?
   - Should images be automatically resized?

4. Upload failures:
   - What if upload fails midway?
   - Can user retry?
   - Is there a progress indicator?

5. Inappropriate content:
   - Is there content moderation?
   - Can users report inappropriate images?

6. Default behavior:
   - What if user doesn't upload a picture?
   - Is there a default avatar?"
```

## Validation and Confirmation

After gathering requirements, validate understanding.

### Confirmation Template

```
"Let me confirm my understanding of the [feature] requirements:

**Feature**: [Feature Name]

**Description**: [Summarize what the feature does]

**User Flow**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Validation Rules**:
- [Rule 1]
- [Rule 2]

**Success Scenario**: [What happens when everything works]

**Error Scenarios**:
- [Error case 1]: [What happens]
- [Error case 2]: [What happens]

Is this correct? Are there any details I'm missing?"
```

### Example Confirmation

```
"Let me confirm my understanding of the user registration requirements:

**Feature**: User Registration

**Description**: Users can create an account by providing email, password, and name. The system validates input, checks for duplicate emails, and sends a verification email.

**User Flow**:
1. User visits registration page
2. User enters email, password (8-20 chars, letters + numbers), and name
3. User clicks "Register" button
4. System validates input and checks for duplicates
5. System creates account and sends verification email
6. User receives email with verification link
7. User clicks link to verify account

**Validation Rules**:
- Email must be valid format (RFC 5322)
- Password must be 8-20 characters with letters and numbers
- Name must be 1-100 characters
- Email must not already exist in system

**Success Scenario**: Account created, verification email sent, user sees "Please check your email to verify your account" message

**Error Scenarios**:
- Email already exists: Show "This email is already registered"
- Invalid email format: Show "Please enter a valid email address"
- Weak password: Show "Password must be 8-20 characters with letters and numbers"
- Email service down: Show "Registration successful, but verification email could not be sent. Please contact support."

Is this correct? Are there any details I'm missing?"
```

## Prioritization Questions

Help users prioritize features.

### Prioritization Framework

```
"I've identified these features. Let's prioritize them:

**Must-Have (P0)** - System cannot function without these:
- [Feature 1]
- [Feature 2]

**Important (P1)** - Significantly improve user experience:
- [Feature 3]
- [Feature 4]

**Nice-to-Have (P2)** - Can be added later:
- [Feature 5]
- [Feature 6]

Questions to help prioritize:

1. Which features are absolutely required for launch?
2. Which features would users expect as standard?
3. Which features can be deferred to a later version?
4. Are there any dependencies between features?
5. What's the minimum viable product (MVP)?"
```

## Common Interaction Patterns

### Pattern 1: Feature Request → Clarification → Confirmation

```
User: "I need user authentication"

PM: "To define authentication requirements:
1. [Ask clarifying questions]
2. [Gather details]
3. [Explore edge cases]"

User: [Provides answers]

PM: "Let me confirm my understanding:
[Summarize requirements]
Is this correct?"

User: "Yes, that's right"

PM: "Great! I'll document this in the PRD."
```

### Pattern 2: Vague Request → Specific Questions → Concrete Requirements

```
User: "Make it easy to use"

PM: "When you say 'easy to use', what specific aspects matter?
1. [Specific question 1]
2. [Specific question 2]
3. [Specific question 3]"

User: [Provides specific answers]

PM: "Based on your answers, I'll define these concrete requirements:
- [Specific requirement 1]
- [Specific requirement 2]
Does this capture what you meant by 'easy to use'?"
```

### Pattern 3: Feature List → Prioritization → Phased Plan

```
User: "I need features A, B, C, D, E"

PM: "Let's prioritize these features:
[Present prioritization framework]
Which features are must-have for launch?"

User: [Indicates priorities]

PM: "Based on priorities, I suggest this phased approach:
Phase 1 (MVP): [P0 features]
Phase 2: [P1 features]
Phase 3: [P2 features]
Does this work for your timeline?"
```

## Anti-Patterns to Avoid

### ❌ Don't Assume

**Bad**:
```
User: "I need user registration"
PM: "I'll create a PRD with email registration, password requirements, and email verification."
```

**Why bad**: Assumes details without asking. User might want phone registration, social login, or different requirements.

**Good**:
```
User: "I need user registration"
PM: "To define registration requirements, I need to understand:
1. What information should users provide?
2. Should there be verification?
[... more questions]"
```

### ❌ Don't Use Vague Language

**Bad**:
```
"System should be fast and user-friendly"
```

**Good**:
```
"Registration API should respond within 2 seconds"
"Registration process should complete in 3 steps or fewer"
"Error messages should clearly indicate what went wrong and how to fix it"
```

### ❌ Don't Skip Edge Cases

**Bad**:
```
Acceptance criteria:
- [ ] User can register with email and password
```

**Good**:
```
Acceptance criteria:
- [ ] User can register with valid email and password
- [ ] System rejects invalid email format
- [ ] System rejects weak passwords
- [ ] System prevents duplicate email registration
- [ ] System handles email service failures gracefully
```

### ❌ Don't Mix Concerns

**Bad**:
```
"User registration should use React and PostgreSQL"
```

**Why bad**: PM should not specify technical implementation. That's the architect's job.

**Good**:
```
"User registration should support 1000 concurrent users and respond within 2 seconds"
```

## Summary

Effective requirements gathering:
1. **Ask, don't assume**: Use questions to uncover details
2. **Be specific**: Avoid vague language, use measurable terms
3. **Explore edge cases**: Consider errors, boundaries, failures
4. **Confirm understanding**: Summarize and validate with user
5. **Prioritize**: Help user distinguish must-have from nice-to-have
6. **Stay in role**: Focus on WHAT, not HOW (no technical implementation)
