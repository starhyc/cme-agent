# 后端执行计划 - 模块04：日志分析模块

**模块名称**: 日志分析模块 (Log Analysis)
**优先级**: P0 - 核心功能
**依赖**: 日志收集模块
**预计工作量**: 大
**负责人**: Backend Developer

---

## 1. 模块概述

使用AI分析日志，识别异常、构建调用链路、定位根本原因。

### 核心功能
- 异常检测（ERROR、EXCEPTION、性能异常）
- 跨模块调用链路分析
- 根因定位
- 分析结果缓存

---

## 2. 实现文件清单

- `app/log_analyzer/service.py` - 分析服务编排
- `app/log_analyzer/anomaly_detector.py` - 异常检测
- `app/log_analyzer/root_cause_finder.py` - 根因定位
- `app/log_analyzer/call_chain_builder.py` - 调用链构建
- `app/log_analyzer/router.py` - API路由
- `app/log_analyzer/tasks.py` - Celery任务

---

## 3. 详细任务列表

### 任务3.1: 实现异常检测器
**文件**: `app/log_analyzer/anomaly_detector.py`

**实现内容**:
```python
from typing import List, Dict, Any
from app.log_collector.models import LogEntry

class AnomalyDetector:
    """异常检测器"""

    async def detect_anomalies(
        self,
        log_entries: List[LogEntry]
    ) -> List[Dict[str, Any]]:
        """
        检测日志异常

        业务逻辑:
        1. 识别ERROR/FATAL级别日志
        2. 提取异常堆栈信息
        3. 检测性能异常（超时、慢查询）
        4. 统计异常频率
        5. 按严重程度排序

        返回: 异常列表，包含时间、模块、类型、严重程度
        """
        anomalies = []

        # 错误日志检测
        for entry in log_entries:
            if entry.log_level in ['ERROR', 'FATAL']:
                anomalies.append({
                    'timestamp': entry.timestamp,
                    'module_name': entry.module_name,
                    'type': 'error',
                    'severity': 'high' if entry.log_level == 'FATAL' else 'medium',
                    'message': entry.message,
                    'stack_trace': entry.stack_trace,
                    'log_entry_id': entry.id
                })

        # 性能异常检测
        timeout_anomalies = self._detect_timeouts(log_entries)
        anomalies.extend(timeout_anomalies)

        return sorted(anomalies, key=lambda x: x['timestamp'])

    def _detect_timeouts(self, log_entries: List[LogEntry]) -> List[Dict]:
        """检测超时异常"""
        timeouts = []
        for entry in log_entries:
            if 'timeout' in entry.message.lower() or 'timed out' in entry.message.lower():
                timeouts.append({
                    'timestamp': entry.timestamp,
                    'module_name': entry.module_name,
                    'type': 'timeout',
                    'severity': 'high',
                    'message': entry.message,
                    'log_entry_id': entry.id
                })
        return timeouts
```

**验收标准**:
- [ ] 识别所有ERROR/FATAL日志
- [ ] 提取完整堆栈信息
- [ ] 检测超时异常
- [ ] 按时间排序

---

### 任务3.2: 实现调用链构建器
**文件**: `app/log_analyzer/call_chain_builder.py`

**实现内容**:
```python
from typing import List, Dict, Any
from collections import defaultdict

class CallChainBuilder:
    """调用链路构建器"""

    async def build_call_chain(
        self,
        log_entries: List[LogEntry],
        time_window_seconds: int = 5
    ) -> Dict[str, Any]:
        """
        构建调用链路图

        业务逻辑:
        1. 按request_id分组日志
        2. 按时间窗口关联无request_id的日志
        3. 识别模块间调用关系
        4. 构建有向图结构
        5. 标记错误节点

        返回: {nodes: [], edges: []}
        """
        # 按request_id分组
        request_groups = defaultdict(list)
        for entry in log_entries:
            if entry.request_id:
                request_groups[entry.request_id].append(entry)

        # 构建节点和边
        nodes = []
        edges = []
        node_id = 0

        for request_id, entries in request_groups.items():
            # 按时间排序
            entries.sort(key=lambda x: x.timestamp)

            # 创建节点
            for entry in entries:
                node = {
                    'id': f'node_{node_id}',
                    'module_name': entry.module_name,
                    'timestamp': entry.timestamp.isoformat(),
                    'log_level': entry.log_level,
                    'error': entry.log_level in ['ERROR', 'FATAL']
                }
                nodes.append(node)

                # 创建边（连接前一个节点）
                if node_id > 0:
                    edges.append({
                        'from': f'node_{node_id - 1}',
                        'to': f'node_{node_id}'
                    })

                node_id += 1

        return {'nodes': nodes, 'edges': edges}
```

