# 技术规格说明书 (Technical Specification)

**项目名称**: 问题定位助手 (Problem Diagnosis Assistant)
**文档版本**: 1.0
**创建日期**: 2026-02-03
**作者**: System Architect
**状态**: 待审核

---

## 1. 技术栈选型

### 1.1 后端技术栈

#### 核心框架
- **语言**: Python 3.11+
- **Web框架**: FastAPI 0.109+
  - 异步支持，高性能
  - 自动API文档生成
  - 类型提示支持
  - WebSocket支持（实时日志流）

#### 数据存储
- **关系数据库**: PostgreSQL 16+
  - 存储用户、工单、服务器配置、审计日志
  - 支持JSON字段（灵活存储日志元数据）
  - 全文搜索支持

- **向量数据库**: Milvus 2.3+
  - 存储代码向量索引
  - 支持高维向量相似度搜索
  - 分布式架构，支持大规模数据

- **时序数据库**: InfluxDB 2.7+
  - 存储日志时间序列数据
  - 高效的时间范围查询
  - 自动数据过期（30天）

- **缓存**: Redis 7.2+
  - 会话管理
  - 分析结果缓存
  - 任务队列

#### AI/ML组件
- **LLM接口**: OpenAI-compatible API
  - 支持自定义endpoint
  - 统一的API调用接口
  - 支持流式响应

- **代码解析**: Tree-sitter 0.20+
  - 支持Java、Python、C++、Node.js
  - 语法树解析
  - 代码结构分析

- **向量化**: sentence-transformers
  - 代码语义向量化
  - 日志语义向量化
  - 支持中英文混合

#### 任务处理
- **任务队列**: Celery 5.3+
  - 异步任务处理
  - 分布式任务执行
  - 任务优先级管理

- **消息队列**: RabbitMQ 3.12+
  - 可靠的消息传递
  - 任务持久化
  - 死信队列支持

#### 其他组件
- **SSH客户端**: Paramiko 3.4+
- **日志解析**: python-json-logger, loguru
- **加密**: cryptography 41+（AES-256-GCM）
- **PDF生成**: WeasyPrint 60+
- **图表生成**: Mermaid CLI, Graphviz

---

### 1.2 前端技术栈

#### 核心框架
- **语言**: TypeScript 5.3+
- **框架**: React 18.2+
- **构建工具**: Vite 5.0+
  - 快速开发服务器
  - 优化的生产构建
  - 插件生态丰富

#### UI组件库
- **组件库**: Ant Design 5.12+
  - 企业级UI组件
  - 完善的中文文档
  - 丰富的组件生态

- **图表库**:
  - ECharts 5.4+（日志时间线、统计图表）
  - React Flow 11.10+（调用链路图、流程图）

- **代码编辑器**: Monaco Editor 0.45+
  - VS Code同款编辑器
  - 语法高亮
  - 代码跳转

#### 状态管理
- **全局状态**: Zustand 4.4+
  - 轻量级状态管理
  - TypeScript友好
  - 简单易用

#### 网络请求
- **HTTP客户端**: Axios 1.6+
- **WebSocket**: native WebSocket API

#### 样式方案
- **CSS方案**: Tailwind CSS 3.4+
  - 原子化CSS
  - 响应式设计
  - 自定义主题

---

### 1.3 部署架构

#### 容器化
- **容器**: Docker 24+
- **编排**: Docker Compose（单机部署）
- **镜像仓库**: 私有Harbor仓库

#### Web服务器
- **反向代理**: Nginx 1.25+
  - 静态资源服务
  - 负载均衡
  - SSL终止

#### 监控运维
- **日志收集**: 应用内置日志系统
- **健康检查**: FastAPI内置健康检查端点
- **备份**: PostgreSQL自动备份脚本

---

## 2. 数据库设计

### 2.1 PostgreSQL表结构

#### 用户表 (users)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- 'admin' or 'user'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 工单表 (tickets)
```sql
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL, -- 'pending', 'analyzing', 'completed'
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 服务器配置表 (servers)
```sql
CREATE TABLE servers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    host VARCHAR(255) NOT NULL,
    port INTEGER DEFAULT 22,
    username VARCHAR(100) NOT NULL,
    password_encrypted TEXT NOT NULL, -- AES-256-GCM encrypted
    encryption_key_id VARCHAR(50) NOT NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 日志文件表 (log_files)
