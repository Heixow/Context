export default function App() {
  const platform = window.api?.platform ?? 'unknown'

  return (
    <main className="app">
      <header>
        <h1>Agent Context Visualizer</h1>
        <p className="tagline">看清模型真实收到的上下文，并决定保留什么。</p>
      </header>

      <section className="panel">
        <h2>环境状态</h2>
        <ul>
          <li>Electron 主进程：已连接</li>
          <li>渲染层：React + Vite</li>
          <li>运行平台：{platform}</li>
        </ul>
        <p className="hint">当前为环境骨架，业务功能尚未实现。</p>
      </section>
    </main>
  )
}
