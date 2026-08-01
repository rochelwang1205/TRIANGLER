import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useProfile } from '@/features/profile/api/useProfile';
import { useAdminStats, useAdminOrders } from '@/features/admin/api/useAdmin';
import AuthLoginModal from '@/features/auth/components/AuthLoginModal';
import AccountHeader from '@/components/AccountHeader';
import KpiCard from '@/features/admin/components/KpiCard';
import ManagementTiles from '@/features/admin/components/ManagementTiles';
import { ORDER_STATUS_LABELS } from '@/features/courses/constants/courseStatus';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const { data: profile } = useProfile({ enabled: isLoggedIn && isAdmin });
  const { data: stats, isPending: statsPending } = useAdminStats({
    enabled: isLoggedIn && isAdmin,
  });
  const { data: orders } = useAdminOrders({ enabled: isLoggedIn && isAdmin });

  useEffect(() => {
    if (!isLoggedIn) setShowLogin(true);
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isLoggedIn) {
    return (
      <main className="profile-page">
        <div className="container text-center">
          <h1 className="page-title">管理後台</h1>
          <p className="auth-gate-hint">請先登入以查看管理後台</p>
        </div>
        <AuthLoginModal show={showLogin} onClose={() => navigate('/')} onSuccess={() => setShowLogin(false)} />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="profile-page">
        <div className="container text-center">
          <h1 className="page-title">管理後台</h1>
          <p>此頁面僅限管理員帳號存取。</p>
        </div>
      </main>
    );
  }

  const recentOrders = orders?.slice(0, 5) ?? [];

  return (
    <main className="profile-page">
      <div className="container">
        <h1 className="page-title">管理後台</h1>

        {profile && (
          <AccountHeader
            name={profile.user.name}
            email={profile.email}
            role="admin"
            onLogout={handleLogout}
          />
        )}

        <section className="profile-section">
          <div className="profile-section__head">
            <h3>平台數據 — 近 30 天</h3>
          </div>
          {statsPending ? (
            <p>載入中...</p>
          ) : (
            <div className="kpi-grid">
              <KpiCard label="網站總造訪次數" value={stats?.totalVisits ?? 0} />
              <KpiCard label="總銷售額" value={stats?.totalSales ?? 0} prefix="$" />
              <KpiCard label="訂單總數" value={stats?.totalOrders ?? 0} />
              <KpiCard label="平均訂單金額" value={stats?.avgOrderValue ?? 0} prefix="$" />
            </div>
          )}
        </section>

        <section className="profile-section">
          <div className="profile-section__head">
            <h3>平台管理</h3>
          </div>
          <ManagementTiles />
        </section>

        <section className="profile-section">
          <div className="profile-section__head">
            <h3>訂單管理</h3>
            <Link to="/admin/orders">查看更多</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p>尚無訂單</p>
          ) : (
            <div className="admin-order-list">
              {recentOrders.map((order) => (
                <div key={order.id} className="admin-order-card">
                  <div>
                    <p className="admin-order-card__id">{order.id}</p>
                    <p className="admin-order-card__title">{order.title}</p>
                  </div>
                  <div className="admin-order-card__meta">
                    <span className={`status-tag status-tag--${order.status}`}>
                      {ORDER_STATUS_LABELS[order.status] ?? order.status}
                    </span>
                    <strong>${order.price.toLocaleString()}</strong>
                    <span>{order.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
