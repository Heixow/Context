import type { MockFrame } from '@/mocks/frame'
import { formatNumber } from '@/utils/format'

interface StatusBarProps {
  frame: MockFrame
}

export default function StatusBar({ frame }: StatusBarProps) {
  return (
    <footer className="statusbar">
      <span>session · {frame.title}</span>
      <span>frame 12 / 4</span>
      <span>本地运行 · 无数据上传</span>
      <span className="right">
        自动匹配 开 · 适用 {frame.matchCount} 条 · 保留 {formatNumber(frame.keptTokens)} /{' '}
        {formatNumber(frame.tokens)}
      </span>
    </footer>
  )
}