**验收标准**:
- [ ] 基于request_id关联日志
- [ ] 基于时间窗口关联日志
- [ ] 生成有向图结构
- [ ] 标记错误节点

---

### 任务3.3: 实现根因定位器
**文件**: `app/log_analyzer/root_cause_finder.py`

**实现内容**:
```python
from typing import Dict, Any, List
from app.common.llm_client import LLMClient

class RootCauseFinder:
    """根因定位器"""

    def __init__(self, llm_client: LLMClient):
        self.llm_client = llm_client

    async def find_root_cause(
        self,
        anomalies: List[Dict[str, Any]],
        log_entries: List[LogEntry],
        call_chain: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        定位根本原因

        业务逻辑:
        1. 提取关键错误日志
        2. 获取错误前后的上下文日志
        3. 调用LLM分析根因
        4. 解析LLM返回的结构化结果
        5. 关联到具体代码位置

        返回: {
            primary_cause: {description, confidence, evidence, related_code},
            secondary_causes: []
        }
        """
        # 提取最严重的异常
        critical_anomalies = [a for a in anomalies if a['severity'] == 'high']
        if not critical_anomalies:
            critical_anomalies = anomalies[:3]  # 取前3个

        # 获取上下文日志
        context_logs = self._get_context_logs(critical_anomalies, log_entries)

        # 调用LLM分析
        analysis_result = await self.llm_client.analyze_logs(
            log_entries=context_logs,
            analysis_type='root_cause'
        )

        # 关联代码位置
        if analysis_result.get('related_file'):
            code_location = await self._find_code_location(
                analysis_result['related_file'],
                analysis_result.get('error_message')
            )
            analysis_result['related_code'] = code_location

        return {
            'primary_cause': analysis_result,
            'secondary_causes': []
        }

    def _get_context_logs(
        self,
        anomalies: List[Dict],
        all_logs: List[LogEntry],
        context_seconds: int = 10
    ) -> List[Dict]:
        """获取异常前后的上下文日志"""
        context_logs = []
        for anomaly in anomalies:
            timestamp = anomaly['timestamp']
            # 获取前后10秒的日志
            for log in all_logs:
                time_diff = abs((log.timestamp - timestamp).total_seconds())
                if time_diff <= context_seconds:
                    context_logs.append({
                        'timestamp': log.timestamp.isoformat(),
                        'level': log.log_level,
                        'module': log.module_name,
                        'message': log.message
                    })
        return context_logs

    async def _find_code_location(
        self,
        file_path: str,
        error_message: str
    ) -> Dict[str, Any]:
        """查找代码位置（通过向量检索）"""
        # 调用code_explainer模块的搜索功能
        # 这里简化处理，实际应该调用code_searcher
        return {
            'file_path': file_path,
            'line_number': None
        }
```

**验收标准**:
- [ ] 提取关键错误日志
- [ ] 获取上下文日志
- [ ] LLM分析返回结构化结果
- [ ] 置信度>0.8

---

### 任务3.4: 实现分析服务
**文件**: `app/log_analyzer/service.py`

**实现内容**:
```python
from typing import Dict, Any
from app.log_analyzer.anomaly_detector import AnomalyDetector
from app.log_analyzer.call_chain_builder import CallChainBuilder
from app.log_analyzer.root_cause_finder import RootCauseFinder

class LogAnalyzerService:
    """日志分析服务编排"""

    def __init__(
        self,
        anomaly_detector: AnomalyDetector,
        call_chain_builder: CallChainBuilder,
        root_cause_finder: RootCauseFinder
    ):
        self.anomaly_detector = anomaly_detector
        self.call_chain_builder = call_chain_builder
        self.root_cause_finder = root_cause_finder

    async def analyze(
        self,
        ticket_id: int,
        analysis_types: List[str]
    ) -> Dict[str, Any]:
        """
        执行日志分析

        业务逻辑:
        1. 查询工单的所有日志
        2. 根据analysis_types执行对应分析
        3. 汇总分析结果
        4. 缓存结果到Redis

        返回: {
            anomaly_detection: {...},
            root_cause: {...},
            call_chain: {...}
        }
        """
        # 查询日志（从ClickHouse）
        log_entries = await self._get_log_entries(ticket_id)

        results = {}

        # 异常检测
        if 'anomaly' in analysis_types:
            anomalies = await self.anomaly_detector.detect_anomalies(log_entries)
            results['anomaly_detection'] = {'anomalies': anomalies}

        # 调用链分析
        if 'call_chain' in analysis_types:
            call_chain = await self.call_chain_builder.build_call_chain(log_entries)
            results['call_chain'] = call_chain

        # 根因定位
        if 'root_cause' in analysis_types:
            anomalies = results.get('anomaly_detection', {}).get('anomalies', [])
            if not anomalies:
                anomalies = await self.anomaly_detector.detect_anomalies(log_entries)

            call_chain = results.get('call_chain')
            if not call_chain:
                call_chain = await self.call_chain_builder.build_call_chain(log_entries)

            root_cause = await self.root_cause_finder.find_root_cause(
                anomalies, log_entries, call_chain
            )
            results['root_cause'] = root_cause

        return results

    async def _get_log_entries(self, ticket_id: int) -> List[LogEntry]:
        """从ClickHouse查询日志"""
        # 实现ClickHouse查询
        pass
```

