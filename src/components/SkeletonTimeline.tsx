interface SkeletonTimelineProps {
  rows?: number
}

export default function SkeletonTimeline({ rows = 3 }: SkeletonTimelineProps) {
  return (
    <div className="skeleton-stack" role="status" aria-label="上下文加载中">
      {Array.from({ length: rows }, (_, index) => (
        <div className="skeleton-row" key={index}>
          <div className="skeleton-line" style={{ width: '18%' }} />
          <div className="skeleton-line" style={{ width: '86%' }} />
          <div className="skeleton-line" style={{ width: '64%' }} />
        </div>
      ))}
    </div>
  )
}
