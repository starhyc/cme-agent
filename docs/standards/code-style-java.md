# Java 代码风格规范

**版本**：v1.0
**适用范围**：Java 8+ 项目

---

## 一、命名规范

### 1.1 包命名
- 全小写，使用点分隔（如 `com.example.userservice`）

### 1.2 类命名
```java
// 类：PascalCase
public class UserService { }
public class HttpClient { }

// 接口：PascalCase，可选I前缀
public interface UserRepository { }
public interface IUserRepository { }  // 可选风格

// 抽象类：PascalCase，可选Abstract前缀
public abstract class AbstractUserService { }

// 异常类：以Exception结尾
public class UserExistsException extends RuntimeException { }
```

### 1.3 方法和变量命名
```java
// 方法：camelCase，动词开头
public User getUserById(String id) { }
public double calculateTotal(List<Item> items) { }
public boolean isValidEmail(String email) { }

// 变量：camelCase
String userName = "John";
boolean isActive = true;

// 常量：UPPER_SNAKE_CASE
public static final int MAX_RETRY_COUNT = 3;
public static final String API_BASE_URL = "https://api.example.com";

// 私有字段：camelCase
private String internalState;
```

---

## 二、代码格式

### 2.1 缩进和空格
- 使用 **4个空格** 缩进（不使用Tab）
- 大括号采用 **K&R风格**（左大括号不换行）

```java
// ✅ 正确
public class UserService {
    public void createUser() {
        if (condition) {
            // code
        }
    }
}

// ❌ 错误（Allman风格）
public class UserService
{
    public void createUser()
    {
        if (condition)
        {
            // code
        }
    }
}
```

### 2.2 行长度
- 每行最多 **120个字符**
- 超过时换行

```java
// ✅ 正确
User user = userService.createUser(
    "test@example.com",
    "SecurePass123",
    "张三"
);

// ❌ 错误（超过120字符）
User user = userService.createUser("test@example.com", "SecurePass123", "张三", "18612345678", "北京市");
```

### 2.3 空行
- 类成员之间：1个空行
- 方法之间：1个空行
- 逻辑块之间：1个空行

### 2.4 导入语句
- 不使用通配符导入
- 按字母顺序排列

```java
// ✅ 正确
import java.util.List;
import java.util.Map;
import com.example.User;

// ❌ 错误
import java.util.*;
```

---

## 三、类和接口

### 3.1 类结构顺序
```java
public class UserService {
    // 1. 静态常量
    private static final int MAX_RETRY = 3;

    // 2. 静态变量
    private static UserService instance;

    // 3. 实例变量
    private UserRepository userRepository;
    private PasswordHasher passwordHasher;

    // 4. 构造函数
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 5. 静态方法
    public static UserService getInstance() {
        return instance;
    }

    // 6. 公共方法
    public User createUser(UserCreateDTO userData) {
        // ...
    }

    // 7. 私有方法
    private String generateToken(String userId) {
        // ...
    }
}
```

### 3.2 接口定义
```java
public interface UserRepository {
    User save(User user);
    Optional<User> findById(String id);
    Optional<User> findByEmail(String email);
    void delete(String id);
}
```

---

## 四、注释规范

### 4.1 类注释（Javadoc）
```java
/**
 * 用户服务类
 * 处理用户相关的业务逻辑
 *
 * @author 开发者姓名
 * @version 1.0
 * @since 2026-02-02
 */
public class UserService {
}
```

### 4.2 方法注释（Javadoc）
```java
/**
 * 创建新用户
 *
 * @param userData 用户创建数据
 * @return 创建的用户对象（不含密码）
 * @throws UserExistsException 用户已存在
 * @throws ValidationException 数据验证失败
 */
public User createUser(UserCreateDTO userData) {
    // ...
}
```

### 4.3 行内注释
```java
// 验证邮箱格式
validationService.validateEmail(userData.getEmail());

// 加密密码（使用BCrypt，strength = 10）
String passwordHash = passwordHasher.hash(userData.getPassword());
```

---

## 五、异常处理

### 5.1 自定义异常
```java
public class UserExistsException extends RuntimeException {
    public UserExistsException(String message) {
        super(message);
    }

    public UserExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

### 5.2 异常处理
```java
try {
    User user = userService.createUser(userData);
    logger.info("用户创建成功: {}", user.getId());
} catch (UserExistsException e) {
    logger.warn("用户已存在: {}", userData.getEmail());
    throw e;
} catch (ValidationException e) {
    logger.error("数据验证失败", e);
    throw e;
} catch (Exception e) {
    logger.error("未知错误", e);
    throw new RuntimeException("创建用户失败", e);
}
```

---

## 六、日志记录

### 6.1 使用SLF4J
```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    public User createUser(UserCreateDTO userData) {
        logger.info("开始创建用户: {}", userData.getEmail());

        try {
            // 业务逻辑
            logger.debug("邮箱格式验证通过: {}", userData.getEmail());
            // ...
            logger.info("用户创建成功: {}", user.getId());
            return user;
        } catch (Exception e) {
            logger.error("创建用户失败: {}", userData.getEmail(), e);
            throw e;
        }
    }
}
```

---

## 七、集合和泛型

### 7.1 泛型使用
```java
// ✅ 正确
List<User> users = new ArrayList<>();
Map<String, User> userMap = new HashMap<>();

