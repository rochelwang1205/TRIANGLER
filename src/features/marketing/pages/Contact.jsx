export default function Contact() {
  return (
    <main className="contact-page">
      <div className="container">
        <h1 className="page-title">聯絡我們</h1>
        <div className="contact-card">
          <div className="contact-info">
            <h3>線上客服</h3>
            <p>服務時間：週一至週五 09:00 - 18:00</p>
            <p>Email：<a href="mailto:support@triangle.com">support@triangle.com</a></p>
          </div>
          <div className="contact-info">
            <h3>企業合作</h3>
            <p>如需企業培訓或合作方案，歡迎來信洽詢。</p>
            <p>Email：<a href="mailto:business@triangle.com">business@triangle.com</a></p>
          </div>
          <div className="contact-info">
            <h3>媒體聯繫</h3>
            <p>媒體採訪或合作，請聯繫我們的公關團隊。</p>
            <p>Email：<a href="mailto:media@triangle.com">media@triangle.com</a></p>
          </div>
          <div className="contact-info">
            <h3>校園方案</h3>
            <p>提供學校及教育機構專屬優惠方案。</p>
            <p>Email：<a href="mailto:campus@triangle.com">campus@triangle.com</a></p>
          </div>
        </div>
      </div>
    </main>
  );
}
