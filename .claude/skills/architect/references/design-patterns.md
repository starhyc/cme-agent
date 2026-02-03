# Design Patterns and Best Practices

This file contains common architectural patterns and best practices for designing AI agent applications and full-stack systems.

## Architectural Patterns

### Layered Architecture Pattern

**When to use**: Standard backend applications with clear separation of concerns

**Structure**:
```
Controller Layer → Service Layer → Repository Layer → Model Layer
```

**Benefits**:
- Clear separation of concerns
- Easy to test each layer independently
- Maintainable and scalable

**Example**:
```typescript
// Controller: Handle HTTP requests
class UserController {
  constructor(private userService: UserService) {}

  async register(req, res) {
    const user = await this.userService.createUser(req.body);
    res.json(user);
  }
}

// Service: Business logic
class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(data) {
    // Validation, business rules
    return await this.userRepository.save(data);
  }
}

// Repository: Data access
class UserRepository {
  async save(user) {
    return await db.users.create(user);
  }
}
```

### Microservices Pattern

**When to use**: Large-scale systems with independent modules

**Structure**:
```
API Gateway → [Auth Service, User Service, Agent Service, ...]
```

**Benefits**:
- Independent deployment
- Technology flexibility per service
- Scalability

**Considerations**:
- Increased complexity
- Network latency
- Distributed transactions

### Event-Driven Architecture

**When to use**: Systems with asynchronous workflows, AI agent applications

**Structure**:
```
Event Producer → Message Queue → Event Consumer
```

**Benefits**:
- Loose coupling
- Asynchronous processing
- Scalability

**Example for AI agents**:
```
User Request → Queue → Agent Processor → Response Queue → User
```

## Database Design Patterns

### Single Table Inheritance

**When to use**: Multiple entity types with shared attributes

**Example**:
```sql
CREATE TABLE entities (
  id UUID PRIMARY KEY,
  type VARCHAR(50), -- 'user', 'admin', 'agent'
  email VARCHAR(255),
  role VARCHAR(50), -- only for admin
  capabilities JSONB -- only for agent
);
```

### Separate Tables with Foreign Keys

**When to use**: Entities with distinct attributes

**Example**:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255)
);

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  bio TEXT,
  avatar_url VARCHAR(500)
);
```

### Soft Delete Pattern

**When to use**: Need to preserve deleted records

**Example**:
```sql
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP;
CREATE INDEX idx_users_deleted_at ON users(deleted_at);

-- Query active users
SELECT * FROM users WHERE deleted_at IS NULL;
```

## API Design Patterns

### RESTful API Design

**Principles**:
- Use HTTP methods correctly (GET, POST, PUT, DELETE)
- Use plural nouns for resources
- Use nested routes for relationships
- Version your API

**Example**:
```
GET    /api/v1/users          # List users
POST   /api/v1/users          # Create user
GET    /api/v1/users/:id      # Get user
PUT    /api/v1/users/:id      # Update user
DELETE /api/v1/users/:id      # Delete user
GET    /api/v1/users/:id/posts # Get user's posts
```

### Error Response Pattern

**Standard format**:
```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable message",
  "details": {
    "field": "email",
    "reason": "Invalid format"
  }
}
```

**HTTP Status Codes**:
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (not authenticated)
- 403: Forbidden (not authorized)
- 404: Not Found
- 500: Internal Server Error

### Pagination Pattern

**Cursor-based pagination** (recommended for large datasets):
```
GET /api/v1/users?cursor=abc123&limit=20

Response:
{
  "data": [...],
  "nextCursor": "def456",
  "hasMore": true
}
```

**Offset-based pagination** (simpler, for small datasets):
```
GET /api/v1/users?page=2&limit=20

Response:
{
  "data": [...],
  "page": 2,
  "totalPages": 10,
  "totalItems": 200
}
```

## Frontend Patterns

### Component Composition Pattern

**When to use**: Building reusable UI components

**Example**:
```typescript
// Atomic components
<Button>Click me</Button>
<Input placeholder="Email" />

// Composed components
<LoginForm>
  <Input type="email" />
  <Input type="password" />
  <Button>Login</Button>
</LoginForm>
```

### Container/Presenter Pattern

**When to use**: Separating logic from presentation

**Example**:
```typescript
// Container: Logic
function UserProfileContainer({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  return <UserProfilePresenter user={user} />;
}

// Presenter: UI only
function UserProfilePresenter({ user }) {
  if (!user) return <Loading />;
  return <div>{user.name}</div>;
}
```

### State Management Pattern

**Local state**: Use useState for component-specific state
**Global state**: Use Zustand/Redux for shared state
**Server state**: Use React Query for API data

**Example with Zustand**:
```typescript
// Store
const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null })
}));

