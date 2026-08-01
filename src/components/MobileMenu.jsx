import { Link } from 'react-router-dom';
import { MdClose } from 'react-icons/md';

export default function MobileMenu({ open, onClose, user, onLogin }) {
  if (!open) return null;

  return (
    <div className="mobile-menu">
      <button type="button" className="mobile-menu__close" onClick={onClose} aria-label="關閉選單">
        <MdClose size={32} />
      </button>
      <nav className="mobile-menu__nav">
        {user ? (
          <Link to="/profile" onClick={onClose}>我的帳戶</Link>
        ) : (
          <button type="button" onClick={() => { onLogin(); onClose(); }}>我的帳戶</button>
        )}
        <Link to="/" onClick={onClose}>首頁</Link>
        <Link to="/explore" onClick={onClose}>尋找課程</Link>
        <Link to="/FAQ" onClick={onClose}>FAQ</Link>
        <Link to="/about" onClick={onClose}>關於</Link>
        <Link to="/contact" onClick={onClose}>聯絡我們</Link>
      </nav>
    </div>
  );
}
