interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="state-box">
      <div className="state-icon" aria-hidden="true">
        +
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && (
        <button type="button" className="btn btn-secondary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
