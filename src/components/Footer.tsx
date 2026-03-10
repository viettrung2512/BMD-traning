// Footer.tsx
import "@/styles/main.scss";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <p className="footer-brand-name">CÔNG TY TNHH SX &amp; KD THỰC PHẨM CHAY ÂU LẠC</p>
          <p>735 - 737 Nguyễn Kiệm, P.3, Q.Gò Vấp, TP.HCM</p>
          <p>028.3717.3989</p>
          <p>vegan@aulac-vegan.com</p>
          <p className="footer-brand-note">Chuyên cung cấp thực phẩm chay sạch, an toàn và bổ dưỡng</p>
        </div>

        <div className="footer-col">
          <h4>Hỗ trợ</h4>
          <ul>
            <li><a href="/policy">Quy định và Chính sách</a></li>
            <li><a href="/term-of-use">Điều khoản sử dụng</a></li>
            <li><a href="/faq">Câu hỏi thường gặp</a></li>
            <li><a href="/contact">Liên hệ</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Khu vực giao hàng</h4>
          <p>TP. Hồ Chí Minh</p>
          <p>Bình Dương</p>
          <p>Đồng Nai</p>
          <p>Long An</p>
          <p className="footer-delivery-note">Giao hàng toàn quốc qua đối tác vận chuyển</p>
        </div>
      </div>
    </footer>
  )
}
