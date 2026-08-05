import { useCallback, useEffect, useRef, useState } from 'react';
import bannerImg from '@/assets/material/img_illustration/img_home-banner-1-lg.png';

const slides = [
  {
    bg: '#E5E1C1',
    title: '用英語發掘新機會，實現你的夢想',
    desc: '我們的課程將幫助你用英語發掘更多機會，實現你的職業和生活夢想！',
    cta: '立即探索課程',
  },
  {
    bg: '#D4E4D4',
    title: '掌握機會，實現你的夢想',
    desc: '我們的課程幫助你用英語發掘更多機會，實現你的職業和生活夢想！',
    cta: '立即探索課程',
  },
  {
    bg: '#E5E1C1',
    title: '給自己一個機會，實現你的夢想',
    desc: '從興趣出發，用英文開啟無限可能的新世界！',
    cta: '立即探索課程',
  },
  {
    bg: '#D4E4D4',
    title: '學習英文，從 Triangle 開始',
    desc: '科學化的間隔重複學習法，讓記憶更持久、學習更高效！',
    cta: '立即點擊前往',
  },
  {
    bg: '#E5E1C1',
    title: '開啟你的英語之門',
    desc: 'Try and Go — 通向精通之路，從這裡開始！',
    cta: '立即探索課程',
  },
];

const AUTO_MS = 4500;
const FADE_MS = 400;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const fadeTimer = useRef(null);
  const currentRef = useRef(0);

  currentRef.current = current;
  const slide = slides[current];

  const clearFadeTimer = () => {
    if (fadeTimer.current) {
      clearTimeout(fadeTimer.current);
      fadeTimer.current = null;
    }
  };

  const goTo = useCallback((index) => {
    if (index === currentRef.current) return;
    clearFadeTimer();
    setTextVisible(false);
    fadeTimer.current = setTimeout(() => {
      setCurrent(index);
      setTextVisible(true);
      fadeTimer.current = null;
    }, FADE_MS);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      goTo((currentRef.current + 1) % slides.length);
    }, AUTO_MS);
    return () => {
      clearInterval(id);
      clearFadeTimer();
    };
  }, [goTo]);

  return (
    <section className="hero-carousel" style={{ backgroundColor: slide.bg }}>
      <div className="container hero-carousel__content">
        <div className="hero-carousel__image">
          <img src={bannerImg} alt="Triangle 學習" className="float-y" />
        </div>
        <div
          className={`hero-carousel__text ${textVisible ? 'is-visible' : 'is-fading'}`}
        >
          <h1>{slide.title}</h1>
          <p>{slide.desc}</p>
          <div className="hero-carousel__cta">
            <span className="cta-arrows">▶▶▶▶▶</span>
            <span>{slide.cta}</span>
            <span className="cta-arrows">▶▶▶▶▶</span>
          </div>
        </div>
      </div>

      <div className="hero-carousel__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`hero-carousel__dot ${i === current ? 'active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`第 ${i + 1} 張`}
          />
        ))}
      </div>
    </section>
  );
}
