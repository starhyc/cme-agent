# API接口规范 (API Specification)

**项目名称**: 问题定位助手 (Problem Diagnosis Assistant)
**文档版本**: 1.0
**创建日期**: 2026-02-03
**作者**: System Architect
**状态**: 待审核

---

## 1. API概述

### 1.1 基本信息

- **Base URL**: `https://api.diagnosis-assistant.internal`
- **协议**: HTTPS
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON
- **字符编码**: UTF-8

### 1.2 通用响应格式

#### 成功响应
```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
```

#### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": {}
  }
}
```

### 1.3 错误码定义

| 错误码 | HTTP状态码 | 说明 |
|--------|-----------|------|
| AUTH_REQUIRED | 401 | 未认证 |
| AUTH_INVALID | 401 | 认证失败 |
| PERMISSION_DENIED | 403 | 权限不足 |
| NOT_FOUND | 404 | 资源不存在 |
| VALIDATION_ERROR | 400 | 参数验证失败 |
| SERVER_ERROR | 500 | 服务器内部错误 |
| RATE_LIMIT_EXCEEDED | 429 | 请求频率超限 |

---

## 2. 认证授权API

### 2.1 用户登录

**接口**: `POST /api/v1/auth/login`

**请求体**:
```json
{
  "username": "string",
  "password": "string"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "refresh_token_string",
    "expires_in": 1800,
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin"
    }
  }
}
```

### 2.2 刷新Token

**接口**: `POST /api/v1/auth/refresh`

**请求头**: `Authorization: Bearer {refresh_token}`

**响应**:
```json
{
  "success": true,
  "data": {
    "token": "new_access_token",
    "expires_in": 1800
  }
}
```

### 2.3 登出

**接口**: `POST /api/v1/auth/logout`

**请求头**: `Authorization: Bearer {token}`

**响应**:
```json
{
  "success": true,
  "message": "登出成功"
}
```

---

## 3. 工单管理API

### 3.1 创建工单

**接口**: `POST /api/v1/tickets`

**请求体**:
```json
{
  "ticket_id": "TICKET-2026-001",
  "title": "订单服务异常",
  "description": "用户反馈订单无法提交"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "ticket_id": "TICKET-2026-001",
    "title": "订单服务异常",
    "description": "用户反馈订单无法提交",
    "status": "pending",
    "created_at": "2026-02-03T10:00:00Z"
  }
}
```

### 3.2 获取工单列表

**接口**: `GET /api/v1/tickets`

**查询参数**:
- `page`: 页码（默认1）
- `page_size`: 每页数量（默认20）
- `status`: 状态筛选（pending/analyzing/completed）

**响应**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "ticket_id": "TICKET-2026-001",
        "title": "订单服务异常",
        "status": "pending",
        "created_at": "2026-02-03T10:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "page_size": 20
  }
}
```

### 3.3 获取工单详情

**接口**: `GET /api/v1/tickets/{ticket_id}`

