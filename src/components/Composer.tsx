export default function Composer() {
  return (
    <form className="composer" onSubmit={(event) => event.preventDefault()}>
      <input
        className="composer-input"
        placeholder="继续输入；发送前将自动匹配已标注内容"
        aria-label="输入消息"
      />
      <button className="send" type="submit">
        发送
      </button>
    </form>
  )
}
