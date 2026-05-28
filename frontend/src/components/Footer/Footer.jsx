export default function Footer() {
  return (
    <footer className="footer">

      <div className="container footer-container">

        <div className="row">

          {/* Cột 1 */}
          <div className="col-md-4">

            <h4>NVA Beer & Drinks</h4>

            <p>
              Đại lý bia và nước ngọt chuyên cung cấp
              sản phẩm chính hãng với giá đại lý.
            </p>

            <p>
              📍 Hóc Môn, TP Hồ Chí Minh
            </p>

            <p>
              📞 0392 418 310
            </p>

            <p>
              ✉ Email: NguyenVanAn123@gmail.com
            </p>

          </div>

          {/* Cột 2 */}
          <div className="col-md-3">

            <h4>Thông tin</h4>

            <ul>
              <li>Trang chủ</li>
              <li>Cửa hàng</li>
              <li>Liên hệ</li>
            </ul>

          </div>

          {/* Cột 3 */}
          <div className="col-md-3">

            <h4>Hỗ trợ</h4>

            <ul>
              <li>Chính sách vận chuyển</li>
              <li>Chính sách đổi trả</li>
              <li>Chính sách thanh toán</li>
              <li>Chính sách khuyến mãi</li>
            </ul>

          </div>

          {/* Cột 4 */}
          <div className="col-md-2">

            <h4>Theo dõi</h4>

            <p>Facebook</p>
            <p>TikTok</p>
            <p>YouTube</p>

          </div>

        </div>

      </div>

      <div className="footer-bottom text-center py-3">
  © 2026 NVA Beer & Drinks
</div>

    </footer>
  );
}