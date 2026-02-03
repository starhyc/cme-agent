# Go 代码风格规范

**版本**：v1.0
**适用范围**：Go 1.18+ 项目

---

## 一、命名规范

### 1.1 包命名
- 全小写，单个单词（如 `user`, `http`, `service`）
- 不使用下划线或驼峰

```go
// ✅ 正确
package user
package userservice

// ❌ 错误
package User
package user_service
```

### 1.2 文件命名
- 全小写，使用下划线分隔（如 `user_service.go`）

### 1.3 变量和函数命名
```go
// 导出变量/函数：PascalCase（首字母大写）
var MaxRetryCount = 3
func GetUserByID(id string) (*User, error) { }

// 未导出变量/函数：camelCase（首字母小写）
var internalState = ""
func validateEmail(email string) bool { }

// 常量：PascalCase或camelCase
const MaxRetryCount = 3
const apiBaseURL = "https://api.example.com"
```

### 1.4 类型命名
```go
// 结构体：PascalCase
type User struct { }
type UserService struct { }

// 接口：PascalCase，通常以er结尾
type Reader interface { }
type UserRepository interface { }

// 错误变量：以Err开头
var ErrUserExists = errors.New("用户已存在")
var ErrValidation = errors.New("数据验证失败")
```

---

## 二、代码格式

### 2.1 使用gofmt
- **必须使用gofmt格式化代码**
- 使用Tab缩进（gofmt默认）

### 2.2 行长度
- 建议每行不超过 **100个字符**
- 超过时换行

```go
// ✅ 正确
user, err := userService.CreateUser(
    "test@example.com",
    "SecurePass123",
    "张三",
)

// 长函数调用换行
result := someFunction(
    firstParameter,
    secondParameter,
    thirdParameter,
)
```

### 2.3 导入语句
- 使用goimports自动管理
- 分组：标准库、第三方库、本地包

```go
import (
    // 标准库
    "context"
    "fmt"
    "log"

    // 第三方库
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"

    // 本地包
    "github.com/example/project/models"
    "github.com/example/project/services"
)
```

---

## 三、结构体和接口

### 3.1 结构体定义
```go
// User 用户结构体
type User struct {
    ID            string    `json:"id" gorm:"primaryKey"`
    Email         string    `json:"email" gorm:"uniqueIndex"`
    PasswordHash  string    `json:"-" gorm:"not null"`
    Name          string    `json:"name"`
    EmailVerified bool      `json:"emailVerified" gorm:"default:false"`
    CreatedAt     time.Time `json:"createdAt"`
    UpdatedAt     time.Time `json:"updatedAt"`
}
```

### 3.2 接口定义
```go
// UserRepository 用户数据仓库接口
type UserRepository interface {
    Save(ctx context.Context, user *User) error
    FindByID(ctx context.Context, id string) (*User, error)
    FindByEmail(ctx context.Context, email string) (*User, error)
    Delete(ctx context.Context, id string) error
}
```

### 3.3 构造函数
```go
// NewUserService 创建用户服务实例
func NewUserService(
    repo UserRepository,
    hasher PasswordHasher,
    emailSvc EmailService,
) *UserService {
    return &UserService{
        repo:     repo,
        hasher:   hasher,
        emailSvc: emailSvc,
    }
}
```

---

## 四、注释规范

### 4.1 包注释
```go
// Package user 提供用户管理相关功能
// 包括用户创建、查询、更新和删除操作
package user
```

### 4.2 函数注释
```go
// CreateUser 创建新用户
// 参数:
//   - ctx: 上下文
//   - userData: 用户创建数据
// 返回:
//   - *User: 创建的用户对象（不含密码）
//   - error: 错误信息
func (s *UserService) CreateUser(
    ctx context.Context,
    userData *UserCreateDTO,
) (*User, error) {
    // ...
}
```

### 4.3 结构体字段注释
```go
type User struct {
    ID            string    // 用户ID
    Email         string    // 邮箱地址
    PasswordHash  string    // 密码哈希值
    EmailVerified bool      // 邮箱验证状态
}
```

---

## 五、错误处理

### 5.1 错误定义
```go
// 使用errors包定义错误
var (
    ErrUserExists   = errors.New("用户已存在")
    ErrUserNotFound = errors.New("用户不存在")
    ErrValidation   = errors.New("数据验证失败")
)

// 自定义错误类型
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("验证失败 [%s]: %s", e.Field, e.Message)
}
```