// Component
function Profile() {
  const user = useUserStore((state) => state.user);
  return <div>{user?.name}</div>;
}
```

## AI Agent Patterns

### Prompt Template Pattern

**When to use**: Reusable prompts with variables

**Example**:
```typescript
const intentPrompt = (userInput: string) => `
Analyze the user input and classify the intent.

User input: ${userInput}

Return JSON:
{
  "intent": "query | action | chat",
  "confidence": 0.95
}
`;
```

### Context Window Management Pattern

**When to use**: Long conversations that exceed context limits

**Strategy**:
1. Summarize old messages
2. Keep recent messages in full
3. Always keep system prompt

**Example**:
```typescript
function manageContext(messages) {
  const systemPrompt = messages[0];
  const recentMessages = messages.slice(-10);
  const oldMessages = messages.slice(1, -10);

  const summary = summarize(oldMessages);

  return [systemPrompt, summary, ...recentMessages];
}
```

### Tool Use Pattern

**When to use**: AI agents need to call external functions

**Example**:
```typescript
const tools = [
  {
    name: "search_database",
    description: "Search the user database",
    parameters: {
      query: "string",
      limit: "number"
    }
  }
];

// Agent decides to use tool
const toolCall = {
  tool: "search_database",
  arguments: { query: "john@example.com", limit: 10 }
};

// Execute tool
const result = await executeToolCall(toolCall);
```

## Security Patterns

### Authentication Pattern

**JWT-based authentication**:
```typescript
// Login
const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '24h' });

// Verify
const decoded = jwt.verify(token, SECRET);
const user = await getUserById(decoded.userId);
```

### Authorization Pattern

**Role-based access control (RBAC)**:
```typescript
function requireRole(role: string) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    next();
  };
}

// Usage
app.delete('/api/v1/users/:id', requireRole('admin'), deleteUser);
```

### Input Validation Pattern

**Always validate at API boundaries**:
```typescript
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
  name: z.string().min(1).max(100)
});

function validateUser(data) {
  return userSchema.parse(data); // Throws if invalid
}
```

## Performance Patterns

### Caching Pattern

**Redis caching**:
```typescript
async function getUser(userId: string) {
  // Try cache first
  const cached = await redis.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);

  // Fetch from database
  const user = await db.users.findById(userId);

  // Cache for 1 hour
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));

  return user;
}
```

### Database Indexing Pattern

**Index frequently queried fields**:
```sql
-- Index for email lookups
CREATE INDEX idx_users_email ON users(email);

-- Composite index for complex queries
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);

-- Partial index for active users only
CREATE INDEX idx_active_users ON users(email) WHERE deleted_at IS NULL;
```

### Lazy Loading Pattern (Frontend)

**Code splitting**:
```typescript
// Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

// Usage
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
</Suspense>
```

## Technology Stack Recommendations

### Backend

**Modern TypeScript Stack**:
- Language: TypeScript 5.x
- Framework: NestJS 10.x (enterprise) or Fastify 4.x (lightweight)
- Database: PostgreSQL 16.x
- ORM: Prisma 5.x
- Caching: Redis 7.x
- Authentication: JWT with bcrypt

**Python Stack** (for AI-heavy applications):
- Language: Python 3.12
- Framework: FastAPI 0.110.x
- Database: PostgreSQL 16.x
- ORM: SQLAlchemy 2.x
- AI: LangChain, OpenAI SDK

### Frontend

**Modern React Stack**:
- Language: TypeScript 5.x
- Framework: React 18.x
- State: Zustand 4.x (simple) or Redux Toolkit 2.x (complex)
- UI: shadcn/ui + Tailwind CSS
- Build: Vite 5.x
- Routing: React Router 6.x

**Alternative**: Next.js 14.x for SSR/SSG needs

### AI Agent

**Recommended Stack**:
- LLM: Claude 3.5 Sonnet (Anthropic)
- Prompt Management: LangChain or custom
- Vector Database: Pinecone or Weaviate
- Embeddings: OpenAI text-embedding-3-small

## Best Practices Summary

### Design Principles

1. **KISS (Keep It Simple, Stupid)**: Simplest solution that works
2. **DRY (Don't Repeat Yourself)**: Extract common logic
3. **YAGNI (You Aren't Gonna Need It)**: Don't build for hypothetical future
4. **Separation of Concerns**: Each module has one responsibility
5. **Progressive Disclosure**: Reveal complexity only when needed

### Code Quality

1. **Type Safety**: Use TypeScript, define all types
2. **Error Handling**: Handle errors at boundaries, let internal code fail fast
3. **Validation**: Validate at API boundaries only
4. **Testing**: Test business logic, not implementation details
5. **Documentation**: Document why, not what (code should be self-explanatory)

### Performance

1. **Database**: Index frequently queried fields
2. **Caching**: Cache expensive operations
3. **Frontend**: Lazy load, code split, memoize
4. **API**: Use pagination, limit response size
5. **Monitoring**: Log performance metrics

### Security

1. **Authentication**: Use JWT with secure secrets
2. **Authorization**: Implement RBAC
3. **Validation**: Validate all user input
4. **Encryption**: Hash passwords with bcrypt
5. **HTTPS**: Always use HTTPS in production
