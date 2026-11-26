import { useEffect, useState } from 'react'
import Titlebar, { type Theme } from '@/components/Titlebar'
import TelemetryBar from '@/components/TelemetryBar'
import Sidebar from '@/components/Sidebar'
import FrameHeader from '@/components/FrameHeader'
import Timeline from '@/components/Timeline'
import Composer from '@/components/Composer'
import Inspector from '@/components/Inspector'
import StatusBar from '@/components/StatusBar'
import KitchenSink from '@/components/KitchenSink'
import { mockFrame } from '@/mocks/frame'

function getInitialTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function navigate(query: string): void {
  window.location.href = window.location.pathname + query
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const view = new URLSearchParams(window.location.search).get('view')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggleTheme = () => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))

  return (
    <div className="app-shell">
      {view === 'kit' ? (
        <KitchenSink theme={theme} onToggleTheme={toggleTheme} onExit={() => navigate('')} />
      ) : (
        <>
          <Titlebar
            theme={theme}
            onToggleTheme={toggleTheme}
            onOpenKit={() => navigate('?view=kit')}
          />
          <TelemetryBar frame={mockFrame} />
          <div className="workspace">
            <Sidebar />
            <main className="main-column">
              <FrameHeader frame={mockFrame} />
              <Timeline messages={mockFrame.messages} />
              <Composer />
            </main>
            <Inspector frame={mockFrame} />
          </div>
          <StatusBar frame={mockFrame} />
        </>
      )}
    </div>
  )
}
