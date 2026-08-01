import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MdExpandMore, MdStar, MdStarOutline } from 'react-icons/md';
import { RiShoppingBag4Line } from 'react-icons/ri';
import { resolveCourse } from '../utils/courseImages';
import { useCourse, useCourses, useToggleLike } from '@/features/courses/api/useCourses';
import { useProfile } from '@/features/profile/api/useProfile';
import { useCart } from '@/features/cart/context/CartContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import CourseCard from '../components/CourseCard';
import SearchFilter from '../components/SearchFilter';
import AuthLoginModal from '@/features/auth/components/AuthLoginModal';

export default function CourseDetail() {
  const { id } = useParams();
  const [openUnit, setOpenUnit] = useState(1);
  const [cartMsg, setCartMsg] = useState(null);
  const [likeMsg, setLikeMsg] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const { addItem } = useCart();
  const { isLoggedIn } = useAuth();

  const { data: courseData, isPending: courseLoading } = useCourse(id);
  const { data: relatedData = [] } = useCourses(
    { _sort: 'students', _order: 'desc' },
    { enabled: Boolean(id) }
  );
  const { data: profile } = useProfile({ enabled: isLoggedIn && Boolean(courseData) });
  const toggleLike = useToggleLike();

  const course = courseData ? resolveCourse(courseData) : null;
  const related = useMemo(
    () =>
      relatedData
        .filter((item) => item.id !== Number(id))
        .slice(0, 3)
        .map(resolveCourse),
    [relatedData, id]
  );
  const isSaved =
    profile?.savedCourses.some((item) => item.courseId === course?.id) ?? false;

  const handleAddCart = async () => {
    const err = await addItem(course);
    setCartMsg(err || '已加入購物車');
    setTimeout(() => setCartMsg(null), 2000);
  };

  const handleToggleLike = async () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }

    try {
      await toggleLike.mutateAsync({ courseId: course.id, isSaved });
      setLikeMsg(isSaved ? '已取消收藏' : '已加入收藏');
      setTimeout(() => setLikeMsg(null), 2000);
    } catch (err) {
      setLikeMsg(err.message);
      setTimeout(() => setLikeMsg(null), 2000);
    }
  };

  if (courseLoading || !course) {
    return (
      <main className="course-detail-page">
        <div className="container"><p>載入中...</p></div>
      </main>
    );
  }

  return (
    <main className="course-detail-page">
      <div className="container">
        <SearchFilter filters={{}} onChange={() => {}} onSearch={() => {}} />

        <section className="course-hero">
          <div className="course-hero__image">
            <img src={course.image} alt={course.title} />
          </div>
          <div className="course-hero__info">
            <h1>{course.title}</h1>
            <div className="course-hero__tags">
              <span className="tag tag--yellow">{course.courseType || '影音課'}</span>
              <span className="tag tag--blue">{course.level}</span>
            </div>
            <p className="course-hero__author">{course.author}</p>
            <p className="course-hero__dept">{course.dept}</p>
            <p className="course-hero__price">$ {course.price.toLocaleString()}</p>
            <div className="course-hero__actions">
              <button
                type="button"
                className={`btn-outline btn-outline--sm ${isSaved ? 'btn-outline--active' : ''}`}
                onClick={handleToggleLike}
                disabled={toggleLike.isPending}
              >
                {isSaved ? <MdStar size={18} /> : <MdStarOutline size={18} />}
                {isSaved ? '已收藏' : '收藏'}
              </button>
              <button type="button" className="btn-outline btn-outline--sm" onClick={handleAddCart}>
                <RiShoppingBag4Line size={18} /> 加入購物車
              </button>
            </div>
            {cartMsg && <p className="course-hero__msg">{cartMsg}</p>}
            {likeMsg && <p className="course-hero__msg">{likeMsg}</p>}
          </div>
        </section>

        <section className="course-stats">
          <div className="course-stat"><span>📖</span><p>章節：{course.chapters || '—'}</p></div>
          <div className="course-stat"><span>⏱</span><p>時長：{course.duration || '—'}</p></div>
          <div className="course-stat"><span>👥</span><p>修課人數：{course.students} 人已購買</p></div>
        </section>

        <section className="course-section">
          <h2>課程介紹</h2>
          <div className="course-intro-box">
            {(course.description || []).map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </section>

        <section className="course-section">
          <h2>單元</h2>
          <div className="unit-accordion">
            {(course.units || []).map((unit) => (
              <div key={unit.id} className={`unit-item ${openUnit === unit.id ? 'unit-item--open' : ''}`}>
                <button type="button" className="unit-item__header" onClick={() => setOpenUnit(openUnit === unit.id ? null : unit.id)}>
                  <span>{unit.title}</span>
                  <MdExpandMore size={24} />
                </button>
                {openUnit === unit.id && unit.items && (
                  <ul className="unit-item__body">
                    {unit.items.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="course-section">
          <h2>學員評價</h2>
          <div className="review-grid">
            {(course.reviews || []).map((r, i) => (
              <div key={i} className="review-card">
                <h6>{r.name}</h6>
                <p className="review-card__title">{r.title}</p>
                <div className="review-card__stars">{'★'.repeat(r.rating)}</div>
                <p>{r.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="course-section">
          <h2>猜你喜歡</h2>
          <div className="course-grid course-grid--3">
            {related.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
          <p className="more-link"><Link to="/explore">更多課程</Link></p>
        </section>
      </div>

      <AuthLoginModal
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={() => setShowLogin(false)}
      />
    </main>
  );
}
