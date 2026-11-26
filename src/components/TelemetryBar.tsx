import type { MockFrame } from '@/mocks/frame'
import { formatNumber } from '@/utils/format'

interface TelemetryBarProps {
  frame: MockFrame
}

export default function TelemetryBar({ frame }: TelemetryBarProps) {
  return (
    <div className="telemetry" role="status" aria-label="帧遥测">
      <span>FRAME 12 / 4</span>
      <span className="t-sep" aria-hidden="true" />
      <span>INPUT {formatNumber(frame.tokens)}</span>
      <span className="t-sep" aria-hidden="true" />
      <span>KEPT {formatNumber(frame.keptTokens)}</span>
      <span className="t-sep" aria-hidden="true" />
      <span>DROPPED {formatNumber(frame.droppedTokens)}</span>
      <span className="t-sep" aria-hidden="true" />
      <span>MATCH {frame.matchCount}</span>
      <span className="t-sep" aria-hidden="true" />
      <span className="t-ok">{frame.validationOk ? 'SYNC OK' : 'CHECK'}</span>
      <span className="t-right">LOCAL · 127.0.0.1:8787</span>
    </div>
  )
}
