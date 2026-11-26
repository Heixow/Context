import type { MockBlock, MockMessage } from '@/mocks/frame'
import { formatNumber } from '@/utils/format'

function renderBlock(block: MockBlock, index: number) {
  switch (block.type) {
    case 'text':
      return <p key={index}>{block.text}</p>
    case 'list':
      return (
        <ul key={index}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )
    case 'tool_use':
      return (
        <div className="tooluse" key={index}>
          <div className="tool-head">
            <span className="tool-name">{block.name}</span>
            <span>{block.target}</span>
            <span className="tag">tool_use</span>
          </div>
          <pre className="code">{block.preview}</pre>
        </div>
      )
    case 'tool_result':
      return (
        <div className="toolresult" key={index}>
          <div className="tool-head">
            <span className="tool-name">tool_result</span>
            <span>{block.label}</span>
            <span className="tag">{block.tag}</span>
          </div>
          <pre className="code">{block.preview}</pre>
        </div>
      )
    default:
      return null
  }
}

interface MessageCardProps {
  message: MockMessage
}

export default function MessageCard({ message }: MessageCardProps) {
  return (
    <article className={message.dropped ? 'msg msg-dropped' : 'msg'}>
      <div className="msg-head">
        <span className="role">{message.role.toUpperCase()}</span>
        <span className="time">{message.time}</span>
        {message.dropped ? (
          <span className="drop-tag">已丢弃 · 指纹匹配</span>
        ) : (
          <span className="tok">{formatNumber(message.tokens)} tok</span>
        )}
      </div>
      <div className="msg-body">{message.blocks.map(renderBlock)}</div>
    </article>
  )
}