### 5.2 错误处理
```go
// ✅ 正确：立即检查错误
user, err := userService.CreateUser(ctx, userData)
if err != nil {
    log.Printf("创建用户失败: %v", err)
    return nil, err
}

// ✅ 使用errors.Is判断错误类型
if errors.Is(err, ErrUserExists) {
    return nil, fmt.Errorf("邮箱已被注册")
}

// ✅ 使用errors.As获取错误详情
var validationErr *ValidationError
if errors.As(err, &validationErr) {
    log.Printf("验证失败: %s", validationErr.Field)
}

// ✅ 包装错误
if err != nil {
    return fmt.Errorf("保存用户失败: %w", err)
}
```

---

## 六、并发处理

### 6.1 Goroutine
```go
// 启动goroutine
go func() {
    // 异步操作
}()

// 使用WaitGroup等待
var wg sync.WaitGroup
for _, item := range items {
    wg.Add(1)
    go func(item Item) {
        defer wg.Done()
        processItem(item)
    }(item)
}
wg.Wait()
```

### 6.2 Channel
```go
// 创建channel
ch := make(chan string, 10)

// 发送数据
ch <- "data"

// 接收数据
data := <-ch

// 关闭channel
close(ch)

// 遍历channel
for data := range ch {
    process(data)
}
```

### 6.3 Context
```go
// 使用context传递取消信号
func (s *UserService) CreateUser(
    ctx context.Context,
    userData *UserCreateDTO,
) (*User, error) {
    // 检查context是否已取消
    select {
    case <-ctx.Done():
        return nil, ctx.Err()
    default:
    }

    // 业务逻辑
    return user, nil
}
```

---

## 七、日志记录

### 7.1 使用结构化日志
```go
import "log/slog"

// 创建logger
logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

// 记录日志
logger.Info("开始创建用户",
    "email", userData.Email,
)

logger.Debug("邮箱格式验证通过",
    "email", userData.Email,
)

logger.Error("创建用户失败",
    "email", userData.Email,
    "error", err,
)
```

---

## 八、测试规范

### 8.1 测试文件命名
- 测试文件：`*_test.go`
- 测试函数：`Test*`
- 基准测试：`Benchmark*`

### 8.2 测试结构
```go
package user

import (
    "context"
    "testing"
)

func TestUserService_CreateUser(t *testing.T) {
    // 准备测试数据
    ctx := context.Background()
    userData := &UserCreateDTO{
        Email:    "test@example.com",
        Password: "SecurePass123",
        Name:     "张三",
    }

    // 创建服务实例
    service := NewUserService(mockRepo, mockHasher, mockEmailSvc)

    // 执行测试
    user, err := service.CreateUser(ctx, userData)

    // 验证结果
    if err != nil {
        t.Fatalf("创建用户失败: %v", err)
    }
    if user.Email != userData.Email {
        t.Errorf("邮箱不匹配: got %s, want %s", user.Email, userData.Email)
    }
}
```

### 8.3 表驱动测试
```go
func TestValidateEmail(t *testing.T) {
    tests := []struct {
        name    string
        email   string
        wantErr bool
    }{
        {"有效邮箱", "test@example.com", false},
        {"无效邮箱-缺少@", "testexample.com", true},
        {"无效邮箱-缺少域名", "test@", true},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            err := validateEmail(tt.email)
            if (err != nil) != tt.wantErr {
                t.Errorf("validateEmail() error = %v, wantErr %v", err, tt.wantErr)
            }
        })
    }
}
```

---

## 九、示例代码

