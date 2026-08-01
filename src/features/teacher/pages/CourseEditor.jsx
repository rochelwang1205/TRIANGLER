import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  useTeacherCourses,
  useCreateTeacherCourse,
  useUpdateTeacherCourse,
  useSubmitTeacherCourse,
} from '@/features/teacher/api/useTeacherCourses';
import { COURSE_STATUS_LABELS } from '@/features/courses/constants/courseStatus';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const TAGS = ['商務', '檢定', '生活', '簡報'];
const TYPES = ['影音課', '直播課', '演講', '說明會'];
const DEPTS = ['商務英文', '檢定英文', '生活英文'];

export default function CourseEditor() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const { isTeacher } = useAuth();
  const { data: courses } = useTeacherCourses({ enabled: isTeacher && !isNew });
  const createCourse = useCreateTeacherCourse();
  const updateCourse = useUpdateTeacherCourse();
  const submitCourse = useSubmitTeacherCourse();

  const existing = !isNew ? courses?.find((c) => c.id === Number(id)) : null;
  const canSubmit = existing && ['draft', 'rejected'].includes(existing.status);

  const [form, setForm] = useState({
    title: '',
    tag: '商務',
    level: 'B2',
    dept: '商務英文',
    price: '',
    courseType: '影音課',
    description: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title,
        tag: existing.tag,
        level: existing.level,
        dept: existing.dept,
        price: String(existing.price),
        courseType: existing.courseType,
        description: existing.description || '',
      });
    }
  }, [existing]);

  if (!isTeacher) {
    return (
      <main className="profile-page">
        <div className="container"><p>此頁面僅限老師帳號存取。</p></div>
      </main>
    );
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isNew) {
        const created = await createCourse.mutateAsync(form);
        navigate(`/teacher/courses/${created.id}/edit`);
      } else {
        await updateCourse.mutateAsync({ id: Number(id), data: form });
        alert('課程已更新');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmitReview = async () => {
    if (!window.confirm('確定提交此課程進行審核？')) return;
    setError(null);
    try {
      await submitCourse.mutateAsync(Number(id));
      alert('已提交審核，請等待管理員回覆。');
      navigate('/teacher');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="profile-page">
      <div className="container">
        <h1 className="page-title">{isNew ? '建立新課程' : '編輯課程'}</h1>
        <Link to="/teacher" className="back-link">← 返回老師中心</Link>

        {!isNew && existing && (
          <p className="course-editor__status">
            狀態：
            <span className={`status-tag status-tag--${existing.status}`}>
              {COURSE_STATUS_LABELS[existing.status]}
            </span>
          </p>
        )}

        <form className="course-editor" onSubmit={handleSubmit}>
          <div className="course-editor__field">
            <label htmlFor="title">課程標題 *</label>
            <input id="title" name="title" value={form.title} onChange={handleChange} required />
          </div>

          <div className="course-editor__row">
            <div className="course-editor__field">
              <label htmlFor="tag">主題</label>
              <select id="tag" name="tag" value={form.tag} onChange={handleChange}>
                {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="course-editor__field">
              <label htmlFor="level">程度</label>
              <select id="level" name="level" value={form.level} onChange={handleChange}>
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="course-editor__row">
            <div className="course-editor__field">
              <label htmlFor="dept">分類</label>
              <select id="dept" name="dept" value={form.dept} onChange={handleChange}>
                {DEPTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="course-editor__field">
              <label htmlFor="courseType">類型</label>
              <select id="courseType" name="courseType" value={form.courseType} onChange={handleChange}>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="course-editor__field">
            <label htmlFor="price">價格 (NT$)</label>
            <input id="price" name="price" type="number" min="0" value={form.price} onChange={handleChange} />
          </div>

          <div className="course-editor__field">
            <label htmlFor="description">課程簡介</label>
            <textarea id="description" name="description" rows={4} value={form.description} onChange={handleChange} />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <div className="course-editor__actions">
            <button type="submit" className="btn-primary" disabled={createCourse.isPending || updateCourse.isPending}>
              {isNew ? '建立課程' : '儲存變更'}
            </button>
            {canSubmit && (
              <button
                type="button"
                className="btn-yellow"
                disabled={submitCourse.isPending}
                onClick={handleSubmitReview}
              >
                提交審核
              </button>
            )}
            <Link to="/teacher" className="btn-outline">取消</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
