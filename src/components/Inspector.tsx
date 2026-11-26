import type { MockFrame } from '@/mocks/frame'
import { formatNumber, formatPercent } from '@/utils/format'

const RADIUS = 34
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface InspectorProps {
  frame: MockFrame
}

export default function Inspector({ frame }: InspectorProps) {
  const ratio = frame.keptTokens / frame.tokens
  const offset = CIRCUMFERENCE * (1 - ratio)
  const composition = [
    { label: 'SYSTEM', value: frame.composition.system },
    { label: 'TOOLS', value: frame.composition.tools },
    { label: 'MESSAGES', value: frame.composition.messages }
  ]

  return (
    <aside className="inspector" aria-label="上下文检查器">
      <div className="tabs">
        <button type="button" className="tab-on">
          概览
        </button>
        <button type="button">SYSTEM</button>
        <button type="button">TOOLS</button>
      </div>

      <div className="gauge-row">
        <div className="gauge">
          <svg width="86" height="86" viewBox="0 0 86 86" aria-hidden="true">
            <circle cx="43" cy="43" r={RADIUS} fill="none" stroke="var(--bar-bg)" strokeWidth="6" />
            <circle
              cx="43"
              cy="43"
              r={RADIUS}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="6"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              transform="rotate(-90 43 43)"
            />
            <circle
              cx="43"
              cy="43"
              r="41"
              fill="none"
              stroke="var(--line)"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
          </svg>
          <div className="gauge-label">
            <b>{formatPercent(ratio, 0)}</b>
            <span>保留</span>
          </div>
        </div>
        <div className="gauge-stats">
          <div className="stat-row">
            <span>总上下文</span>
            <b>{formatNumber(frame.tokens)}</b>
          </div>
          <div className="stat-row">
            <span>保留</span>
            <b>{formatNumber(frame.keptTokens)}</b>
          </div>
          <div className="stat-row">
            <span>丢弃</span>
            <b>{formatNumber(frame.droppedTokens)}</b>
          </div>
        </div>
      </div>

      <div>
        <div className="section-label">构成</div>
        <div className="breakdown">
          {composition.map((item) => (
            <div className="brow" key={item.label}>
              <span>{item.label}</span>
              <div className="mini">
                <span style={{ width: `${(item.value / frame.tokens) * 100}%` }} />
              </div>
              <span className="num">{formatNumber(item.value)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="matchbox">
        <div className="match-title">
          <span>自动匹配</span>
          <span className="ok">已生效</span>
        </div>
        <div className="match-row">
          <span>命中 drop 规则</span>
          <span>{frame.matchCount} 条</span>
        </div>
        <div className="match-row">
          <span>tool 配对校验</span>
          <span className={frame.validationOk ? 'ok' : undefined}>
            {frame.validationOk ? '通过' : '待检查'}
          </span>
        </div>
        <div className="match-row">
          <span>作用范围</span>
          <span>仅 messages</span>
        </div>
      </div>

      <div className="matchbox">
        <div className="match-title">
          <span>精确用量</span>
          <span>API</span>
        </div>
        <div className="match-row">
          <span>input_tokens</span>
          <span>{formatNumber(frame.usage.input)}</span>
        </div>
        <div className="match-row">
          <span>cache_read</span>
          <span>{formatNumber(frame.usage.cacheRead)}</span>
        </div>
        <div className="match-row">
          <span>cache_creation</span>
          <span>{formatNumber(frame.usage.cacheCreation)}</span>
        </div>
      </div>
    </aside>
  )
}