**验收标准**:
- [ ] 支持多种分析类型
- [ ] 分析结果完整
- [ ] 缓存到Redis
- [ ] 分析时间<1分钟

---

### 任务3.5: 实现Celery任务
**文件**: `app/log_analyzer/tasks.py`

**实现内容**:
```python
from celery import Task
from app.celery_app import celery_app

@celery_app.task(bind=True, max_retries=3)
def analyze_logs_task(self: Task, ticket_id: int, analysis_types: List[str]):
    """
    异步日志分析任务

    业务逻辑:
    1. 更新任务状态为processing
    2. 执行分析
    3. 保存结果到数据库
    4. 更新任务状态为completed
    5. 发送WebSocket通知
    """
    try:
        # 更新进度
        self.update_state(state='PROGRESS', meta={'progress': 10, 'step': '加载日志'})

        # 执行分析
        service = LogAnalyzerService(...)
        results = await service.analyze(ticket_id, analysis_types)

        # 保存结果
        self.update_state(state='PROGRESS', meta={'progress': 90, 'step': '保存结果'})
        await save_analysis_results(ticket_id, results)

        return {'status': 'completed', 'results': results}

    except Exception as e:
        self.retry(exc=e, countdown=60)
```

**验收标准**:
- [ ] 任务进度实时更新
- [ ] 失败自动重试
- [ ] WebSocket通知
- [ ] 结果持久化

---

### 任务3.6: 实现API路由
**文件**: `app/log_analyzer/router.py`

**实现内容**:
```python
from fastapi import APIRouter, Depends
from app.log_analyzer.tasks import analyze_logs_task

router = APIRouter(prefix="/api/v1/analysis", tags=["analysis"])

@router.post("/start")
async def start_analysis(
    ticket_id: int,
    analysis_types: List[str],
    current_user = Depends(get_current_user)
):
    """开始分析"""
    task = analyze_logs_task.delay(ticket_id, analysis_types)
    return success_response(data={
        'task_id': task.id,
        'status': 'processing'
    })

@router.get("/results/{task_id}")
async def get_analysis_results(
    task_id: str,
    current_user = Depends(get_current_user)
):
    """获取分析结果"""
    task = analyze_logs_task.AsyncResult(task_id)

    if task.state == 'PENDING':
        return success_response(data={'status': 'pending'})
    elif task.state == 'PROGRESS':
        return success_response(data={
            'status': 'processing',
            'progress': task.info.get('progress', 0),
            'step': task.info.get('step', '')
        })
    elif task.state == 'SUCCESS':
        return success_response(data={
            'status': 'completed',
            'results': task.result
        })
    else:
        return error_response(message='分析失败')
```

**验收标准**:
- [ ] 异步任务提交
- [ ] 进度查询
- [ ] 结果获取
- [ ] 错误处理

---

## 4. 依赖模块

- app.log_collector (日志数据)
- app.common.llm_client (LLM调用)
- app.code_explainer (代码位置查找)

---

## 5. 实现顺序

1. 异常检测器 → 2. 调用链构建器 → 3. 根因定位器 → 4. 分析服务 → 5. Celery任务 → 6. API路由

---

## 6. 完成标准

- [ ] 所有任务完成
- [ ] 根因定位准确率>80%
- [ ] 分析时间<1分钟
- [ ] 测试通过

---

**文档结束**