### 完整示例：user_service.go
```go
package service

import (
    "context"
    "errors"
    "fmt"
    "log/slog"

    "github.com/example/project/dto"
    "github.com/example/project/models"
    "github.com/example/project/repository"
)

var (
    ErrUserExists   = errors.New("用户已存在")
    ErrValidation   = errors.New("数据验证失败")
    ErrEmailSend    = errors.New("邮件发送失败")
)

// UserService 用户服务
type UserService struct {
    repo     repository.UserRepository
    hasher   PasswordHasher
    emailSvc EmailService
    validator ValidationService
    logger   *slog.Logger
}

// NewUserService 创建用户服务实例
func NewUserService(
    repo repository.UserRepository,
    hasher PasswordHasher,
    emailSvc EmailService,
    validator ValidationService,
    logger *slog.Logger,
) *UserService {
    return &UserService{
        repo:      repo,
        hasher:    hasher,
        emailSvc:  emailSvc,
        validator: validator,
        logger:    logger,
    }
}

// CreateUser 创建新用户
func (s *UserService) CreateUser(
    ctx context.Context,
    userData *dto.UserCreateDTO,
) (*models.User, error) {
    s.logger.Info("开始创建用户", "email", userData.Email)

    // 验证邮箱格式
    if err := s.validator.ValidateEmail(userData.Email); err != nil {
        s.logger.Warn("邮箱格式验证失败", "email", userData.Email, "error", err)
        return nil, fmt.Errorf("邮箱格式错误: %w", err)
    }
    s.logger.Debug("邮箱格式验证通过", "email", userData.Email)

    // 验证密码强度
    if err := s.validator.ValidatePassword(userData.Password); err != nil {
        s.logger.Warn("密码强度验证失败", "error", err)
        return nil, fmt.Errorf("密码强度不足: %w", err)
    }
    s.logger.Debug("密码强度验证通过")

    // 检查邮箱是否已注册
    existingUser, err := s.repo.FindByEmail(ctx, userData.Email)
    if err != nil && !errors.Is(err, repository.ErrNotFound) {
        s.logger.Error("查询用户失败", "email", userData.Email, "error", err)
        return nil, fmt.Errorf("查询用户失败: %w", err)
    }
    if existingUser != nil {
        s.logger.Warn("用户已存在", "email", userData.Email)
        return nil, ErrUserExists
    }

    // 加密密码
    passwordHash, err := s.hasher.Hash(userData.Password)
    if err != nil {
        s.logger.Error("密码加密失败", "error", err)
        return nil, fmt.Errorf("密码加密失败: %w", err)
    }
    s.logger.Debug("密码加密完成")

    // 创建用户对象
    user := &models.User{
        Email:         userData.Email,
        PasswordHash:  passwordHash,
        Name:          userData.Name,
        EmailVerified: false,
    }

    // 保存用户
    if err := s.repo.Save(ctx, user); err != nil {
        s.logger.Error("保存用户失败", "email", userData.Email, "error", err)
        return nil, fmt.Errorf("保存用户失败: %w", err)
    }
    s.logger.Info("用户保存成功", "userID", user.ID)

    // 发送验证邮件
    token := s.generateVerificationToken(user.ID)
    if err := s.emailSvc.SendVerificationEmail(ctx, user.Email, token); err != nil {
        s.logger.Error("发送验证邮件失败", "userID", user.ID, "error", err)
        return nil, fmt.Errorf("发送验证邮件失败: %w", err)
    }
    s.logger.Info("验证邮件发送成功", "userID", user.ID)

    return user, nil
}

// GetUserByID 根据ID获取用户
func (s *UserService) GetUserByID(
    ctx context.Context,
    userID string,
) (*models.User, error) {
    s.logger.Info("查询用户", "userID", userID)

    // 验证UUID格式
    if err := s.validator.ValidateUUID(userID); err != nil {
        return nil, fmt.Errorf("无效的用户ID: %w", err)
    }

    // 查询用户
    user, err := s.repo.FindByID(ctx, userID)
    if err != nil {
        if errors.Is(err, repository.ErrNotFound) {
            s.logger.Warn("用户不存在", "userID", userID)
            return nil, nil
        }
        s.logger.Error("查询用户失败", "userID", userID, "error", err)
        return nil, fmt.Errorf("查询用户失败: %w", err)
    }

    s.logger.Info("用户查询成功", "userID", userID)
    return user, nil
}

// generateVerificationToken 生成邮箱验证token
func (s *UserService) generateVerificationToken(userID string) string {
    // 实现token生成逻辑
    return ""
}
```

---

## 十、代码检查工具

### 10.1 必备工具
```bash
# gofmt - 代码格式化
gofmt -w .

# goimports - 导入管理
goimports -w .

# golint - 代码检查
golint ./...

# go vet - 静态分析
go vet ./...

# golangci-lint - 综合检查
golangci-lint run
```

### 10.2 golangci-lint配置
```yaml
# .golangci.yml
linters:
  enable:
    - gofmt
    - goimports
    - govet
    - errcheck
    - staticcheck
    - unused
    - gosimple
    - ineffassign

linters-settings:
  gofmt:
    simplify: true
  goimports:
    local-prefixes: github.com/example/project
```

---

**遵循此规范可以保证Go代码的一致性、可读性和可维护性。**
