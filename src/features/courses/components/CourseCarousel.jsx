import { useId } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

export default function CourseCarousel({ children, className = '' }) {
  const trackId = useId().replace(/:/g, '');

  const scroll = (direction) => {
    const container = document.getElementById(trackId);
    if (!container) return;
    const amount = direction === 'left' ? -340 : 340;
    container.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className={`course-carousel ${className}`}>
      <button type="button" className="course-carousel__arrow course-carousel__arrow--left" onClick={() => scroll('left')} aria-label="上一組">
        <MdChevronLeft size={28} />
      </button>
      <div id={trackId} className="course-carousel__track">
        {children}
      </div>
      <button type="button" className="course-carousel__arrow course-carousel__arrow--right" onClick={() => scroll('right')} aria-label="下一組">
        <MdChevronRight size={28} />
      </button>
    </div>
  );
}
