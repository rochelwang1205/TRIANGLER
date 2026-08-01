import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  return (
    <Link to={`/course/${course.id}`} className="course-card">
      <div className="course-card__image">
        <img src={course.image} alt={course.title} />
      </div>
      <div className="course-card__body">
        <h5 className="course-card__title">{course.title}</h5>
        <div className="course-card__tags">
          <span className="tag tag--yellow">{course.type || course.tag}</span>
          <span className="tag tag--blue">{course.level}</span>
        </div>
        <p className="course-card__author">{course.author}</p>
        <p className="course-card__dept">{course.dept}</p>
        <p className="course-card__price">$ {course.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}
