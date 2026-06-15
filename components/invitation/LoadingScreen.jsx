import './LoadingScreen.css'

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-ring-wrap">
        <div className="loading-ring" />
        <span className="loading-flower">❦</span>
      </div>
      <p className="loading-text">Đang tải...</p>
    </div>
  )
}
