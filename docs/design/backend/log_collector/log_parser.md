# 日志解析器详细设计

**文件路径**: `backend/app/log_collector/parser.py`
**模块**: 日志收集模块
**作者**: Architect
**版本**: 1.0

---

## 1. 类概述

### 职责
解析不同格式的日志文件，提取结构化信息。

### 依赖
- `app.log_collector.repository.LogRepository`: 日志数据访问
- `app.common.logger`: 日志记录

---

## 2. 类定义

```python
from typing import Dict, Any, List, Optional
import re
import json

class LogParser:
    """
    日志解析器
    
    支持JSON、文本、结构化日志的解析和标准化。
    """

    def __init__(self, log_repository: LogRepository):
        """初始化日志解析器"""
        pass
```

---

## 3. 方法列表

### 3.1 parse_log_file

```python
async def parse_log_file(
    self,
    log_file_id: int,
    file_path: str
) -> Dict[str, Any]:
    """
    解析日志文件

    Args:
        log_file_id: 日志文件ID
        file_path: 文件路径

    Returns:
        Dict[str, Any]: 解析结果
            - total_lines: 总行数
            - parsed_lines: 成功解析行数
            - error_lines: 错误行数
            - log_format: 识别的日志格式

    业务逻辑:
        1. 识别日志格式
        2. 选择对应的解析器
        3. 逐行解析
        4. 批量插入数据库
        5. 更新log_file状态
        6. 返回解析结果
    """
    pass
```

### 3.2 detect_log_format

```python
def detect_log_format(self, sample_lines: List[str]) -> str:
    """
    识别日志格式

    Args:
        sample_lines: 样本行（前100行）

    Returns:
        str: 日志格式（json/text/structured）

    业务逻辑:
        1. 尝试JSON解析
        2. 检查结构化日志模式
        3. 默认为文本格式
    """
    pass
```

### 3.3 parse_json_log

```python
def parse_json_log(self, line: str) -> Optional[Dict[str, Any]]:
    """解析JSON格式日志"""
    pass
```

### 3.4 parse_text_log

```python
def parse_text_log(self, line: str) -> Optional[Dict[str, Any]]:
    """解析文本格式日志"""
    pass
```

---

**文档结束**
