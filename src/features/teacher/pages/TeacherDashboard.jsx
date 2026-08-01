import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useProfile } from '@/features/profile/api/useProfile';
import {
  useTeacherCourses,
  useSubmitTeacherCourse,
} from '@/features/teacher/api/useTeacherCourses';
import AuthLoginModal from '@/features/auth/components/AuthLoginModal';
import AccountHeader from '@/components/AccountHeader';
import TeacherCourseCard from '@/features/teacher/components/TeacherCourseCard';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { isLoggedIn, isTeacher, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const { data: profile } = useProfile({ enabled: isLoggedIn && isTeacher });
  const { data: courses, isPending, error } = useTeacherCourses({
    enabled: isLoggedIn && isTeacher,
  });
  const submitCourse = useSubmitTeacherCourse();

  useEffect(() => {
    if (!isLoggedIn) setShowLogin(true);
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmit = async (id) => {
    if (!window.confirm('確定提交此課程進行審核？')) return;
    try {
      await submitCourse.mutateAsync(id);
      alert('已提交審核，請等待管理員回覆。');
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="profile-page">
        <div className="container text-center">
          <h1 className="page-title">老師中心</h1>
          <p className="auth-gate-hint">請先登入以查看老師中心</p>
        </div>
        <AuthLoginModal
          show={showLogin}
          onClose={() => navigate('/')}
          onSuccess={() => setShowLogin(false)}
        />
      </main>
    );
  }

  if (!isTeacher) {
    return (
      <main className="profile-page">
        <div className="container text-center">
          <h1 className="page-title">老師中心</h1>
          <p>此頁面僅限老師帳號存取。</p>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="container">
        <h1 className="page-title">老師中心</h1>

        {profile && (
          <AccountHeader
            name={profile.user.name}
            email={profile.email}
            role="teacher"
            onLogout={handleLogout}
          />
        )}

        <section className="profile-section">
          <div className="profile-section__head">
            <h3>課程管理</h3>
            <Link to="/teacher/courses/new/edit">建立新課程</Link>
          </div>

          {isPending && <p>載入中...</p>}
          {error && <p>{error.message}</p>}

          {!isPending && courses?.length === 0 && (
            <p>尚未建立課程，<Link to="/teacher/courses/new/edit">立即建立</Link></p>
          )}

          <div className="teacher-courses">
            {courses?.map((course) => (
              <TeacherCourseCard
                key={course.id}
                course={course}
                onSubmit={handleSubmit}
                submitting={submitCourse.isPending}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
