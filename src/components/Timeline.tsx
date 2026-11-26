import MessageCard from '@/components/MessageCard'
import type { MockMessage } from '@/mocks/frame'

interface TimelineProps {
  messages: MockMessage[]
}

export default function Timeline({ messages }: TimelineProps) {
  return (
    <div className="timeline">
      <div className="sysbar">
        <span>SYSTEM + TOOLS · 6,200 tokens · 恒保留</span>
        <span>展开</span>
      </div>
      {messages.map((message) => (
        <MessageCard key={message.id} message={message} />
      ))}
    </div>
  )
}