// ❌ 错误（原始类型）
List users = new ArrayList();
Map userMap = new HashMap();
```

### 7.2 Optional使用
```java
// ✅ 正确
public Optional<User> getUserById(String id) {
    User user = userRepository.findById(id);
    return Optional.ofNullable(user);
}

// 使用Optional
Optional<User> userOpt = getUserById(id);
userOpt.ifPresent(user -> logger.info("找到用户: {}", user.getName()));
```

---

## 八、Lambda和Stream

### 8.1 Lambda表达式
```java
// 简单Lambda
list.forEach(item -> System.out.println(item));

// 多行Lambda
list.stream()
    .filter(user -> {
        logger.debug("过滤用户: {}", user.getId());
        return user.isActive();
    })
    .collect(Collectors.toList());
```

### 8.2 Stream操作
```java
// ✅ 正确
List<String> emails = users.stream()
    .filter(User::isActive)
    .map(User::getEmail)
    .collect(Collectors.toList());

// 复杂Stream操作换行
List<User> activeUsers = users.stream()
    .filter(user -> user.isActive())
    .filter(user -> user.getAge() > 18)
    .sorted(Comparator.comparing(User::getName))
    .collect(Collectors.toList());
```

---

## 九、依赖注入（Spring）

### 9.1 构造函数注入
```java
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;
    private final EmailService emailService;

    // ✅ 推荐：构造函数注入
    @Autowired
    public UserService(
        UserRepository userRepository,
        PasswordHasher passwordHasher,
        EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.emailService = emailService;
    }
}
```

### 9.2 字段注入（不推荐）
```java
// ❌ 不推荐：字段注入
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
}
```

---

## 十、示例代码

### 完整示例：UserService.java
```java
package com.example.service;

import com.example.dto.UserCreateDTO;
import com.example.entity.User;
import com.example.exception.UserExistsException;
import com.example.exception.ValidationException;
import com.example.repository.UserRepository;
import com.example.util.PasswordHasher;
import com.example.service.EmailService;
import com.example.service.ValidationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * 用户服务类
 * 处理用户相关的业务逻辑
 *
 * @author 开发者姓名
 * @version 1.0
 */
@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;
    private final EmailService emailService;
    private final ValidationService validationService;

    /**
     * 构造函数
     *
     * @param userRepository 用户数据仓库
     * @param passwordHasher 密码加密工具
     * @param emailService 邮件服务
     * @param validationService 验证服务
     */
    public UserService(
        UserRepository userRepository,
        PasswordHasher passwordHasher,
        EmailService emailService,
        ValidationService validationService
    ) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.emailService = emailService;
        this.validationService = validationService;
    }

    /**
     * 创建新用户
     *
     * @param userData 用户创建数据
     * @return 创建的用户对象（不含密码）
     * @throws UserExistsException 用户已存在
     * @throws ValidationException 数据验证失败
     */
    @Transactional
    public User createUser(UserCreateDTO userData) {
        logger.info("开始创建用户: {}", userData.getEmail());

        // 验证邮箱格式
        validationService.validateEmail(userData.getEmail());
        logger.debug("邮箱格式验证通过: {}", userData.getEmail());

        // 验证密码强度
        validationService.validatePassword(userData.getPassword());
        logger.debug("密码强度验证通过");

        // 检查邮箱是否已注册
        Optional<User> existingUser = userRepository.findByEmail(userData.getEmail());
        if (existingUser.isPresent()) {
            logger.warn("用户已存在: {}", userData.getEmail());
            throw new UserExistsException("该邮箱已被注册");
        }

        // 加密密码
        String passwordHash = passwordHasher.hash(userData.getPassword());
        logger.debug("密码加密完成");

        // 创建用户对象
        User user = new User();
        user.setEmail(userData.getEmail());
        user.setPasswordHash(passwordHash);
        user.setName(userData.getName());
        user.setEmailVerified(false);

        // 保存用户
        User savedUser = userRepository.save(user);
        logger.info("用户保存成功: {}", savedUser.getId());

        // 发送验证邮件
        String verificationToken = generateVerificationToken(savedUser.getId());
        emailService.sendVerificationEmail(savedUser.getEmail(), verificationToken);
        logger.info("验证邮件发送成功: {}", savedUser.getId());

        return savedUser;
    }

    /**
     * 根据ID获取用户
     *
     * @param userId 用户ID
     * @return 用户对象（Optional）
     */
    public Optional<User> getUserById(String userId) {
        logger.info("查询用户: {}", userId);

        // 验证UUID格式
        validationService.validateUuid(userId);

        // 查询用户
        Optional<User> user = userRepository.findById(userId);

        if (user.isEmpty()) {
            logger.warn("用户不存在: {}", userId);
        } else {
            logger.info("用户查询成功: {}", userId);
        }

        return user;
    }

    /**
     * 生成邮箱验证token
     *
     * @param userId 用户ID
     * @return JWT token
     */
    private String generateVerificationToken(String userId) {
        // 实现token生成逻辑
        return "";
    }
}
```

---

**遵循此规范可以保证Java代码的一致性、可读性和可维护性。**
