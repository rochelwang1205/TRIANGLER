import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useProfile } from '@/features/profile/api/useProfile';
import { useUpdateProfile, useUpdatePassword } from '@/features/settings/api/useSettings';
import AuthLoginModal from '@/features/auth/components/AuthLoginModal';

export default function Settings() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const { data: profile } = useProfile({ enabled: isLoggedIn });
  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();

  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) setShowLogin(true);
  }, [isLoggedIn]);

  useEffect(() => {
    if (profile) {
      setProfileForm({ name: profile.user.name, email: profile.email });
    }
  }, [profile]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await updateProfile.mutateAsync(profileForm);
      setMessage('個人資料已更新');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await updatePassword.mutateAsync(passwordForm);
      setMessage('密碼已更新');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="profile-page">
        <div className="container text-center">
          <h1 className="page-title">設定</h1>
          <p className="auth-gate-hint">請先登入</p>
        </div>
        <AuthLoginModal show={showLogin} onClose={() => navigate('/')} onSuccess={() => setShowLogin(false)} />
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="container">
        <h1 className="page-title">設定</h1>

        {message && <p className="settings-message">{message}</p>}

        <section className="settings-section">
          <h3>個人資料</h3>
          <form className="settings-form" onSubmit={handleProfileSubmit}>
            <div className="settings-form__field">
              <label htmlFor="name">姓名</label>
              <input
                id="name"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              />
            </div>
            <div className="settings-form__field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={updateProfile.isPending}>
              儲存
            </button>
          </form>
        </section>

        <section className="settings-section">
          <h3>變更密碼</h3>
          <form className="settings-form" onSubmit={handlePasswordSubmit}>
            <div className="settings-form__field">
              <label htmlFor="currentPassword">目前密碼</label>
              <input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              />
            </div>
            <div className="settings-form__field">
              <label htmlFor="newPassword">新密碼</label>
              <input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </div>
            <div className="settings-form__field">
              <label htmlFor="confirmPassword">確認新密碼</label>
              <input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={updatePassword.isPending}>
              更新密碼
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
