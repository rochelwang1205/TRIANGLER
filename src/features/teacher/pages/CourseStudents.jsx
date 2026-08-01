import { Link, useParams } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useTeacherCourseStudents } from '@/features/teacher/api/useTeacherCourses';

export default function CourseStudents() {
  const { id } = useParams();
  const { isTeacher } = useAuth();
  const { data: students, isPending, error } = useTeacherCourseStudents(Number(id), {
    enabled: isTeacher,
  });

  if (!isTeacher) {
    return (
      <main className="profile-page">
        <div className="container"><p>此頁面僅限老師帳號存取。</p></div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="container">
        <h1 className="page-title">學生名單</h1>
        <Link to="/teacher" className="back-link">← 返回老師中心</Link>

        {isPending && <p>載入中...</p>}
        {error && <p>{error.message}</p>}

        {!isPending && students?.length === 0 && <p>尚無學生購買此課程</p>}

        <div className="student-list">
          {students?.map((student) => (
            <div key={student.userId} className="student-item">
              <div>
                <strong>{student.name}</strong>
                <p>{student.email}</p>
              </div>
              <div className="student-item__meta">
                <span>進度：{student.progress}%</span>
                <span>購買日期：{student.purchasedAt}</span>
                {student.lastStudy && <span>上次學習：{student.lastStudy}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
