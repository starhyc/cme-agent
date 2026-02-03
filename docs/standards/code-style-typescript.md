# TypeScript 代码风格规范

**版本**：v1.0
**适用范围**：TypeScript/JavaScript 项目（Node.js、React、Vue等）

---

## 一、命名规范

### 1.1 文件命名
- 组件文件：PascalCase（如 `UserProfile.tsx`）
- 工具文件：camelCase（如 `formatDate.ts`）
- 常量文件：camelCase（如 `constants.ts`）
- 类型文件：camelCase（如 `types.ts` 或 `user.types.ts`）

### 1.2 变量命名
```typescript
// 普通变量：camelCase
const userName = 'John';
const isActive = true;

// 常量：UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// 私有变量：以下划线开头（可选）
private _internalState = {};
```

### 1.3 函数命名
```typescript
// 函数：camelCase，动词开头
function getUserById(id: string) { }
function calculateTotal(items: Item[]) { }
function isValidEmail(email: string) { }

// 布尔值返回：is/has/can开头
function isAuthenticated() { }
function hasPermission() { }
function canEdit() { }
```

### 1.4 类命名
```typescript
// 类：PascalCase
class UserService { }
class HttpClient { }

// 接口：PascalCase，可选I前缀
interface User { }
interface IUserRepository { }  // 可选风格

// 类型别名：PascalCase
type UserRole = 'admin' | 'user';
type ApiResponse<T> = { data: T; error?: string };
```

---

## 二、代码格式

### 2.1 缩进和空格
- 使用 **2个空格** 缩进（不使用Tab）
- 运算符两侧加空格
- 逗号后加空格

```typescript
// ✅ 正确
const sum = a + b;
const arr = [1, 2, 3];
function foo(a: number, b: number) { }

// ❌ 错误
const sum=a+b;
const arr=[1,2,3];
function foo(a:number,b:number){ }
```

### 2.2 行长度
- 每行最多 **100个字符**
- 超过时换行，保持可读性

```typescript
// ✅ 正确
const result = await userService.createUser({
  email: 'test@example.com',
  password: 'SecurePass123',
  name: '张三'
});

// ❌ 错误（超过100字符）
const result = await userService.createUser({ email: 'test@example.com', password: 'SecurePass123', name: '张三' });
```

### 2.3 分号
- **必须使用分号**

```typescript
// ✅ 正确
const x = 1;
console.log(x);

// ❌ 错误
const x = 1
console.log(x)
```

### 2.4 引号
- 字符串使用 **单引号**
- JSX属性使用 **双引号**

```typescript
// ✅ 正确
const name = 'John';
const jsx = <div className="container">Hello</div>;

// ❌ 错误
const name = "John";
const jsx = <div className='container'>Hello</div>;
```

---

## 三、类型注解

### 3.1 显式类型注解
```typescript
// ✅ 函数参数和返回值必须有类型
function getUserById(id: string): Promise<User | null> {
  // ...
}

// ✅ 复杂对象需要类型
const config: AppConfig = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

// ✅ 简单变量可以省略（类型推断）
const count = 0;  // 推断为 number
const name = 'John';  // 推断为 string
```

### 3.2 接口 vs 类型别名
```typescript
// 优先使用 interface 定义对象结构
interface User {
  id: string;
  name: string;
  email: string;
}

// 使用 type 定义联合类型、交叉类型
type UserRole = 'admin' | 'user' | 'guest';
type ApiResponse<T> = {
  data: T;
  error?: string;
};
```

### 3.3 泛型
```typescript
// 泛型命名：单个字母（T, K, V）或描述性名称
function identity<T>(value: T): T {
  return value;
}

function mapObject<TKey extends string, TValue>(
  obj: Record<TKey, TValue>
): TValue[] {
  return Object.values(obj);
}
```

---

## 四、注释规范

### 4.1 文件头注释
```typescript
/**
 * 用户服务类
 * 处理用户相关的业务逻辑
 */
```

### 4.2 函数注释
```typescript
/**
 * 创建新用户
 * @param userData 用户创建数据
 * @returns 创建的用户对象（不含密码）
 * @throws UserExistsError 用户已存在
 * @throws ValidationError 数据验证失败
 */
async function createUser(userData: UserCreateDTO): Promise<User> {
  // ...
}
```

### 4.3 行内注释
```typescript
// 验证邮箱格式
this.validationService.validateEmail(userData.email);

// 加密密码（使用bcrypt，salt rounds = 10）
const passwordHash = await this.passwordHasher.hash(userData.password);
```

### 4.4 TODO注释
```typescript
// TODO: 添加邮箱验证功能
// FIXME: 修复并发情况下的竞态条件
// NOTE: 此处逻辑较复杂，需要重构
```

---

## 五、函数和方法

### 5.1 函数长度
- 单个函数不超过 **50行**
- 超过时拆分为多个小函数

### 5.2 参数数量
- 参数不超过 **3个**
- 超过时使用对象参数

```typescript
// ✅ 正确
function createUser(userData: UserCreateDTO) { }

// ❌ 错误（参数过多）
function createUser(email: string, password: string, name: string, age: number) { }
```

### 5.3 箭头函数 vs 普通函数
```typescript
// 简单回调：使用箭头函数
const numbers = [1, 2, 3].map(n => n * 2);

// 需要this绑定：使用普通函数
class MyClass {
  method() {
    // 使用箭头函数保持this绑定
    setTimeout(() => {
      console.log(this);
    }, 1000);
  }
}
```

