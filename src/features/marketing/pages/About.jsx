import aboutBg from '@/assets/material/img_illustration/img_home-about-bg-lg.png';

export default function About() {
  return (
    <main className="about-page">
      <section className="about-section about-section--page">
        <img src={aboutBg} alt="" className="about-section__bg" aria-hidden="true" />
        <div className="container">
          <h1 className="page-title">關於我們</h1>
          <div className="about-card">
            <h3>Triangle makes Perfect !</h3>
            <p>
              Triangle 是一個專為現代人設計的線上英文學習平台。我們相信，學習不應該是枯燥的背誦，
              而應該是充滿樂趣和成就感的旅程。
            </p>
            <p>
              我們運用遺忘曲線和間隔重複的科學原理，幫助你在最適合的時間複習，
              讓記憶更持久。無論你是忙碌的上班族還是積極的學生，
              Triangle 都能為你量身打造最適合的學習計畫。
            </p>
            <p>
              我們的設計團隊來自多元背景，共同致力於打造最友善、最高效的學習體驗。
              加入 Triangle，開啟你的英語之門，通向精通之路！
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
