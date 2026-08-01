import { Link } from 'react-router-dom';

export default function CourseCardRow({ course }) {
  return (
    <Link to={`/course/${course.id}`} className="course-card-row">
      <div className="course-card-row__image">
        <img src={course.image} alt={course.title} />
      </div>
      <div className="course-card-row__body">
        <h5>{course.title}</h5>
        <div className="course-card-row__tags">
          <span className="tag tag--yellow">{course.tag}</span>
          <span className="tag tag--blue">{course.level}</span>
        </div>
        <p className="course-card-row__price">$ {course.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}
