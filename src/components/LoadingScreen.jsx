export default function LoadingScreen({ text = '載入中' }) {
  return (
    <div className="loading-screen" role="status" aria-live="polite" aria-busy="true">
      <div className="loading-screen__logo site-logo" aria-hidden="true">
        Tr
        <span className="site-logo__i loading-screen__i">
          <span className="loading-screen__triangle" />
          i
        </span>
        angle
      </div>
      <p className="loading-screen__text">{text}</p>
    </div>
  );
}