**响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "ticket_id": "TICKET-2026-001",
    "title": "订单服务异常",
    "description": "用户反馈订单无法提交",
    "status": "analyzing",
    "log_files": [
      {
        "id": 1,
        "file_name": "order-service.log",
        "file_size": 1048576,
        "module_name": "order-service"
      }
    ],
    "analysis_result": {
      "root_cause": "数据库连接超时",
      "confidence": 0.85
    },
    "created_at": "2026-02-03T10:00:00Z",
    "updated_at": "2026-02-03T10:30:00Z"
  }
}
```

---

## 4. 日志管理API

### 4.1 上传日志文件

**接口**: `POST /api/v1/logs/upload`

**请求类型**: `multipart/form-data`

**请求参数**:
- `ticket_id`: 工单ID
- `file`: 日志文件
- `module_name`: 模块名称
- `source_type`: 来源类型（upload/ssh/customer）

**响应**:
```json
{
  "success": true,
  "data": {
    "log_file_id": 1,
    "file_name": "order-service.log",
    "file_size": 1048576,
    "upload_status": "processing",
    "task_id": "task_123456"
  }
}
```

### 4.2 配置SSH服务器

**接口**: `POST /api/v1/logs/ssh-servers`

**请求体**:
```json
{
  "name": "生产服务器1",
  "host": "192.168.1.100",
  "port": 22,
  "username": "admin",
  "password": "encrypted_password"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "生产服务器1",
    "host": "192.168.1.100",
    "port": 22,
    "username": "admin",
    "created_at": "2026-02-03T10:00:00Z"
  }
}
```

### 4.3 从SSH下载日志

**接口**: `POST /api/v1/logs/download`

**请求体**:
```json
{
  "ticket_id": 1,
  "server_ids": [1, 2, 3],
  "log_paths": [
    "/var/log/app/order-service.log",
    "/var/log/app/payment-service.log"
  ],
  "time_range": {
    "start": "2026-02-03T09:00:00Z",
    "end": "2026-02-03T10:00:00Z"
  }
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "task_id": "download_task_123",
    "status": "pending",
    "estimated_files": 5
  }
}
```

### 4.4 查询日志条目

**接口**: `GET /api/v1/logs/entries`

**查询参数**:
- `ticket_id`: 工单ID
- `log_level`: 日志级别（DEBUG/INFO/WARN/ERROR/FATAL）
- `module_name`: 模块名称
- `start_time`: 开始时间
- `end_time`: 结束时间
- `keyword`: 关键词搜索
- `page`: 页码
- `page_size`: 每页数量

**响应**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1001,
        "timestamp": "2026-02-03T10:15:23.456Z",
        "log_level": "ERROR",
        "module_name": "order-service",
        "message": "Database connection timeout",
        "stack_trace": "at OrderService.createOrder...",
        "request_id": "req_abc123"
      }
    ],
    "total": 1500,
    "page": 1,
    "page_size": 50
  }
}
```

### 4.5 获取日志时间线

**接口**: `GET /api/v1/logs/timeline`

**查询参数**:
- `ticket_id`: 工单ID
- `module_names`: 模块名称列表（逗号分隔）
- `start_time`: 开始时间
- `end_time`: 结束时间

**响应**:
```json
{
  "success": true,
  "data": {
    "timeline": [
      {
        "timestamp": "2026-02-03T10:15:23Z",
        "events": [
          {
            "module_name": "order-service",
            "log_level": "ERROR",
            "message": "Database connection timeout",
            "log_entry_id": 1001
          },
          {
            "module_name": "payment-service",
            "log_level": "WARN",
            "message": "Retry attempt 3",
            "log_entry_id": 1002
          }
        ]
      }
    ],
    "modules": ["order-service", "payment-service", "database"],
    "time_range": {
      "start": "2026-02-03T10:00:00Z",
      "end": "2026-02-03T11:00:00Z"
    }
  }
}
```

---

## 5. 日志分析API

### 5.1 开始分析

**接口**: `POST /api/v1/analysis/start`

**请求体**:
```json
{
  "ticket_id": 1,
  "analysis_types": ["anomaly", "root_cause", "call_chain"]
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "task_id": "analysis_task_456",
    "status": "processing",
    "estimated_time": null
  }
}
```

### 5.2 获取分析结果

**接口**: `GET /api/v1/analysis/results/{task_id}`

