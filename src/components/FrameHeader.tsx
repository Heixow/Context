import type { MockFrame } from '@/mocks/frame'
import { formatNumber } from '@/utils/format'

const sparkHeights = [30, 55, 42, 70, 48, 82, 52, 66, 38, 76, 60, 92, 47, 71, 56, 86, 40, 62]
const hotIndexes = new Set([2, 7, 11, 17])

interface FrameHeaderProps {
  frame: MockFrame
}

export default function FrameHeader({ frame }: FrameHeaderProps) {
  return (
    <div className="frame-head">
      <div>
        <h1>{frame.title}</h1>
        <div className="meta">
          帧 #12 · {frame.time} · {frame.toolCalls} 条工具调用 · {frame.stream ? '流式' : '非流式'}
        </div>
      </div>
      <div className="tokens">
        <b>{formatNumber(frame.tokens)}</b> input tokens
        <div className="spark" aria-hidden="true">
          {sparkHeights.map((height, index) => (
            <i
              key={index}
              className={hotIndexes.has(index) ? 'hot' : undefined}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
