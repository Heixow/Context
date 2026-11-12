# Agent Context Visualizer

> 桌面端对话级 Agent：看清模型真实收到的上下文，由人主观决定保留什么，并让这些决定在后续对话中自动匹配生效。

**当前状态：设计阶段。** 本 README 是项目基线文档，代码尚未实现。

## 1. 它是什么

一个 Electron 桌面应用，同时具备两种工作模式：

- **对话模式**：应用本身就是一个聊天客户端，用户接入自己的模型 API（Base URL / API Key / Model）。每一轮对话发送前，系统捕获将要发出的真实请求体（`system + messages + tools`），展示给用户，并允许逐条标记「保留 / 丢弃」。
- **代理模式**：内置一个本地反向代理，外部客户端（如 Claude Code）把 `ANTHROPIC_BASE_URL` 指向它，即可被动捕获同样的真实请求体。

两种模式共享同一套数据模型、可视化界面、精炼流程与导出能力。

核心主张只有一句：**模型看到的不等于聊天记录**。本工具观察的是实际发出的请求体，并让人对这个请求体做减法。

## 2. 核心概念

| 概念 | 定义 |
|---|---|
| **帧（Frame）** | 一次请求的完整上下文快照：`system`、`messages`、`tools`、`usage` |
| **会话（Session）** | 帧的有序集合。对话模式下，一次应用内对话自动成为一个会话；代理捕获的外部帧需用户手动合并 |
| **消息指纹（Fingerprint）** | `hash(role + 规范化后的 blocks)`，忽略 `cache_control` 等元字段。用于识别「同一条消息」 |
| **标注（Selection）** | 用户对消息的主观决定，稀疏存储：只记录 `drop` 或显式的 `keep` |
| **有效选择（Effective Selection）** | 会话内 `seq ≤ 当前帧` 的所有标注按序合并，同一指纹后写覆盖前写，未出现者默认 `keep` |
| **自动匹配（Auto-match）** | 发送前把有效选择按指纹应用到当前上下文，命中 `drop` 的消息被移除 |
| **种子（Seed）** | 过滤后的完整请求体 `{ model, max_tokens, system, messages, tools }`，可直接 POST `/v1/messages` |

## 3. 功能

### 3.1 对话模式（BYO API）

- 用户配置自己的模型接入：`baseUrl`、`apiKey`、`model`、`maxTokens`，可选自定义请求头
- 流式对话，展示 token 用量
- 每轮发送前生成一帧，自动归属当前会话
- 展示「本次实际发送」与「被自动匹配移除」的差异

### 3.2 代理模式

- 本地反向代理监听 `127.0.0.1:8787`，透传 `/v1/messages`，SSE 不缓冲、不改写
- 旁路落盘 `captures/<uuid>.json`，从 `message_start` 事件提取精确 `usage`
- **fail-open**：捕获或落盘的任何异常都不得影响转发结果
- 外部帧默认平铺展示，支持多选批量合并为会话

### 3.3 上下文可视化

- `system` 与 `tools` 定义完整可见
- 消息时间线：按块展示 `text` / `tool_use` / `tool_result`
- 逐条 token 分布与总量，总量以 API 返回的 `usage` 为准
- 双数据源：**API 捕获**（主，真实上下文）与 **Transcript JSONL**（备，可能已被压缩，不是模型真实看到的内容）

### 3.4 主观精炼

- 逐条切换「保留 / 丢弃」，默认保留
- 实时派生「保留 token / 总 token」
- `system` 与 `tools` 恒保留，不参与选择

### 3.5 自动匹配

- 对话模式下，用户输入消息后、请求发出前，按消息指纹自动匹配历史标注
- 两种执行策略，用户可切换：
  - **自动生效**：命中的 `drop` 直接从本次上下文移除
  - **仅建议**：高亮命中项，由用户确认后再发送
- 匹配只作用于 `messages`；跨会话不继承

### 3.6 导出

- **seed.json**：过滤后的完整请求体，可直接用于重现一次请求
- **Markdown**：人类可读的上下文快照
- 导出前必须通过配对校验（见 5.3）

## 4. 架构

