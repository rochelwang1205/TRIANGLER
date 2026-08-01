import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <Link to="/" className="site-logo site-logo--white">
            Tr<span className="site-logo__i">i</span>angle
          </Link>
          <div className="site-footer__slogan">
            <p>Try and Go</p>
            <p>開啟你的英語之門，通向精通之路</p>
          </div>
          <div className="site-footer__social">
            <a href="https://wangrochel.wixsite.com/cydesign2021" aria-label="Facebook"><FaFacebook size={28} /></a>
            <a href="https://wangrochel.wixsite.com/cydesign2021" aria-label="Twitter"><FaTwitter size={28} /></a>
            <a href="https://wangrochel.wixsite.com/cydesign2021" aria-label="Instagram"><FaInstagram size={28} /></a>
          </div>
        </div>

        <div className="site-footer__links">
          <div className="footer-col">
            <h6>首頁</h6>
            <ul>
              <li>精選課程</li>
              <li>熱門課程</li>
            </ul>
          </div>
          <div className="footer-col footer-col--wide">
            <h6>尋找課程</h6>
            <div className="footer-col__split">
              <ul>
                <li>影音課</li>
                <li>直播課</li>
                <li>演講</li>
                <li>說明會</li>
              </ul>
              <ul>
                <li>生活英文</li>
                <li>旅遊英文</li>
                <li>商務英文</li>
                <li>學術英文</li>
                <li>檢定英文</li>
                <li>時事英文</li>
              </ul>
            </div>
          </div>
          <div className="footer-col">
            <h6>FAQ</h6>
            <ul>
              <li><Link to="/FAQ">常見問題</Link></li>
              <li>如何在平台上學習</li>
              <li>帳號與個人檔案</li>
              <li>購買課程</li>
              <li>訊息通知</li>
              <li>如何開課</li>
            </ul>
          </div>
          <div className="footer-col">
            <h6>關於</h6>
            <ul>
              <li><Link to="/about">品牌故事</Link></li>
              <li>平台理念</li>
              <li>設計團隊</li>
              <li>隱私權政策</li>
              <li>使用者條款</li>
            </ul>
          </div>
          <div className="footer-col">
            <h6>聯絡我們</h6>
            <ul>
              <li><Link to="/contact">線上客服</Link></li>
              <li>企業合作</li>
              <li>媒體聯繫</li>
              <li>校園方案</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
