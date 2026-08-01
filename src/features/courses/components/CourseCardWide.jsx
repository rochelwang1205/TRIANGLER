import { Link } from 'react-router-dom';
import { MdArrowForward } from 'react-icons/md';
import { RiUserLine } from 'react-icons/ri';

export default function CourseCardWide({ course }) {
  return (
    <Link to={`/course/${course.id}`} className="course-card-wide">
      <div className="course-card-wide__image">
        <img src={course.image} alt={course.title} />
      </div>
      <div className="course-card-wide__body">
        <div className="course-card-wide__header">
          <h5>{course.title}</h5>
          <MdArrowForward size={24} />
        </div>
        <p className="course-card-wide__students">
          <RiUserLine size={14} />
          已有 <strong>{course.students}</strong> 位學員加入課程
        </p>
      </div>
    </Link>
  );
}

export function CourseCardRecommend({ course }) {
  return (
    <Link to={`/course/${course.id}`} className="course-card-recommend">
      <div className="course-card-recommend__image">
        <img src={course.image} alt={course.title} />
      </div>
      <div className="course-card-recommend__body">
        <div className="course-card-recommend__header">
          <h5>{course.title}</h5>
          <MdArrowForward size={24} />
        </div>
        <p className="course-card-recommend__students">
          <RiUserLine size={14} />
          已有 <strong>{course.students}</strong> 位學員加入課程
        </p>
      </div>
    </Link>
  );
}
