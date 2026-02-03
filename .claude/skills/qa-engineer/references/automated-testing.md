# Automated Testing Examples

## API Integration Tests

### Example 1: User API Tests (Jest + Supertest)

```typescript
import request from 'supertest';
import { app } from '../src/app';

describe('User API Tests', () => {
  let userId: string;

  /**
   * 测试用户创建
   */
  test('POST /api/users - 创建用户成功', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        name: 'Test User',
        email: 'test@example.com'
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test User');
    expect(response.body.email).toBe('test@example.com');

    userId = response.body.id;
  });

  /**
   * 测试重复邮箱验证
   */
  test('POST /api/users - 重复邮箱应返回错误', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        name: 'Another User',
        email: 'test@example.com'
      })
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('邮箱已存在');
  });

  /**
   * 测试获取用户
   */
  test('GET /api/users/:id - 获取用户成功', async () => {
    const response = await request(app)
      .get(`/api/users/${userId}`)
      .expect(200);

    expect(response.body.id).toBe(userId);
    expect(response.body.email).toBe('test@example.com');
  });

  /**
   * 测试更新用户
   */
  test('PUT /api/users/:id - 更新用户成功', async () => {
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send({
        name: 'Updated Name'
      })
      .expect(200);

    expect(response.body.name).toBe('Updated Name');
  });

  /**
   * 测试删除用户
   */
  test('DELETE /api/users/:id - 删除用户成功', async () => {
    await request(app)
      .delete(`/api/users/${userId}`)
      .expect(204);

    // 验证用户已删除
    await request(app)
      .get(`/api/users/${userId}`)
      .expect(404);
  });
});
```

### Example 2: Authentication Tests

```typescript
describe('Authentication API Tests', () => {
  /**
   * 测试用户登录
   */
  test('POST /api/auth/login - 登录成功', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@example.com',
        password: 'password123'
      })
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });

  /**
   * 测试错误密码
   */
  test('POST /api/auth/login - 错误密码应返回401', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@example.com',
        password: 'wrongpassword'
      })
      .expect(401);

    expect(response.body.error).toContain('密码错误');
  });

  /**
   * 测试未授权访问
   */
  test('GET /api/profile - 未授权访问应返回401', async () => {
    await request(app)
      .get('/api/profile')
      .expect(401);
  });

  /**
   * 测试授权访问
   */
  test('GET /api/profile - 授权访问成功', async () => {
    // 先登录获取token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@example.com',
        password: 'password123'
      });

    const token = loginResponse.body.token;

    // 使用token访问受保护的路由
    const response = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('email');
  });
});
```

## Frontend Component Tests

### Example 3: React Component Tests (Jest + React Testing Library)

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile Component', () => {
  /**
   * 测试加载状态
   */
  test('显示加载状态', () => {
    render(<UserProfile userId="123" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  /**
   * 测试用户数据显示
   */
  test('显示用户数据', async () => {
    // Mock API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id: '123',
          name: 'Test User',
          email: 'test@example.com'
        })
      })
    ) as jest.Mock;

    render(<UserProfile userId="123" />);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  /**
   * 测试错误状态
   */
  test('显示错误消息', async () => {
    // Mock API error
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('加载失败'))
    ) as jest.Mock;

    render(<UserProfile userId="123" />);

    await waitFor(() => {
      expect(screen.getByText(/加载失败/)).toBeInTheDocument();
    });
  });

  /**
   * 测试用户交互
   */
  test('点击编辑按钮', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id: '123',
          name: 'Test User',
          email: 'test@example.com'
        })
      })
    ) as jest.Mock;

    render(<UserProfile userId="123" />);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', { name: /编辑/ });
    fireEvent.click(editButton);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
```

## End-to-End Tests

### Example 4: E2E Tests (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
  /**
   * 测试完整注册流程
   */
  test('用户注册流程', async ({ page }) => {
    // 访问注册页面
    await page.goto('http://localhost:5173/register');

    // 填写表单
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');

    // 提交表单
    await page.click('button[type="submit"]');

    // 验证跳转到成功页面
    await expect(page).toHaveURL('http://localhost:5173/dashboard');
    await expect(page.locator('text=欢迎, Test User')).toBeVisible();
  });

  /**
   * 测试表单验证
   */
  test('表单验证错误', async ({ page }) => {
    await page.goto('http://localhost:5173/register');

    // 提交空表单
    await page.click('button[type="submit"]');

    // 验证错误消息
    await expect(page.locator('text=姓名不能为空')).toBeVisible();
    await expect(page.locator('text=邮箱不能为空')).toBeVisible();
  });
});
```

## Test Utilities

### Example 5: Test Helper Functions

```typescript
/**
 * 创建测试用户
 */
export async function createTestUser(data?: Partial<User>): Promise<User> {
  const response = await request(app)
    .post('/api/users')
    .send({
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      ...data
    });

  return response.body;
}

/**
 * 清理测试数据
 */
export async function cleanupTestData(): Promise<void> {
  await db.query('DELETE FROM users WHERE email LIKE ?', ['test-%@example.com']);
}

/**
 * 获取认证token
 */
export async function getAuthToken(email: string, password: string): Promise<string> {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email, password });

  return response.body.token;
}
```

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Setup/Teardown**: Use beforeEach/afterEach for test data
3. **Descriptive Names**: Use Chinese comments for test descriptions
4. **Mock External Services**: Don't rely on external APIs
5. **Test Edge Cases**: Include error scenarios and boundary conditions
6. **Fast Execution**: Keep tests fast by mocking when possible
7. **Clear Assertions**: Use specific, meaningful assertions