### 4.1 进程与分层

```
┌─ 渲染进程（React）───────────────────────────────┐
│  聊天界面 / 捕获列表 / 会话树 / 时间线 /           │
│  消息卡 / token 图 / 工具栏                        │
└──────────────────────┬───────────────────────────┘
                       │ IPC（preload 白名单）
┌─ 主进程（Electron）──▼───────────────────────────┐
│  对话服务  组装上下文 → 自动匹配 → 配对校验 →      │
│            调用上游 → 帧落盘                       │
│  内嵌代理  外部客户端 → 上游，旁路落盘（fail-open）│
│  存储层    captures/：帧、sidecar、_sessions.json  │
│  密钥      Electron safeStorage                    │
└──────────────────────┬───────────────────────────┘
                       │ HTTPS
                 用户配置的模型 API
```

### 4.2 目录

```
CA/
├─ electron/
│  ├─ main.ts                主进程入口：窗口、IPC、服务生命周期
│  ├─ preload.ts             受控桥接（白名单方法）
│  └─ services/
│     ├─ chat.ts             对话请求管线
│     ├─ proxy.ts            反向代理（可独立运行）
│     ├─ store.ts            帧 / 标注 / 会话的读写
│     └─ secrets.ts          API Key 存取（safeStorage）
├─ src/                      渲染进程
│  ├─ lib/
│  │  ├─ types.ts            领域模型唯一真源
│  │  ├─ request.ts          请求体 → CapturedContext
│  │  ├─ parse.ts            JSONL → Transcript（回退模式）
│  │  ├─ tokens.ts           启发式 token 估算
│  │  ├─ fingerprints.ts     消息指纹计算
│  │  ├─ selection.ts        标注合并 → 有效选择
│  │  ├─ matching.ts         自动匹配引擎
│  │  ├─ validate.ts         tool_use / tool_result 配对校验
│  │  ├─ export.ts           Markdown / seed.json
│  │  └─ api.ts              前端客户端（帧 / 会话 / 标注 / 导出）
│  └─ components/            UI 组件
└─ captures/                 运行时产物（不入库）
```

### 4.3 数据模型

```ts
interface CaptureFrame {
  id: string;
  createdAt: string;
  sessionId?: string;        // 对话模式下创建即赋值；外部帧手动合并后赋值
  source: 'chat' | 'proxy';
  request: {
    model: string;
    stream: boolean;
    max_tokens?: number;
    system: SystemBlock[];
    messages: Message[];
    tools: ToolDef[];
  };
  usage: {
    input_tokens?: number;
    cache_read_input_tokens?: number;
    cache_creation_input_tokens?: number;
  };
}

interface Session {
  id: string;
  name?: string;
  frameIds: string[];        // 按 seq 递增
  createdAt: string;
  updatedAt: string;
}

interface SelectionFile {
  captureId: string;
  version: 1;
  overrides: Record<MessageFingerprint, 'drop' | 'keep'>;  // 稀疏
}
```

存储位置：

- `captures/<uuid>.json` —— 帧
- `captures/<uuid>.selection.json` —— 标注 sidecar
- `captures/_sessions.json` —— 会话索引

### 4.4 对话请求生命周期

1. 用户输入消息
2. 组装候选上下文：`system` + 历史 `messages` + `tools`
3. 计算消息指纹，合并当前会话的有效选择
4. 自动匹配：按策略移除命中 `drop` 的消息（仅作用于 `messages`）
5. 配对校验：任何 `tool_use` 被移除时，其 `tool_result` 必须同被移除；失败则阻止发送
6. 调用用户配置的 API，流式转发响应
7. 记录 `usage`，落盘为帧并自动关联当前会话
8. UI 展示本次实际上下文与被移除项

### 4.5 代理请求生命周期

1. 收到外部客户端 `POST /v1/messages`
2. 克隆请求，解析并抽取 `system / messages / tools`，剥离鉴权头
3. 原样转发上游，SSE 字节流不缓冲、不改写
4. 旁路 tee：从 `message_start` 提取 `usage`
5. 原子写盘（临时文件 → rename）
6. 捕获链路任何异常都不得改变上游响应

