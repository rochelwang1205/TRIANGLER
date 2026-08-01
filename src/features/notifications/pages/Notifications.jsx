import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/features/notifications/api/useNotifications';
import AuthLoginModal from '@/features/auth/components/AuthLoginModal';

export default function Notifications() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const { data: notifications, isPending } = useNotifications({ enabled: isLoggedIn });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  useEffect(() => {
    if (!isLoggedIn) setShowLogin(true);
  }, [isLoggedIn]);

  const handleMarkRead = (id) => {
    markRead.mutate(id);
  };

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  if (!isLoggedIn) {
    return (
      <main className="profile-page">
        <div className="container text-center">
          <h1 className="page-title">通知</h1>
          <p className="auth-gate-hint">請先登入</p>
        </div>
        <AuthLoginModal show={showLogin} onClose={() => navigate('/')} onSuccess={() => setShowLogin(false)} />
      </main>
    );
  }

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <main className="profile-page">
      <div className="container">
        <div className="profile-section__head">
          <h1 className="page-title" style={{ marginBottom: 0, paddingTop: 0 }}>通知</h1>
          {unreadCount > 0 && (
            <button type="button" className="btn-outline btn-outline--sm" onClick={handleMarkAllRead}>
              全部標為已讀
            </button>
          )}
        </div>

        {isPending && <p>載入中...</p>}
        {!isPending && notifications?.length === 0 && <p>目前沒有通知</p>}

        <div className="notification-list">
          {notifications?.map((n) => (
            <div
              key={n.id}
              className={`notification-item ${n.read ? '' : 'notification-item--unread'}`}
              onClick={() => !n.read && handleMarkRead(n.id)}
              onKeyDown={(e) => e.key === 'Enter' && !n.read && handleMarkRead(n.id)}
              role="button"
              tabIndex={0}
            >
              <div className="notification-item__head">
                <strong>{n.title}</strong>
                <span>{n.createdAt}</span>
              </div>
              <p>{n.message}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
