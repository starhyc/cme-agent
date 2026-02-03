# LLM客户端详细设计

**文件路径**: `backend/app/common/llm_client.py`
**模块**: 公共模块
**作者**: Architect
**版本**: 1.0

---

## 1. 类概述

### 职责
封装与LLM API的交互，提供统一的调用接口，支持流式和非流式响应。

### 依赖
- `openai`: OpenAI Python SDK
- `app.common.logger`: 日志记录
- `app.common.config`: 配置管理

---

## 2. 类定义

```python
from typing import Optional, AsyncIterator, Dict, Any, List
from openai import AsyncOpenAI
import asyncio

class LLMClient:
    """
    LLM API客户端封装类

    提供统一的LLM调用接口，支持：
    - 流式和非流式响应
    - 自动重试
    - 超时控制
    - 结果缓存
    """

    def __init__(
        self,
        base_url: str,
        api_key: str,
        model: str = "gpt-4",
        timeout: int = 60,
        max_retries: int = 3
    ):
        """
        初始化LLM客户端

        Args:
            base_url: LLM API的基础URL
            api_key: API密钥
            model: 使用的模型名称
            timeout: 请求超时时间（秒）
            max_retries: 最大重试次数
        """
        pass
```

---

## 3. 属性列表

| 属性名 | 类型 | 说明 |
|--------|------|------|
| client | AsyncOpenAI | OpenAI异步客户端实例 |
| model | str | 使用的模型名称 |
| timeout | int | 请求超时时间 |
| max_retries | int | 最大重试次数 |
| logger | Logger | 日志记录器 |

---

## 4. 方法列表

### 4.1 chat_completion

```python
async def chat_completion(
    self,
    messages: List[Dict[str, str]],
    temperature: float = 0.7,
    max_tokens: Optional[int] = None,
    stream: bool = False
) -> Union[str, AsyncIterator[str]]:
    """
    调用LLM进行对话补全

    Args:
        messages: 对话消息列表，格式：[{"role": "user", "content": "..."}]
        temperature: 温度参数，控制随机性（0-1）
        max_tokens: 最大生成token数
        stream: 是否使用流式响应

    Returns:
        str: 非流式响应时返回完整文本
        AsyncIterator[str]: 流式响应时返回异步迭代器

    Raises:
        LLMAPIError: API调用失败
        LLMTimeoutError: 请求超时

    业务逻辑:
        1. 记录请求日志（包含消息数量、温度等参数）
        2. 调用OpenAI API
        3. 如果stream=False，等待完整响应并返回
        4. 如果stream=True，返回异步迭代器逐块返回
        5. 捕获异常并记录错误日志
        6. 超过max_retries后抛出异常
    """
    pass
```

### 4.2 analyze_logs

```python
async def analyze_logs(
    self,
    log_entries: List[Dict[str, Any]],
    analysis_type: str
) -> Dict[str, Any]:
    """
    使用LLM分析日志

    Args:
        log_entries: 日志条目列表
        analysis_type: 分析类型（anomaly/root_cause/call_chain）

    Returns:
        Dict[str, Any]: 分析结果，包含：
            - type: 分析类型
            - result: 分析结果内容
            - confidence: 置信度（0-1）

    Raises:
        ValueError: analysis_type不支持
        LLMAPIError: API调用失败

    业务逻辑:
        1. 根据analysis_type选择对应的prompt模板
        2. 格式化日志条目为prompt
        3. 调用chat_completion获取分析结果
        4. 解析LLM返回的JSON结果
        5. 验证结果格式并返回
    """
    pass
```

### 4.3 explain_code

```python
async def explain_code(
    self,
    code_snippet: str,
    language: str,
    context: Optional[str] = None
) -> Dict[str, Any]:
    """
    使用LLM解释代码

    Args:
        code_snippet: 代码片段
        language: 编程语言（java/python/cpp/nodejs）
        context: 额外上下文信息

    Returns:
        Dict[str, Any]: 代码解释，包含：
            - summary: 功能概述
            - parameters: 参数说明列表
            - return_value: 返回值说明
            - exceptions: 可能的异常列表
            - business_logic: 业务逻辑步骤
            - potential_issues: 潜在问题列表

    Raises:
        LLMAPIError: API调用失败

    业务逻辑:
        1. 构建代码解释prompt
        2. 包含语言信息和上下文
        3. 调用chat_completion
        4. 解析返回的结构化解释
        5. 返回格式化的解释结果
    """
    pass
```

