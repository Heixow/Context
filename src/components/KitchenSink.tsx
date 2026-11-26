import MessageCard from '@/components/MessageCard'
import SkeletonTimeline from '@/components/SkeletonTimeline'
import EmptyState from '@/components/EmptyState'
import ErrorState from '@/components/ErrorState'
import type { MockMessage } from '@/mocks/frame'

interface KitchenSinkProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onExit: () => void
}

const swatches = [
  { label: '画布', token: '--bg', color: 'var(--bg)' },
  { label: '面板', token: '--panel', color: 'var(--panel)' },
  { label: '正文', token: '--ink', color: 'var(--ink)' },
  { label: '次级', token: '--muted', color: 'var(--muted)' },
  { label: '信号', token: '--accent', color: 'var(--accent)' },
  { label: '丢弃', token: '--drop-ink', color: 'var(--drop-ink)' }
]

const exampleMessages: MockMessage[] = [
  {
    id: 'kit-1',
    role: 'assistant',
    time: '14:32:06',
    tokens: 2480,
    blocks: [
      {
        type: 'text',
        text: '默认消息：正文使用 Geist，元数据使用 Geist Mono，数字启用 tabular-nums。'
      }
    ]
  },
  {
    id: 'kit-2',
    role: 'assistant',
    time: '14:32:04',
    tokens: 1620,
    dropped: true,
    blocks: [{ type: 'text', text: '丢弃态消息：降低不透明度并加删除线，同时显示命中原因。' }]
  },
  {
    id: 'kit-3',
    role: 'assistant',
    time: '14:31:58',
    tokens: 1204,
    blocks: [
      { type: 'text', text: '工具调用块：' },
      {
        type: 'tool_use',
        name: 'Read',
        target: 'src/components/MessageCard.tsx',
        preview: '{\n  "file_path": "src/components/MessageCard.tsx"\n}'
      }
    ]
  },
  {
    id: 'kit-4',
    role: 'user',
    time: '14:32:01',
    tokens: 3110,
    blocks: [
      {
        type: 'tool_result',
        label: '240 行 · 代码已折叠',
        tag: 'file',
        preview:
          'export function MessageCard(props) {\n  return <article>{props.children}</article>\n}'
      }
    ]
  }
]

