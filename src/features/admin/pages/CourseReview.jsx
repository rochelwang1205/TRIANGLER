import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useAdminCourses, useReviewCourse } from '@/features/admin/api/useAdmin';
import { COURSE_STATUS_LABELS } from '@/features/courses/constants/courseStatus';
import { resolveCourseImage } from '@/features/courses/utils/courseImages';
import ModalOverlay from '@/components/ModalOverlay';

export default function CourseReview() {
  const { isAdmin } = useAuth();
  const { data: courses, isPending } = useAdminCourses({ status: 'pending_review' }, { enabled: isAdmin });
  const reviewCourse = useReviewCourse();
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = async (id) => {
    if (!window.confirm('確定核准此課程？')) return;
    try {
      await reviewCourse.mutateAsync({ id, action: 'approve' });
      alert('已核准上架');
    } catch (err) {
      alert(err.message);
    }
  };

  const openRejectModal = (course) => {
    setRejectTarget(course);
    setRejectReason('');
  };

  const closeRejectModal = () => {
    setRejectTarget(null);
    setRejectReason('');
  };

  const handleRejectConfirm = async () => {
    if (!rejectTarget) return;
    try {
      await reviewCourse.mutateAsync({
        id: rejectTarget.id,
        action: 'reject',
        reason: rejectReason.trim() || undefined,
      });
      alert('已退回');
      closeRejectModal();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isAdmin) {
    return (
      <main className="profile-page">
        <div className="container"><p>此頁面僅限管理員存取。</p></div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="container">
        <h1 className="page-title">課程審核</h1>
        <Link to="/admin" className="back-link">← 返回管理後台</Link>

        {isPending && <p>載入中...</p>}
        {!isPending && courses?.length === 0 && <p>目前沒有待審核的課程</p>}

        <div className="review-list">
          {courses?.map((course) => (
            <div key={course.id} className="review-card">
              <img src={resolveCourseImage(course.image)} alt={course.title} />
              <div className="review-card__body">
                <h5>{course.title}</h5>
                <p>{course.author} · {course.tag} · {course.level}</p>
                <p>${course.price.toLocaleString()}</p>
                <span className={`status-tag status-tag--${course.status}`}>
                  {COURSE_STATUS_LABELS[course.status]}
                </span>
                <div className="review-card__actions">
                  <button
                    type="button"
                    className="btn-primary btn-primary--sm"
                    disabled={reviewCourse.isPending}
                    onClick={() => handleApprove(course.id)}
                  >
                    核准
                  </button>
                  <button
                    type="button"
                    className="btn-outline btn-outline--sm"
                    disabled={reviewCourse.isPending}
                    onClick={() => openRejectModal(course)}
                  >
                    退回
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ModalOverlay show={Boolean(rejectTarget)} onClose={closeRejectModal} size="sm">
        <div className="reject-modal">
          <h5>退回課程</h5>
          <p>確定要退回「{rejectTarget?.title}」嗎？</p>
          <label htmlFor="reject-reason">退回原因（選填）</label>
          <textarea
            id="reject-reason"
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="請說明退回原因，將通知老師"
          />
          <div className="reject-modal__actions">
            <button
              type="button"
              className="btn-primary btn-primary--sm"
              disabled={reviewCourse.isPending}
              onClick={handleRejectConfirm}
            >
              確認退回
            </button>
            <button type="button" className="btn-outline btn-outline--sm" onClick={closeRejectModal}>
              取消
            </button>
          </div>
        </div>
      </ModalOverlay>
    </main>
  );
}
