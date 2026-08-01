import { useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
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

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));

  const slide = slides[current];

  return (
    <section className="hero-carousel" style={{ backgroundColor: slide.bg }}>
      <button type="button" className="hero-carousel__arrow hero-carousel__arrow--left" onClick={prev} aria-label="上一張">
        <MdChevronLeft size={32} />
      </button>

      <div className="container hero-carousel__content">
        <div className="hero-carousel__image">
          <img src={bannerImg} alt="Triangle 學習" />
        </div>
        <div className="hero-carousel__text">
          <h1>{slide.title}</h1>
          <p>{slide.desc}</p>
          <div className="hero-carousel__cta">
            <span className="cta-arrows">▶▶▶▶▶</span>
            <span>{slide.cta}</span>
            <span className="cta-arrows">▶▶▶▶▶</span>
          </div>
        </div>
      </div>

      <button type="button" className="hero-carousel__arrow hero-carousel__arrow--right" onClick={next} aria-label="下一張">
        <MdChevronRight size={32} />
      </button>

      <div className="hero-carousel__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`hero-carousel__dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`第 ${i + 1} 張`}
          />
        ))}
      </div>
    </section>
  );
}