## 5. 规则与不变量

### 5.1 自动匹配规则

| 项 | 规则 |
|---|---|
| 匹配键 | 消息指纹 |
| 范围 | 仅同一会话内 `seq ≤ 当前帧` |
| 优先级 | 后写覆盖前写 |
| 默认值 | 未标注 = 保留 |
| 作用域 | 仅 `messages`，`system` / `tools` 恒保留 |
| 策略 | 自动生效 / 仅建议，可切换 |

### 5.2 不变量

1. API Key 绝不写入捕获文件或日志；仅存于 Electron safeStorage
2. 代理 fail-open，不改变上游响应
3. `system` 与 `tools` 恒保留
4. 选择只做减法，显式 `keep` 仅用于反悔
5. 发送与导出前必须通过配对校验
6. 逐条 token 为启发式估算，总量以 API `usage` 为准
7. 代理与本地 API 仅绑定 `127.0.0.1`

### 5.3 配对校验

- 每个保留的 `tool_use` 必须有对应且被保留的 `tool_result`
- 被移除的 `tool_use` 必须连同其 `tool_result` 一起移除
- 校验失败时给出具体消息位置，阻止发送 / 导出
- 校验只保证结构合法，不保证语义完整

### 5.4 token 估算

- CJK 字符约 1 token，其余约 4 字符 / token
- 仅用于逐条相对分布；精确值以 API `usage` 为准

## 6. 配置

### 6.1 模型接入（对话模式）

| 配置项 | 说明 |
|---|---|
| Base URL | 默认 `https://api.anthropic.com`，支持任意兼容端点 |
| API Key | 通过 Electron safeStorage 加密存储 |
| Model | 模型 ID |
| Max Tokens | 单次回复上限 |
| 自定义请求头 | 可选，用于第三方兼容网关 |

### 6.2 代理模式（环境变量）

| 变量 | 默认值 | 说明 |
|---|---|---|
| `CTX_PROXY_PORT` | `8787` | 代理监听端口 |
| `ANTHROPIC_UPSTREAM_URL` | `https://api.anthropic.com` | 上游地址 |
| `CTX_CAPTURES_DIR` | `<应用数据目录>/captures` | 捕获落盘目录 |
| `CTX_MAX_CAPTURES` | `200` | 最多保留的帧数，超出按时间淘汰 |

## 7. 安全与隐私

- 全程本地运行，不上传任何上下文数据
- `x-api-key` / `authorization` 仅透传给上游，绝不落盘、绝不写日志
- API Key 使用操作系统级加密存储（Electron safeStorage）
- 本地 API 仅监听 `127.0.0.1`；写接口校验 Origin / Host，拒绝跨站调用
- 捕获目录默认可被用户清空，不参与云同步

## 8. 已知限制

- 指纹对压缩与改写敏感：历史被 compaction 改写后，旧标注无法命中新消息
- 自动生效可能误删有语义依赖的消息；重要场景建议使用「仅建议」策略
- 逐条 token 为估算值
- `CTX_MAX_CAPTURES` 淘汰可能截断已建会话，折叠视图需容忍缺帧
- 跨会话不继承标注
- 暂不支持 `subagents/*.jsonl` 子代理会话
- 暂不支持 `--resume` 回灌；配对校验不等于语义完整性保证
- 当前不做实时请求改写，自动匹配只发生在应用自身的发送链路上

## 9. 路线图

| 阶段 | 内容 |
|---|---|
| P0 | 对话模式：模型接入、上下文可视化、逐条精炼、指纹自动匹配、seed.json 导出 |
| P1 | 代理模式：外部捕获、手动合并会话、双数据源浏览 |
| P2 | 规则匹配、语义相似匹配、会话拆分/合并的细化操作 |
| P3 | 实时干预：在请求发出前按用户规则改写上下文 |

## 10. 开发（规划中）

```bash
npm install
npm run dev      # 启动 Electron + Vite 渲染层
npm run build    # 打包桌面应用
npm run proxy    # 可选：独立启动反向代理
```

> 以上命令为设计目标，随时可能调整；实现前请以实际脚本为准。