export default function KitchenSink({ theme, onToggleTheme, onExit }: KitchenSinkProps) {
  return (
    <div className="kit">
      <header className="kit-header">
        <div>
          <div className="kit-eyebrow">M0 · DESIGN SYSTEM</div>
          <h1>组件图鉴</h1>
          <p className="kit-sub">基础组件与完整状态；亮暗双模式同步验收。</p>
        </div>
        <div className="kit-actions">
          <button type="button" className="theme-btn" onClick={onToggleTheme}>
            {theme === 'dark' ? 'DARK' : 'LIGHT'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onExit}>
            返回应用
          </button>
        </div>
      </header>

      <section className="kit-section">
        <h2>色彩</h2>
        <div className="kit-swatches">
          {swatches.map((swatch) => (
            <div className="swatch" key={swatch.token}>
              <div className="swatch-chip" style={{ background: swatch.color }} />
              <div className="swatch-label">{swatch.label}</div>
              <div className="swatch-token">{swatch.token}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="kit-section">
        <h2>字体</h2>
        <div className="kit-grid">
          <div className="kit-card">
            <div className="kit-note">DISPLAY · GEIST 600</div>
            <div className="type-display">Context</div>
          </div>
          <div className="kit-card">
            <div className="kit-note">BODY · 13PX / 1.65</div>
            <p className="type-body">消息正文保持常规行高与字号，密度只作用于元数据。</p>
          </div>
          <div className="kit-card">
            <div className="kit-note">MONO · TABULAR NUMS</div>
            <div className="type-mono">input_tokens 18,432</div>
            <div className="type-mono">cache_read 2,048</div>
          </div>
        </div>
      </section>

      <section className="kit-section">
        <h2>控件</h2>
        <div className="kit-grid">
          <div className="kit-card">
            <div className="kit-note">BUTTONS</div>
            <div className="kit-row">
              <button type="button" className="btn">
                发送
              </button>
              <button type="button" className="btn btn-secondary">
                仅建议
              </button>
              <button type="button" className="btn btn-ghost">
                展开
              </button>
              <button type="button" className="btn" disabled>
                不可用
              </button>
            </div>
          </div>
          <div className="kit-card">
            <div className="kit-note">CHIPS & TAGS</div>
            <div className="kit-row">
              <span className="chip">Anthropic · claude-sonnet-5</span>
              <span className="tag">tool_use</span>
              <span className="tag">file</span>
              <span className="drop-tag">已丢弃 · 指纹匹配</span>
            </div>
          </div>
          <div className="kit-card">
            <div className="kit-note">INPUT</div>
            <input
              className="composer-input"
              placeholder="搜索捕获、消息或工具"
              aria-label="搜索"
            />
            <input
              className="composer-input input-error"
              defaultValue="已失效的捕获 id"
              aria-label="错误示例"
              aria-invalid="true"
            />
            <div className="input-error-text">捕获不存在或已被淘汰。</div>
          </div>
        </div>
      </section>

      <section className="kit-section">
        <h2>消息块</h2>
        <div className="kit-messages">
          {exampleMessages.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))}
        </div>
      </section>

      <section className="kit-section">
        <h2>数据</h2>
        <div className="kit-grid">
          <div className="kit-card">
            <div className="kit-note">RETAINED</div>
            <div className="gauge">
              <svg width="86" height="86" viewBox="0 0 86 86" aria-hidden="true">
                <circle cx="43" cy="43" r="34" fill="none" stroke="var(--bar-bg)" strokeWidth="6" />
                <circle
                  cx="43"
                  cy="43"
                  r="34"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="6"
                  strokeDasharray="213.6"
                  strokeDashoffset="64"
                  transform="rotate(-90 43 43)"
                />
              </svg>
              <div className="gauge-label">
                <b>70%</b>
                <span>保留</span>
              </div>
            </div>
          </div>
          <div className="kit-card kit-card-wide">
            <div className="kit-note">COMPOSITION</div>
            <div className="breakdown">
              <div className="brow">
                <span>SYSTEM</span>
                <div className="mini">
                  <span style={{ width: '17%' }} />
                </div>
                <span className="num">3,104</span>
              </div>
              <div className="brow">
                <span>TOOLS</span>
                <div className="mini">
                  <span style={{ width: '17%' }} />
                </div>
                <span className="num">3,096</span>
              </div>
              <div className="brow">
                <span>MESSAGES</span>
                <div className="mini">
                  <span style={{ width: '66%' }} />
                </div>
                <span className="num">12,232</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="kit-section">
        <h2>状态</h2>
        <div className="kit-grid kit-grid-states">
          <div className="kit-card">
            <div className="kit-note">LOADING</div>
            <SkeletonTimeline rows={2} />
          </div>
          <div className="kit-card">
            <div className="kit-note">EMPTY</div>
            <EmptyState
              title="还没有捕获"
              description="把客户端指向 127.0.0.1:8787，或在应用内发起一次对话。"
              actionLabel="查看接入方式"
            />
          </div>
          <div className="kit-card">
            <div className="kit-note">ERROR</div>
            <ErrorState
              title="配对校验未通过"
              description="消息 msg-4 的 tool_use 已被丢弃，但对应的 tool_result 仍在保留集合中。"
              actionLabel="定位问题"
            />
          </div>
        </div>
      </section>

      <section className="kit-section">
        <h2>规则速查</h2>
        <ul className="kit-rules">
          <li>不使用 Inter、纯黑、紫蓝霓虹渐变与 emoji。</li>
          <li>单一强调色为琥珀；红色只表示丢弃与错误。</li>
          <li>数字一律等宽并启用 tabular-nums。</li>
          <li>发光只用于状态点、进度条与激活下划线。</li>
          <li>动效只做 transform / opacity，并服从 reduced-motion。</li>
        </ul>
      </section>
    </div>
  )
}
