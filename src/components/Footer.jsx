import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="footer p-5">
            <div className="text-white">
                <div className="container d-flex justify-content-between">
                <div className="d-flex flex-column justify-content-between pr-lg-6 w-25">
                    Triangle 的 Logo
                    <div className="text-gray-03 text-center text-lg-start">
                        <p className="fs-6">Try and Go</p>
                        <p className="fs-6">開啟英語之門，邁向精通之路</p>
                    </div>
                    <div className="d-flex">
                        <FaFacebook size={32} color="#fff" className="mr-3"/>
                        <FaTwitter size={32} color="#fff" className="mr-3"/>
                        <FaInstagram size={32} color="#fff"/>
                    </div>
                </div>
                </div>
                <div className="d-none d-lg-flex justify-content-between row w-75">
                    <div className="sub-nav col">
                        <h6 className="font-weight-bold">首頁</h6>
                        <ul className="list-unstyled">
                            <li>精選課程</li>
                            <li>熱門課程</li>
                        </ul>
                    </div>
                    <div className="sub-nav col">
                        <h6 className="font-weight-bold">尋找課程</h6>
                        <div className="d-flex">
                            <ul className="list-unstyled mr-5">
                                <li>生活</li>
                                <li>旅遊</li>
                                <li>檢定</li>
                                <li>商務</li>
                                <li>時事</li>
                                <li>學術</li>
                            </ul>
                            <ul className="list-unstyled">
                                <li>影音</li>
                                <li>直播</li>
                                <li>演講</li>
                                <li>說明會</li>
                            </ul>
                        </div>
                        
                    </div>
                    <div className="sub-nav col">
                        <h6 className="font-weight-bold">FAQ</h6>
                        <ul className="list-unstyled">
                            <li>如何在平台學習</li>
                            <li>如何在平台開課</li>
                            <li>如何購買課程</li>
                            <li>課程相關</li>
                            <li>帳號相關</li>
                            <li>通知相關</li>
                        </ul>
                    </div>
                    <div className="sub-nav col">
                        <h6 className="font-weight-bold">關於</h6>
                        <ul className="list-unstyled">
                            <li>品牌故事</li>
                            <li>平台理念</li>
                            <li>設計團隊</li>
                            <li>隱私權政策</li>
                            <li>使用者條款</li>
                        </ul>
                    </div>
                    <div className="sub-nav col">
                        <h6 className="font-weight-bold">聯絡我們</h6>
                        <ul className="list-unstyled">
                            <li>線上課服</li>
                            <li>企業合作</li>
                            <li>媒體連繫</li>
                            <li>校園方案</li>
                        </ul>
                </div>
                </div>
                </div>
        </footer>
    );
}