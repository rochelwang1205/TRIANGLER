import { Children, useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

export default function EmblaCarousel({
  children,
  className = '',
  options = {},
  autoplay = true,
  autoplayDelay = 4500,
  showDots = false,
}) {
  const autoplayPlugin = useRef(
    Autoplay({ delay: autoplayDelay, stopOnInteraction: false })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', ...options },
    autoplay ? [autoplayPlugin.current] : []
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const onSelect = useCallback((api) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return undefined;

    const syncSnaps = () => setScrollSnaps(emblaApi.scrollSnapList());
    syncSnaps();
    onSelect(emblaApi);

    emblaApi.on('reInit', syncSnaps);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('reInit', syncSnaps);
      emblaApi.off('reInit', onSelect);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className={`embla ${className}`.trim()}>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {Children.map(children, (child, index) => (
            <div className="embla__slide" key={child?.key ?? index}>
              {child}
            </div>
          ))}
        </div>
      </div>
      {showDots && scrollSnaps.length > 1 && (
        <div className="embla__dots">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`embla__dot ${i === selectedIndex ? 'active' : ''}`}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`第 ${i + 1} 張`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