```sql
CREATE TABLE log_files (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES tickets(id),
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT,
    file_size BIGINT,
    source_type VARCHAR(20) NOT NULL, -- 'upload', 'ssh', 'customer'
    server_id INTEGER REFERENCES servers(id),
    module_name VARCHAR(100),
    log_format VARCHAR(20), -- 'json', 'text', 'structured'
    upload_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 日志条目表 (log_entries)
```sql
CREATE TABLE log_entries (
    id BIGSERIAL PRIMARY KEY,
    log_file_id INTEGER REFERENCES log_files(id),
    timestamp TIMESTAMP NOT NULL,
    log_level VARCHAR(20), -- 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'
    module_name VARCHAR(100),
    message TEXT NOT NULL,
    stack_trace TEXT,
    request_id VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_log_entries_timestamp ON log_entries(timestamp);
CREATE INDEX idx_log_entries_log_level ON log_entries(log_level);
CREATE INDEX idx_log_entries_request_id ON log_entries(request_id);
```

#### 分析结果表 (analysis_results)
```sql
CREATE TABLE analysis_results (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES tickets(id),
    analysis_type VARCHAR(50) NOT NULL, -- 'root_cause', 'call_chain', 'anomaly'
    result_data JSONB NOT NULL,
    confidence_score FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 报告表 (reports)
```sql
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES tickets(id),
    report_type VARCHAR(20) NOT NULL, -- 'pdf', 'markdown'
    file_path TEXT NOT NULL,
    generated_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 代码模块表 (code_modules)
```sql
CREATE TABLE code_modules (
    id SERIAL PRIMARY KEY,
    module_name VARCHAR(100) UNIQUE NOT NULL,
    language VARCHAR(20) NOT NULL, -- 'java', 'python', 'cpp', 'nodejs'
    repository_path TEXT NOT NULL,
    indexed_at TIMESTAMP,
    index_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'indexing', 'completed', 'failed'
    total_files INTEGER,
    total_lines INTEGER
);
```

#### 代码文件表 (code_files)
```sql
CREATE TABLE code_files (
    id SERIAL PRIMARY KEY,
    module_id INTEGER REFERENCES code_modules(id),
    file_path TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    language VARCHAR(20) NOT NULL,
    line_count INTEGER,
    indexed_at TIMESTAMP
);
```

#### 业务流程模板表 (flow_templates)
```sql
CREATE TABLE flow_templates (
    id SERIAL PRIMARY KEY,
    template_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    flow_definition JSONB NOT NULL, -- Mermaid diagram definition
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 审计日志表 (audit_logs)
```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(100),
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

---

### 2.2 InfluxDB数据结构

#### 日志时间序列 (log_timeseries)
```
measurement: log_events
tags:
  - ticket_id
  - module_name
  - log_level
  - server_id
fields:
  - message (string)
  - request_id (string)
  - error_count (integer)
timestamp: log timestamp
```

#### 性能指标 (performance_metrics)
```
measurement: performance
tags:
  - ticket_id
  - module_name
fields:
  - response_time (float)
  - cpu_usage (float)
  - memory_usage (float)
timestamp: metric timestamp
```

---

### 2.3 Milvus集合结构

#### 代码向量集合 (code_vectors)
```python
collection_schema = {
    "fields": [
        {"name": "id", "type": "INT64", "is_primary": True, "auto_id": True},
        {"name": "file_id", "type": "INT64"},
        {"name": "code_snippet", "type": "VARCHAR", "max_length": 65535},
        {"name": "function_name", "type": "VARCHAR", "max_length": 255},
        {"name": "class_name", "type": "VARCHAR", "max_length": 255},
        {"name": "language", "type": "VARCHAR", "max_length": 20},
        {"name": "embedding", "type": "FLOAT_VECTOR", "dim": 768}
    ]
}
```

#### 日志向量集合 (log_vectors)
```python
collection_schema = {
    "fields": [
        {"name": "id", "type": "INT64", "is_primary": True, "auto_id": True},
        {"name": "log_entry_id", "type": "INT64"},
        {"name": "message", "type": "VARCHAR", "max_length": 65535},
        {"name": "embedding", "type": "FLOAT_VECTOR", "dim": 768}
    ]
}
```

---

## 3. 系统配置

### 3.1 加密配置

#### 密钥管理
- **主密钥**: 环境变量存储，启动时加载
- **密钥派生**: PBKDF2-HMAC-SHA256
- **加密算法**: AES-256-GCM
- **密钥轮换**: 支持多版本密钥（key_id标识）

#### 加密范围
- SSH密码
- 数据库连接字符串
- LLM API密钥

---

### 3.2 性能配置

#### 并发配置
- **FastAPI workers**: 4-8（根据CPU核心数）
- **Celery workers**: 4-8
- **数据库连接池**: 20-50
- **Redis连接池**: 10-20

#### 缓存策略
- **分析结果缓存**: 1小时
- **代码索引缓存**: 24小时
- **会话缓存**: 30分钟

#### 文件处理
- **最大上传大小**: 1GB
- **分块上传**: 10MB/chunk
- **并行解析**: 4个worker

---

### 3.3 安全配置

#### 认证授权
- **JWT Token**: 30分钟过期
- **Refresh Token**: 7天过期
- **密码策略**: 最少8位，包含大小写字母和数字

#### 访问控制
- **RBAC**: 基于角色的访问控制
- **资源级权限**: 代码模块、服务器配置
- **审计日志**: 所有操作记录

#### 网络安全
- **HTTPS**: 强制使用TLS 1.3
- **CORS**: 限制允许的源
- **Rate Limiting**: API限流（100请求/分钟/用户）

---

## 4. 技术决策说明

### 4.1 为什么选择FastAPI？
- 原生异步支持，适合I/O密集型任务（SSH连接、文件上传）
- 自动API文档生成，便于前后端协作
- 类型提示支持，减少运行时错误
- 性能优异，接近Go/Node.js水平

### 4.2 为什么选择多数据库架构？
- **PostgreSQL**: 关系数据，事务支持
- **InfluxDB**: 时序数据，高效的时间范围查询
- **Milvus**: 向量搜索，代码语义检索
- **Redis**: 缓存和任务队列，提升性能

### 4.3 为什么选择全量索引？
- 符合PRD要求（首次索引<10分钟）
- 查询性能最优（<2秒）
- 代码变更频率低，全量索引成本可接受
- 支持后台增量更新

### 4.4 为什么选择半自动化流程图？
- 平衡准确性和维护成本
- 关键节点人工标注，确保业务逻辑正确
- 自动生成基础流程，减少重复劳动
- 支持模板复用

### 4.5 为什么选择30天日志保留？
- 符合大多数问题定位场景
- 控制存储成本
- InfluxDB自动过期机制
- 重要日志可手动归档

---

## 5. 风险与挑战

### 5.1 技术风险

#### 大文件处理
- **风险**: 1GB日志文件可能导致内存溢出
- **缓解**: 流式处理、分块上传、异步解析

#### LLM响应延迟
- **风险**: 自定义LLM可能响应慢，影响用户体验
- **缓解**: 异步处理、进度提示、结果缓存

#### 代码索引准确性
- **风险**: Tree-sitter可能无法解析所有代码
- **缓解**: 多语言支持、错误处理、人工校验

### 5.2 性能风险

#### 并发分析
- **风险**: 多用户同时分析可能导致资源竞争
- **缓解**: 任务队列、优先级管理、资源限制

#### 向量搜索性能
- **风险**: 大规模代码库可能导致搜索慢
- **缓解**: 索引优化、分片策略、缓存热点数据

### 5.3 安全风险

#### SSH密钥泄露
- **风险**: 数据库泄露可能导致服务器访问权限泄露
- **缓解**: AES-256加密、密钥轮换、访问审计

#### 代码泄露
- **风险**: 敏感代码可能被未授权用户访问
- **缓解**: 细粒度权限控制、代码脱敏、审计日志

---

## 6. 部署要求

### 6.1 硬件要求

#### 最小配置
- **CPU**: 8核
- **内存**: 32GB
- **存储**: 500GB SSD
- **网络**: 1Gbps

#### 推荐配置
- **CPU**: 16核
- **内存**: 64GB
- **存储**: 1TB NVMe SSD
- **网络**: 10Gbps

### 6.2 软件依赖
- Docker 24+
- Docker Compose 2.20+
- Python 3.11+
- Node.js 20+

### 6.3 网络要求
- 内网部署，无需公网访问
- 需要访问目标服务器SSH端口（22）
- 需要访问自定义LLM API endpoint

---

## 7. 开发规范

### 7.1 代码规范
- **Python**: PEP 8, Black格式化, MyPy类型检查
- **TypeScript**: ESLint, Prettier格式化
- **注释**: 关键逻辑必须有中文注释
- **日志**: 所有异常必须记录日志

### 7.2 Git规范
- **分支策略**: Git Flow
- **提交信息**: Conventional Commits
- **代码审查**: 必须经过审查才能合并

### 7.3 测试规范
- **单元测试**: 核心逻辑覆盖率>80%
- **集成测试**: 关键流程端到端测试
- **性能测试**: 满足PRD性能要求

---

**文档结束**