**响应**:
```json
{
  "success": true,
  "data": {
    "task_id": "analysis_task_456",
    "status": "completed",
    "results": {
      "anomaly_detection": {
        "anomalies": [
          {
            "timestamp": "2026-02-03T10:15:23Z",
            "module_name": "order-service",
            "type": "error_spike",
            "severity": "high",
            "description": "错误日志数量激增"
          }
        ]
      },
      "root_cause": {
        "primary_cause": {
          "description": "数据库连接池耗尽",
          "confidence": 0.85,
          "evidence": [
            {
              "log_entry_id": 1001,
              "message": "Connection pool exhausted"
            }
          ],
          "related_code": {
            "file_path": "src/database/connection.py",
            "line_number": 45
          }
        },
        "secondary_causes": []
      },
      "call_chain": {
        "nodes": [
          {
            "id": "node_1",
            "module_name": "api-gateway",
            "timestamp": "2026-02-03T10:15:20Z"
          },
          {
            "id": "node_2",
            "module_name": "order-service",
            "timestamp": "2026-02-03T10:15:21Z"
          },
          {
            "id": "node_3",
            "module_name": "database",
            "timestamp": "2026-02-03T10:15:23Z",
            "error": true
          }
        ],
        "edges": [
          {"from": "node_1", "to": "node_2"},
          {"from": "node_2", "to": "node_3"}
        ]
      }
    },
    "completed_at": "2026-02-03T10:20:00Z"
  }
}
```

### 5.3 获取分析进度（WebSocket）

**接口**: `WS /api/v1/analysis/progress/{task_id}`

**消息格式**:
```json
{
  "type": "progress",
  "data": {
    "task_id": "analysis_task_456",
    "progress": 45,
    "current_step": "正在分析调用链路",
    "timestamp": "2026-02-03T10:18:00Z"
  }
}
```

---

## 6. 代码理解API

### 6.1 触发代码索引

**接口**: `POST /api/v1/code/index`

**请求体**:
```json
{
  "module_names": ["order-service", "payment-service"],
  "force_reindex": false
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "task_id": "index_task_789",
    "status": "processing",
    "modules_count": 2
  }
}
```

### 6.2 搜索代码

**接口**: `GET /api/v1/code/search`

**查询参数**:
- `query`: 搜索关键词
- `language`: 语言筛选（java/python/cpp/nodejs）
- `module_name`: 模块名称
- `limit`: 返回数量（默认10）

**响应**:
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "file_path": "src/services/OrderService.java",
        "function_name": "createOrder",
        "class_name": "OrderService",
        "language": "java",
        "code_snippet": "public Order createOrder(OrderRequest request) {...}",
        "start_line": 45,
        "end_line": 78,
        "relevance_score": 0.92
      }
    ],
    "total": 15
  }
}
```

### 6.3 获取代码解释

**接口**: `POST /api/v1/code/explain`

**请求体**:
```json
{
  "file_path": "src/services/OrderService.java",
  "start_line": 45,
  "end_line": 78
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "explanation": {
      "summary": "该方法用于创建订单，包含参数验证、库存检查、订单创建和支付调用",
      "parameters": [
        {
          "name": "request",
          "type": "OrderRequest",
          "description": "订单请求对象，包含商品信息和用户信息"
        }
      ],
      "return_value": {
        "type": "Order",
        "description": "创建成功的订单对象"
      },
      "exceptions": [
        {
          "type": "ValidationException",
          "description": "参数验证失败时抛出"
        },
        {
          "type": "InsufficientStockException",
          "description": "库存不足时抛出"
        }
      ],
      "business_logic": [
        "1. 验证订单请求参数",
        "2. 检查商品库存",
        "3. 创建订单记录",
        "4. 调用支付服务",
        "5. 返回订单对象"
      ],
      "potential_issues": [
        "第67行：数据库连接未设置超时，可能导致长时间阻塞"
      ]
    }
  }
}
```

### 6.4 获取业务流程图

**接口**: `GET /api/v1/code/flow-diagram`

**查询参数**:
- `module_name`: 模块名称
- `entry_point`: 入口函数（可选）

**响应**:
```json
{
  "success": true,
  "data": {
    "diagram": {
      "type": "mermaid",
      "content": "graph TB\n  A[API Gateway] --> B[Order Service]\n  B --> C[Database]\n  B --> D[Payment Service]"
    },
    "nodes": [
      {
        "id": "A",
        "label": "API Gateway",
        "type": "service"
      }
    ],
    "edges": [
      {
        "from": "A",
        "to": "B",
        "label": "HTTP Request"
      }
    ]
  }
}
```

---

## 7. 报告生成API

### 7.1 生成报告

**接口**: `POST /api/v1/reports/generate`

**请求体**:
```json
{
  "ticket_id": 1,
  "report_type": "pdf",
  "sections": [
    "summary",
    "phenomenon",
    "root_cause",
    "solution",
    "improvement"
  ],
  "include_charts": true
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "task_id": "report_task_999",
    "status": "processing"
  }
}
```

### 7.2 获取报告列表

**接口**: `GET /api/v1/reports`

**查询参数**:
- `ticket_id`: 工单ID
- `page`: 页码
- `page_size`: 每页数量

**响应**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "ticket_id": 1,
        "report_type": "pdf",
        "file_path": "/reports/TICKET-2026-001_report.pdf",
        "download_url": "/api/v1/reports/1/download",
        "created_at": "2026-02-03T11:00:00Z"
      }
    ],
    "total": 5
  }
}
```