---

## 六、异步处理

### 6.1 使用 async/await
```typescript
// ✅ 正确
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  return data;
}

// ❌ 错误（使用.then链）
function fetchUser(id: string): Promise<User> {
  return fetch(`/api/users/${id}`)
    .then(response => response.json())
    .then(data => data);
}
```

### 6.2 错误处理
```typescript
// ✅ 正确
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return await response.json();
  } catch (error) {
    logger.error('Error fetching user', { id, error });
    throw error;
  }
}
```

---

## 七、导入导出

### 7.1 导入顺序
```typescript
// 1. 第三方库
import React from 'react';
import { useState, useEffect } from 'react';

// 2. 内部模块（绝对路径）
import { UserService } from '@/services/UserService';
import { logger } from '@/utils/logger';

// 3. 相对路径导入
import { Button } from '../components/Button';
import { formatDate } from './utils';

// 4. 类型导入
import type { User } from '@/types/user';
```

### 7.2 导出方式
```typescript
// 优先使用命名导出
export class UserService { }
export function formatDate() { }

// 默认导出用于组件
export default function UserProfile() { }
```

---

## 八、React/JSX 规范

### 8.1 组件定义
```typescript
// 函数组件：使用箭头函数 + React.FC
export const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  // ...
};

// 或使用普通函数
export function UserProfile({ userId }: UserProfileProps) {
  // ...
}
```

### 8.2 Props类型
```typescript
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
  className?: string;
}
```

### 8.3 Hooks顺序
```typescript
function MyComponent() {
  // 1. useState
  const [count, setCount] = useState(0);

  // 2. useRef
  const inputRef = useRef<HTMLInputElement>(null);

  // 3. useCallback
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  // 4. useMemo
  const expensiveValue = useMemo(() => {
    return computeExpensiveValue(count);
  }, [count]);

  // 5. useEffect
  useEffect(() => {
    // ...
  }, []);

  return <div>{count}</div>;
}
```

---

## 九、错误处理

### 9.1 自定义错误类
```typescript
export class UserExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserExistsError';
  }
}
```

### 9.2 错误日志
```typescript
try {
  await userService.createUser(userData);
} catch (error) {
  logger.error('创建用户失败', {
    userData,
    error: error instanceof Error ? error.message : String(error)
  });
  throw error;
}
```

---

## 十、性能优化

### 10.1 React.memo
```typescript
// 优化组件避免不必要的重渲染
export const UserProfile = React.memo<UserProfileProps>(({ userId }) => {
  // ...
});
```

### 10.2 useCallback 和 useMemo
```typescript
// 缓存函数
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);

// 缓存计算结果
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.id - b.id);
}, [data]);
```

---

## 十一、代码检查工具配置

### 11.1 ESLint配置
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended"
  ],
  "rules": {
    "semi": ["error", "always"],
    "quotes": ["error", "single"],
    "max-len": ["error", { "code": 100 }],
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

### 11.2 Prettier配置
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100,
  "trailingComma": "es5"
}
```

---

## 十二、示例代码

### 完整示例：UserService.ts
```typescript
import { UserRepository } from '../repositories/UserRepository';
import { PasswordHasher } from '../utils/PasswordHasher';
import { EmailService } from '../services/EmailService';
import { ValidationService } from '../services/ValidationService';
import { UserCreateDTO, User } from '../dto/UserDTO';
import { UserExistsError, ValidationError } from '../errors';
import { logger } from '../utils/logger';

/**
 * 用户服务类
 * 处理用户相关的业务逻辑
 */
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly emailService: EmailService,
    private readonly validationService: ValidationService
  ) {}

  /**
   * 创建新用户
   * @param userData 用户创建数据
   * @returns 创建的用户对象（不含密码）
   * @throws UserExistsError 用户已存在
   * @throws ValidationError 数据验证失败
   */
  async createUser(userData: UserCreateDTO): Promise<User> {
    logger.info('开始创建用户', { email: userData.email });

    // 验证邮箱格式
    this.validationService.validateEmail(userData.email);
    logger.debug('邮箱格式验证通过', { email: userData.email });

    // 验证密码强度
    this.validationService.validatePassword(userData.password);
    logger.debug('密码强度验证通过');

    // 检查邮箱是否已注册
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      logger.warn('用户已存在', { email: userData.email });
      throw new UserExistsError('该邮箱已被注册');
    }

    // 加密密码
    const passwordHash = await this.passwordHasher.hash(userData.password);
    logger.debug('密码加密完成');

    // 保存用户
    const savedUser = await this.userRepository.save({
      email: userData.email,
      passwordHash,
      name: userData.name,
      emailVerified: false,
    });
    logger.info('用户保存成功', { userId: savedUser.id });

    // 发送验证邮件
    await this.emailService.sendVerificationEmail(
      savedUser.email,
      this.generateVerificationToken(savedUser.id)
    );

    // 返回用户对象（移除密码字段）
    const { passwordHash: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  /**
   * 生成邮箱验证token
   * @param userId 用户ID
   * @returns JWT token
   */
  private generateVerificationToken(userId: string): string {
    // 实现token生成逻辑
    return '';
  }
}
```

---

**遵循此规范可以保证代码的一致性、可读性和可维护性。**
