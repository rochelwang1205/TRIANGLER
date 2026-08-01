import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resolveCourseImage } from '@/features/courses/utils/courseImages';
import { useProfile } from '@/features/profile/api/useProfile';
import { useAuth } from '@/features/auth/context/AuthContext';
import { getDashboardPath } from '@/features/auth/constants/roles';
import AuthLoginModal from '@/features/auth/components/AuthLoginModal';
import AccountHeader from '@/components/AccountHeader';

export default function Profile() {
  const navigate = useNavigate();
  const { isLoggedIn, logout, role, isStudent } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const { data: profile, error, isPending } = useProfile({ enabled: isLoggedIn });

  useEffect(() => {
    if (!isLoggedIn) {
      setShowLogin(true);
    } else if (!isStudent) {
      navigate(getDashboardPath(role), { replace: true });
    }
  }, [isLoggedIn, isStudent, role, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isLoggedIn) {
    return (
      <main className="profile-page">
        <div className="container text-center">
          <h1 className="page-title">我的帳戶</h1>
          <p className="auth-gate-hint">請先登入以查看個人帳戶</p>
        </div>
        <AuthLoginModal
          show={showLogin}
          onClose={() => navigate('/')}
          onSuccess={() => setShowLogin(false)}
        />
      </main>
    );
  }

  if (error) {
    return (
      <main className="profile-page">
        <div className="container"><p>{error.message}</p></div>
      </main>
    );
  }

  if (isPending || !profile) {
    return (
      <main className="profile-page">
        <div className="container"><p>載入中...</p></div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="container">
        <h1 className="page-title">我的帳戶</h1>

        <AccountHeader
          name={profile.user.name}
          email={profile.email}
          role={profile.user.role ?? 'student'}
          onLogout={handleLogout}
        />

        <section className="profile-section">
          <div className="profile-section__head">
            <h3>學習成就</h3>
          </div>
          <div className="achievement-grid">
            {profile.achievements.map((item) => (
              <div key={item.id} className="achievement-card">
                <div className="achievement-card__icon">🏆</div>
                <p className="achievement-card__label">{item.label}</p>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="profile-section">
          <div className="profile-section__head">
            <h3>我的課程</h3>
            <Link to="/explore">查看更多</Link>
          </div>
          {profile.myCourses.length === 0 ? (
            <p>尚未購買課程，<Link to="/explore">前往選課</Link></p>
          ) : (
            <div className="profile-courses">
              {profile.myCourses.map((item) => (
                <Link
                  key={item.courseId}
                  to={`/course/${item.courseId}`}
                  className="profile-course-card"
                >
                  <img src={resolveCourseImage(item.image)} alt={item.title} />
                  <div className="profile-course-card__body">
                    <h5>{item.title}</h5>
                    <div className="profile-course-card__progress">
                      <div className="progress-bar">
                        <div
                          className="progress-bar__fill"
                          style={{ width: `${item.progress ?? 0}%` }}
                        />
                      </div>
                      <span>{item.progress ?? 0}%</span>
                    </div>
                    {item.lastStudy && (
                      <p className="profile-course-card__time">上次學習：{item.lastStudy}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="profile-section">
          <div className="profile-section__head">
            <h3>收藏課程</h3>
          </div>
          {profile.savedCourses.length === 0 ? (
            <p>尚未收藏課程</p>
          ) : (
            <div className="saved-courses">
              {profile.savedCourses.map((item) => (
                <Link
                  key={item.courseId}
                  to={`/course/${item.courseId}`}
                  className="saved-course-card"
                >
                  <img src={resolveCourseImage(item.image)} alt={item.title} />
                  <div>
                    <h5>{item.title}</h5>
                    <div className="saved-course-card__tags">
                      <span className="tag tag--yellow">{item.tag}</span>
                      <span className="tag tag--blue">{item.level}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="profile-section">
          <div className="profile-section__head">
            <h3>訂單紀錄</h3>
          </div>
          {profile.orders.length === 0 ? (
            <p>尚無訂單紀錄</p>
          ) : (
            <div className="order-list">
              {profile.orders.map((order) => (
                <div key={order.id} className="order-item">
                  <div>
                    <p className="order-item__id">{order.id}</p>
                    <p className="order-item__title">{order.title}</p>
                  </div>
                  <div className="order-item__meta">
                    <span>{order.date}</span>
                    <strong>$ {order.price.toLocaleString()}</strong>
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
