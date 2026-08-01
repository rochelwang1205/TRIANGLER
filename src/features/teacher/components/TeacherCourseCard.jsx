import { Link } from 'react-router-dom';
import { resolveCourseImage } from '@/features/courses/utils/courseImages';
import { COURSE_STATUS_LABELS } from '@/features/courses/constants/courseStatus';

export default function TeacherCourseCard({ course, onSubmit, submitting }) {
  const canSubmit = ['draft', 'rejected'].includes(course.status);
  const canEdit = course.status !== 'published';

  return (
    <div className="teacher-course-card">
      <img src={resolveCourseImage(course.image)} alt={course.title} />
      <div className="teacher-course-card__body">
        <div className="teacher-course-card__head">
          <h5>{course.title}</h5>
          <span className={`status-tag status-tag--${course.status}`}>
            {COURSE_STATUS_LABELS[course.status]}
          </span>
        </div>
        <p className="teacher-course-card__meta">
          {course.tag} · {course.level} · ${course.price.toLocaleString()}
        </p>
        <p className="teacher-course-card__meta">
          學員：{course.students} 人
        </p>
        <div className="teacher-course-card__actions">
          {canEdit && (
            <Link to={`/teacher/courses/${course.id}/edit`} className="btn-outline btn-outline--sm">
              編輯
            </Link>
          )}
          <Link to={`/teacher/courses/${course.id}/students`} className="btn-outline btn-outline--sm">
            學生名單
          </Link>
          {canSubmit && (
            <button
              type="button"
              className="btn-primary btn-primary--sm"
              disabled={submitting}
              onClick={() => onSubmit(course.id)}
            >
              提交審核
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
