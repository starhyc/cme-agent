# 后端详细设计文档索引

**项目名称**: 问题定位助手 - 后端
**文档版本**: 1.0
**创建日期**: 2026-02-03

---

## 设计文档结构

本目录包含后端所有模块的详细设计文档，每个文档对应一个代码文件或类。

### 目录结构映射

```
docs/design/backend/          →  backend/app/
├── auth/                     →  app/auth/
│   ├── auth_service.md       →  auth/service.py
│   ├── jwt_handler.md        →  auth/jwt_handler.py
│   └── password_hasher.md    →  auth/password_hasher.py
├── ticket/                   →  app/ticket/
│   ├── ticket_service.md     →  ticket/service.py
│   └── ticket_repository.md  →  ticket/repository.py
├── log_collector/            →  app/log_collector/
│   ├── log_uploader.md       →  log_collector/uploader.py
│   ├── ssh_downloader.md     →  log_collector/ssh_downloader.py
│   └── log_parser.md         →  log_collector/parser.py
├── log_analyzer/             →  app/log_analyzer/
│   ├── analyzer_service.md   →  log_analyzer/service.py
│   ├── anomaly_detector.md   →  log_analyzer/anomaly_detector.py
│   ├── root_cause_finder.md  →  log_analyzer/root_cause_finder.py
│   └── call_chain_builder.md →  log_analyzer/call_chain_builder.py
├── code_indexer/             →  app/code_indexer/
│   ├── indexer_service.md    →  code_indexer/service.py
│   ├── tree_sitter_parser.md →  code_indexer/tree_sitter_parser.py
│   └── vector_embedder.md    →  code_indexer/vector_embedder.py
├── code_explainer/           →  app/code_explainer/
│   ├── explainer_service.md  →  code_explainer/service.py
│   └── code_searcher.md      →  code_explainer/searcher.py
├── report_generator/         →  app/report_generator/
│   ├── generator_service.md  →  report_generator/service.py
│   ├── pdf_generator.md      →  report_generator/pdf_generator.py
│   └── markdown_generator.md →  report_generator/markdown_generator.py
└── common/                   →  app/common/
    ├── llm_client.md         →  common/llm_client.py
    ├── encryption.md         →  common/encryption.py
    └── logger.md             →  common/logger.py
```

---

## 核心模块概览

### 1. 认证授权模块 (auth)
- **auth_service.md**: 用户认证、登录登出、Token管理
- **jwt_handler.md**: JWT Token生成和验证
- **password_hasher.md**: 密码哈希和验证

### 2. 工单管理模块 (ticket)
- **ticket_service.md**: 工单CRUD操作
- **ticket_repository.md**: 工单数据访问层

### 3. 日志收集模块 (log_collector)
- **log_uploader.md**: 处理日志文件上传
- **ssh_downloader.md**: SSH连接和日志下载
- **log_parser.md**: 日志格式解析和标准化

### 4. 日志分析模块 (log_analyzer)
- **analyzer_service.md**: 分析任务编排
- **anomaly_detector.md**: 异常检测算法
- **root_cause_finder.md**: 根因定位逻辑
- **call_chain_builder.md**: 调用链路构建

### 5. 代码索引模块 (code_indexer)
- **indexer_service.md**: 代码索引任务管理
- **tree_sitter_parser.md**: 代码语法树解析
- **vector_embedder.md**: 代码向量化

### 6. 代码解释模块 (code_explainer)
- **explainer_service.md**: 代码解释服务
- **code_searcher.md**: 代码向量检索

### 7. 报告生成模块 (report_generator)
- **generator_service.md**: 报告生成编排
- **pdf_generator.md**: PDF报告生成
- **markdown_generator.md**: Markdown报告生成

### 8. 公共模块 (common)
- **llm_client.md**: LLM API调用封装
- **encryption.md**: 加密解密工具
- **logger.md**: 日志记录工具

---

## 设计文档规范

每个设计文档必须包含以下章节：

### 1. 类/模块概述
- 职责描述
- 在系统中的位置
- 依赖的其他模块

### 2. 类定义
```python
class ClassName:
    """类的中文说明"""
    pass
```

### 3. 属性列表
| 属性名 | 类型 | 说明 |
|--------|------|------|

### 4. 方法列表

每个方法必须包含：
- 方法签名（包含类型提示）
- 参数说明
- 返回值说明
- 可能抛出的异常
- 业务逻辑描述

### 5. 依赖关系
- 依赖的类/模块
- 被哪些类/模块依赖

### 6. 数据流
- 输入数据来源
- 输出数据去向

---

## 阅读顺序建议

### 新手入门
1. common/logger.md - 了解日志规范
2. auth/auth_service.md - 了解认证流程
3. ticket/ticket_service.md - 了解核心业务

### 日志处理流程
1. log_collector/log_uploader.md
2. log_collector/log_parser.md
3. log_analyzer/analyzer_service.md
4. log_analyzer/root_cause_finder.md

### 代码理解流程
1. code_indexer/indexer_service.md
2. code_indexer/tree_sitter_parser.md
3. code_explainer/explainer_service.md

---

**文档结束**