### 7.3 下载报告

**接口**: `GET /api/v1/reports/{report_id}/download`

**响应**: 文件流（application/pdf 或 text/markdown）

---

## 8. 权限管理API

### 8.1 获取用户列表

**接口**: `GET /api/v1/users`

**权限**: 仅管理员

**响应**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "username": "admin",
        "role": "admin",
        "created_at": "2026-01-01T00:00:00Z"
      }
    ]
  }
}
```

### 8.2 创建用户

**接口**: `POST /api/v1/users`

**权限**: 仅管理员

**请求体**:
```json
{
  "username": "newuser",
  "password": "password123",
  "role": "user"
}
```

### 8.3 获取审计日志

**接口**: `GET /api/v1/audit-logs`

**权限**: 仅管理员

**查询参数**:
- `user_id`: 用户ID
- `action`: 操作类型
- `start_time`: 开始时间
- `end_time`: 结束时间
- `page`: 页码
- `page_size`: 每页数量

**响应**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "user_id": 1,
        "username": "admin",
        "action": "SSH_CONNECT",
        "resource_type": "server",
        "resource_id": "1",
        "details": {
          "server_host": "192.168.1.100"
        },
        "ip_address": "10.0.0.5",
        "created_at": "2026-02-03T10:00:00Z"
      }
    ],
    "total": 1000
  }
}
```

---

## 9. 系统管理API

### 9.1 健康检查

**接口**: `GET /api/v1/health`

**响应**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "components": {
      "database": "healthy",
      "redis": "healthy",
      "milvus": "healthy",
      "influxdb": "healthy"
    },
    "timestamp": "2026-02-03T10:00:00Z"
  }
}
```

### 9.2 获取系统统计

**接口**: `GET /api/v1/stats`

**响应**:
```json
{
  "success": true,
  "data": {
    "tickets": {
      "total": 150,
      "pending": 10,
      "analyzing": 5,
      "completed": 135
    },
    "logs": {
      "total_files": 500,
      "total_entries": 10000000,
      "storage_size_gb": 50
    },
    "code": {
      "indexed_modules": 30,
      "indexed_files": 1500,
      "total_lines": 1200000
    }
  }
}
```

---

## 10. WebSocket接口

### 10.1 实时日志流

**接口**: `WS /api/v1/ws/logs/{ticket_id}`

**消息格式**:
```json
{
  "type": "log_entry",
  "data": {
    "timestamp": "2026-02-03T10:15:23.456Z",
    "log_level": "ERROR",
    "module_name": "order-service",
    "message": "Database connection timeout"
  }
}
```

### 10.2 任务进度通知

**接口**: `WS /api/v1/ws/tasks/{task_id}`

**消息类型**:
- `progress`: 进度更新
- `completed`: 任务完成
- `failed`: 任务失败

---

## 11. 限流规则

| 接口类型 | 限流规则 |
|---------|---------|
| 登录接口 | 5次/分钟/IP |
| 文件上传 | 10次/小时/用户 |
| 分析接口 | 20次/小时/用户 |
| 查询接口 | 100次/分钟/用户 |
| 其他接口 | 60次/分钟/用户 |

---

**文档结束**
