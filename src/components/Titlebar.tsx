import { useState } from 'react'

export type Theme = 'light' | 'dark'

interface TitlebarProps {
  theme: Theme
  onToggleTheme: () => void
  onOpenKit: () => void
}

export default function Titlebar({ theme, onToggleTheme, onOpenKit }: TitlebarProps) {
  const [mode, setMode] = useState<'auto' | 'suggest'>('auto')

  return (
    <header className="titlebar">
      <div className="brand">
        <span className="mark" aria-hidden="true" />
        Agent Context Visualizer
      </div>
      <div className="crumbs">
        当前会话 <span aria-hidden="true">›</span> <b>帧 #12</b>
      </div>
      <div className="actions">
        <span className="chip">Anthropic · claude-sonnet-5</span>
        <div className="seg" role="group" aria-label="自动匹配策略">
          <button
            type="button"
            className={mode === 'auto' ? 'seg-item seg-item-on' : 'seg-item'}
            aria-pressed={mode === 'auto'}
            onClick={() => setMode('auto')}
          >
            自动生效
          </button>
          <button
            type="button"
            className={mode === 'suggest' ? 'seg-item seg-item-on' : 'seg-item'}
            aria-pressed={mode === 'suggest'}
            onClick={() => setMode('suggest')}
          >
            仅建议
          </button>
        </div>
        <button type="button" className="theme-btn" onClick={onOpenKit} aria-label="打开组件图鉴">
          KIT
        </button>
        <button
          type="button"
          className="theme-btn"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'}
        >
          {theme === 'dark' ? 'DARK' : 'LIGHT'}
        </button>
      </div>
    </header>
  )
}
