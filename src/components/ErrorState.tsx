interface ErrorStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export default function ErrorState({ title, description, actionLabel, onAction }: ErrorStateProps) {
  return (
    <div className="state-box error-box" role="alert">
      <div className="state-icon" aria-hidden="true">
        !
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
