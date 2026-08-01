import { Link } from 'react-router-dom';
import { RiShoppingBag4Line } from 'react-icons/ri';
import { MdOutlineAccountCircle, MdMenu } from 'react-icons/md';
import MobileMenu from './MobileMenu';
import { useState } from 'react';
import {
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  ResetSuccess,
} from '@/features/auth/components/Login';
import { useCart } from '@/features/cart/context/CartContext';
import { useAuth } from '@/features/auth/context/AuthContext';

export default function Navbar() {
  const [modal, setModal] = useState(null);
  const [resetAccount, setResetAccount] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();
  const { user, login, logout } = useAuth();

  const closeModal = () => setModal(null);

  const handleAuthSuccess = (loggedInUser) => {
    login(loggedInUser, localStorage.getItem('token'));
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <nav className="navbar sticky-top navbar-expand-lg site-navbar">
        <div className="container">
          <Link className="navbar-brand site-logo" to="/">
            Tr<span className="site-logo__i">i</span>angle
          </Link>
          <button
            className="navbar-toggler d-lg-none"
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="開啟選單"
          >
            <MdMenu size={24} />
          </button>
          <div className="collapse navbar-collapse justify-content-center d-none d-lg-flex" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item"><Link className="nav-link" to="/">首頁</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/explore">尋找課程</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/FAQ">FAQ</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/about">關於</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/contact">聯絡我們</Link></li>
            </ul>
          </div>
          <div className="navbar-icons">
            <Link to="/cart" className="navbar-icons__cart" aria-label="購物車">
              <RiShoppingBag4Line size={22} />
              {count > 0 && <span className="navbar-icons__badge">{count}</span>}
            </Link>
            {user ? (
              <Link to="/profile" aria-label="我的帳戶" title={user.name}>
                <MdOutlineAccountCircle size={24} />
              </Link>
            ) : (
              <button type="button" aria-label="登入" onClick={() => setModal('login')}>
                <MdOutlineAccountCircle size={24} />
              </button>
            )}
          </div>
        </div>
      </nav>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
        onLogin={() => setModal('login')}
      />

      <Login
        show={modal === 'login'}
        onClose={closeModal}
        onRegister={() => setModal('register')}
        onForgotPassword={() => setModal('forgot')}
        onSuccess={handleAuthSuccess}
      />
      <Register
        show={modal === 'register'}
        onClose={closeModal}
        onLogin={() => setModal('login')}
        onSuccess={handleAuthSuccess}
      />
      <ForgotPassword
        show={modal === 'forgot'}
        onClose={closeModal}
        onBack={() => setModal('login')}
        onSent={(account) => {
          setResetAccount(account);
          setModal('reset');
        }}
      />
      <ResetPassword
        show={modal === 'reset'}
        onClose={closeModal}
        account={resetAccount}
        onComplete={() => setModal('resetSuccess')}
      />
      <ResetSuccess
        show={modal === 'resetSuccess'}
        onClose={closeModal}
        onLogin={() => setModal('login')}
      />
    </>
  );
}