### 4.4 _build_prompt

```python
def _build_prompt(
    self,
    template_name: str,
    variables: Dict[str, Any]
) -> str:
    """
    构建prompt（私有方法）

    Args:
        template_name: prompt模板名称
        variables: 模板变量字典

    Returns:
        str: 构建好的prompt文本

    业务逻辑:
        1. 从配置加载prompt模板
        2. 使用Jinja2渲染模板
        3. 返回渲染后的prompt
    """
    pass
```

### 4.5 _retry_with_backoff

```python
async def _retry_with_backoff(
    self,
    func: Callable,
    *args,
    **kwargs
) -> Any:
    """
    带指数退避的重试机制（私有方法）

    Args:
        func: 要重试的异步函数
        *args: 函数位置参数
        **kwargs: 函数关键字参数

    Returns:
        Any: 函数执行结果

    Raises:
        Exception: 超过最大重试次数后抛出最后一次异常

    业务逻辑:
        1. 尝试执行函数
        2. 如果失败，等待 2^retry_count 秒
        3. 重试直到成功或达到max_retries
        4. 记录每次重试的日志
    """
    pass
```

---

## 5. 异常定义

```python
class LLMAPIError(Exception):
    """LLM API调用失败异常"""
    pass

class LLMTimeoutError(Exception):
    """LLM请求超时异常"""
    pass
```

---

## 6. 使用示例

```python
# 初始化客户端
llm_client = LLMClient(
    base_url="https://api.internal.llm",
    api_key="sk-xxx",
    model="gpt-4",
    timeout=60
)

# 非流式调用
response = await llm_client.chat_completion(
    messages=[
        {"role": "system", "content": "你是一个日志分析专家"},
        {"role": "user", "content": "分析这些错误日志..."}
    ],
    temperature=0.3
)

# 流式调用
async for chunk in await llm_client.chat_completion(
    messages=[...],
    stream=True
):
    print(chunk, end="")

# 分析日志
result = await llm_client.analyze_logs(
    log_entries=[...],
    analysis_type="root_cause"
)

# 解释代码
explanation = await llm_client.explain_code(
    code_snippet="def create_order(...):",
    language="python"
)
```

---

## 7. 依赖关系

### 依赖的模块
- `openai`: OpenAI SDK
- `app.common.logger`: 日志模块
- `app.common.config`: 配置模块

### 被依赖的模块
- `app.log_analyzer.root_cause_finder`: 根因分析
- `app.code_explainer.explainer_service`: 代码解释
- `app.report_generator.generator_service`: 报告生成

---

## 8. 配置项

```python
# config.py
LLM_CONFIG = {
    "base_url": "https://api.internal.llm",
    "api_key": "sk-xxx",
    "model": "gpt-4",
    "timeout": 60,
    "max_retries": 3,
    "temperature": 0.7,
    "max_tokens": 4000
}
```

---

## 9. Prompt模板

### 日志分析模板
```
你是一个专业的日志分析专家。请分析以下日志并找出根本原因。

日志条目：
{log_entries}

请以JSON格式返回分析结果：
{
  "root_cause": "根本原因描述",
  "confidence": 0.85,
  "evidence": ["证据1", "证据2"]
}
```

### 代码解释模板
```
请解释以下{language}代码的功能：

{code_snippet}

请以JSON格式返回：
{
  "summary": "功能概述",
  "parameters": [...],
  "return_value": {...},
  "business_logic": [...]
}
```

---

## 10. 性能优化

1. **结果缓存**: 相同的代码解释请求缓存24小时
2. **连接池**: 复用HTTP连接
3. **超时控制**: 避免长时间等待
4. **异步处理**: 使用asyncio提高并发性能

---

## 11. 测试要点

1. 测试正常调用流程
2. 测试流式响应
3. 测试超时重试机制
4. 测试异常处理
5. 测试不同的analysis_type
6. 测试prompt模板渲染

---

**文档结束**
