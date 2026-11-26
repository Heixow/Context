import { sessions } from '@/mocks/frame'
import { formatNumber } from '@/utils/format'

export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="会话列表">
      <div className="side-head">
        <span>会话</span>
        <button type="button" className="side-action">
          ＋ 合并
        </button>
      </div>

      <div className="search">搜索捕获、消息或工具</div>

      {sessions.map((session) => (
        <div key={session.id} className={session.active ? 'sess sess-on' : 'sess'}>
          <div className="sess-title">{session.title}</div>
          <div className="sess-meta">{session.meta}</div>
          {session.frames && (
            <div className="frames">
              {session.frames.map((frame) => (
                <div key={frame.id} className={frame.active ? 'frame frame-on' : 'frame'}>
                  <span>{frame.label}</span>
                  <span>{formatNumber(frame.tokens)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="side-foot">
        <span className="dot" aria-hidden="true" />
        127.0.0.1:8787 · 代理开启
      </div>
    </aside>
  )
}
