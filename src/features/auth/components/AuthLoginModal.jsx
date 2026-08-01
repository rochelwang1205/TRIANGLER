import { useState } from 'react';
import { Login, Register, ForgotPassword, ResetPassword, ResetSuccess } from './Login';

import { useAuth } from '../context/AuthContext';

export default function AuthLoginModal({ show, onClose, onSuccess }) {
  const { login } = useAuth();
  const [modal, setModal] = useState('login');
  const [resetAccount, setResetAccount] = useState('');

  const closeAll = () => {
    setModal('login');
    onClose();
  };

  const handleSuccess = (loggedInUser) => {
    login(loggedInUser, localStorage.getItem('token'));
    setModal('login');
    onSuccess?.(loggedInUser);
  };

  if (!show) return null;

  return (
    <>
      <Login
        show={modal === 'login'}
        onClose={closeAll}
        onRegister={() => setModal('register')}
        onForgotPassword={() => setModal('forgot')}
        onSuccess={handleSuccess}
      />
      <Register
        show={modal === 'register'}
        onClose={closeAll}
        onLogin={() => setModal('login')}
        onSuccess={handleSuccess}
      />
      <ForgotPassword
        show={modal === 'forgot'}
        onClose={closeAll}
        onBack={() => setModal('login')}
        onSent={(account) => {
          setResetAccount(account);
          setModal('reset');
        }}
      />
      <ResetPassword
        show={modal === 'reset'}
        onClose={closeAll}
        account={resetAccount}
        onComplete={() => setModal('resetSuccess')}
      />
      <ResetSuccess
        show={modal === 'resetSuccess'}
        onClose={closeAll}
        onLogin={() => setModal('login')}
      />
    </>
  );
}
