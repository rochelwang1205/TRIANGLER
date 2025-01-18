// import { Link } from "react-router-dom";
import Logo from "../assets/material/img_illustration/img_home-recommand-sm.png"
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="footer p-5">
            <div className="text-white">
                <div className="container d-flex justify-content-between">
                <div className="d-flex flex-column justify-content-between pe-lg-6 w-25">
                    <a href="/"><img src={Logo} width={'200px'} alt="Triangle English"/></a>
                    <div className="text-gray-03 text-center text-lg-start">
                        <p className="fs-6">Try and Go</p>
                        <p className="fs-6">開啟英語之門，邁向精通之路</p>
                    </div>
                    <div className="d-flex gap-5">
                        <a href="/" className="p-3"><FaFacebook size={32} color="#fff"/></a>
                        <a href="/" className="p-3"><FaTwitter size={32} color="#fff"/></a>
                        <a href="/" className="p-3"><FaInstagram size={32} color="#fff"/></a>
                    </div>
                </div>
                <div className="d-none d-lg-flex justify-content-between row w-75">
                    <div className="sub-nav col">
                        <h6 className="font-weight-bold">首頁</h6>
                        <ul className="list-unstyled">
                            <li><a href="/">精選課程</a></li>
                            <li><a href="/">熱門課程</a></li>
                        </ul>
                    </div>
                    <div className="sub-nav col">
                        <h6 className="font-weight-bold">尋找課程</h6>
                        <div className="d-flex gap-3">
                            <ul className="list-unstyled">
                                <li><a href="/">生活</a></li>
                                <li><a href="/">旅遊</a></li>
                                <li><a href="/">檢定</a></li>
                                <li><a href="/">商務</a></li>
                                <li><a href="/">時事</a></li>
                                <li><a href="/">學術</a></li>
                            </ul>
                            <ul className="list-unstyled">
                                <li><a href="/">影音</a></li>
                                <li><a href="/">直播</a></li>
                                <li><a href="/">演講</a></li>
                                <li><a href="/">說明會</a></li>
                            </ul>
                        </div>
                        
                    </div>
                    <div className="sub-nav col">
                        <h6 className="font-weight-bold">FAQ</h6>
                        <ul className="list-unstyled">
                            <li><a href="/">如何在平台學習</a></li>
                            <li><a href="/">如何在平台開課</a></li>
                            <li><a href="/">如何購買課程</a></li>
                            <li><a href="/">課程相關</a></li>
                            <li><a href="/">帳號相關</a></li>
                            <li><a href="/">通知相關</a></li>
                        </ul>
                    </div>
                    <div className="sub-nav col">
                        <h6 className="font-weight-bold">關於</h6>
                        <ul className="list-unstyled">
                            <li><a href="/">品牌故事</a></li>
                            <li><a href="/">平台理念</a></li>
                            <li><a href="/">設計團隊</a></li>
                            <li><a href="/">隱私權政策</a></li>
                            <li><a href="/">使用者條款</a></li>
                        </ul>
                    </div>
                    <div className="sub-nav col">
                        <h6 className="font-weight-bold">聯絡我們</h6>
                        <ul className="list-unstyled">
                            <li><a href="/">線上課服</a></li>
                            <li><a href="/">企業合作</a></li>
                            <li><a href="/">媒體連繫</a></li>
                            <li><a href="/">校園方案</a></li>
                        </ul>
                </div>
                </div>
                </div>
            </div>
        </footer>
    );
}