export type Role = 'user' | 'assistant'

export type MockBlock =
  | { type: 'text'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'tool_use'; name: string; target: string; preview: string }
  | { type: 'tool_result'; label: string; preview: string; tag: string }

export interface MockMessage {
  id: string
  role: Role
  time: string
  tokens: number
  blocks: MockBlock[]
  dropped?: boolean
}

export interface MockFrame {
  id: string
  title: string
  time: string
  model: string
  stream: boolean
  toolCalls: number
  tokens: number
  keptTokens: number
  droppedTokens: number
  matchCount: number
  validationOk: boolean
  usage: { input: number; cacheRead: number; cacheCreation: number }
  composition: { system: number; tools: number; messages: number }
  messages: MockMessage[]
}

export interface MockFrameRef {
  id: string
  label: string
  tokens: number
  active?: boolean
}

export interface MockSession {
  id: string
  title: string
  meta: string
  frames?: MockFrameRef[]
  active?: boolean
}

export const sessions: MockSession[] = [
  {
    id: 'session-compaction',
    title: '上下文压缩分析',
    meta: '4 帧 · 更新于 14:32',
    active: true,
    frames: [
      { id: 'frame-12', label: '#12 · 14:32', tokens: 18432, active: true },
      { id: 'frame-11', label: '#11 · 14:28', tokens: 16907 },
      { id: 'frame-10', label: '#10 · 14:21', tokens: 15220 }
    ]
  },
  {
    id: 'session-proxy',
    title: 'Claude Code · 代理捕获',
    meta: '手动合并 · 3 帧'
  },
  {
    id: 'session-unmerged',
    title: '未归并捕获',
    meta: '2 条 · 待处理'
  }
]

export const mockFrame: MockFrame = {
  id: 'frame-12',
  title: '上下文压缩分析',
  time: '14:32:08',
  model: 'claude-sonnet-5',
  stream: true,
  toolCalls: 3,
  tokens: 18432,
  keptTokens: 12840,
  droppedTokens: 5592,
  matchCount: 3,
  validationOk: true,
  usage: { input: 18432, cacheRead: 2048, cacheCreation: 0 },
  composition: { system: 3104, tools: 3096, messages: 12232 },
  messages: [
    {
      id: 'msg-1',
      role: 'user',
      time: '14:31:52',
      tokens: 86,
      blocks: [
        { type: 'text', text: '帮我检查一下 MessageCard 为什么会重复渲染，并给出修改建议。' }
      ]
    },
    {
      id: 'msg-2',
      role: 'assistant',
      time: '14:31:58',
      tokens: 1204,
      blocks: [
        { type: 'text', text: '我先看一下组件实现和它的调用链，再定位重复渲染的来源。' },
        {
          type: 'tool_use',
          name: 'Read',
          target: 'src/components/MessageCard.tsx',
          preview: '{\n  "file_path": "src/components/MessageCard.tsx",\n  "limit": 240\n}'
        }
      ]
    },
    {
      id: 'msg-3',
      role: 'user',
      time: '14:32:01',
      tokens: 3110,
      blocks: [
        {
          type: 'tool_result',
          label: '240 行 · 代码已折叠',
          tag: 'file',
          preview:
            "export function MessageCard({ message, selection, onToggle }) {\n  const blocks = useMemo(() => normalize(message.blocks), [message])\n  return (\n    <article className={cn('msg', selection[message.id])}>\n      {blocks.map(renderBlock)}\n    </article>\n  )\n}"
        }
      ]
    },
    {
      id: 'msg-4',
      role: 'assistant',
      time: '14:32:04',
      tokens: 1620,
      dropped: true,
      blocks: [
        {
          type: 'text',
          text: '另外我注意到项目里还保留了旧的渲染路径，那段代码可能已经不再被引用，建议一并清理。'
        }
      ]
    },
    {
      id: 'msg-5',
      role: 'assistant',
      time: '14:32:06',
      tokens: 2480,
      blocks: [
        {
          type: 'text',
          text: '重复渲染的原因是父组件每次渲染都会传入新的内联对象，导致 memo 比较失效。'
        },
        {
          type: 'list',
          items: [
            '将 options 提升为模块级常量或使用 useMemo',
            '把 onToggle 用 useCallback 固定引用',
            '拆分大对象 props，避免无关字段触发更新'
          ]
        }
      ]
    }
  ]
}
