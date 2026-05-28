// src/components/Cart/Cart.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartProvider";

export default function Cart() {
  const [showMessage, setShowMessage] = useState(false);

  const {
    carts,
    updateQuantity,
    removeItem,
    toggleSelect,
    toggleSelectAll,
  } = useCart();

  const navigate = useNavigate();

  const subtotal = (carts ?? [])
    .filter((item) => item.selected)
    .reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckOut = () => {
    const hasSelectedItem = (carts ?? []).some((item) => item.selected);
    if (!hasSelectedItem) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    } else {
      navigate("/checkout");
    }
  };

  return (
    <>
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Cart</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item">Home</li>
          <li className="breadcrumb-item">Pages</li>
          <li className="breadcrumb-item active text-white">Cart</li>
        </ol>
      </div>

      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th scope="col">
                    <input
                      type="checkbox"
                      checked={carts.length > 0 && carts.every((item) => item.selected)}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th scope="col">Products</th>
                  <th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Total</th>
                  <th scope="col">Handle</th>
                </tr>
              </thead>

              <tbody>
                {(carts ?? []).map((item) => (
                  <tr key={item._id ?? item.productId}>
                    <td>
                      <input
                        type="checkbox"
                        checked={!!item.selected}
                        onChange={() => toggleSelect(item.productId, item.selected)}
                      />
                    </td>

                    <td>
                      <img
                        src={item.image}
                        className="img-fluid me-5 rounded-circle"
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                        alt={item.name}
                        onError={(e) => (e.currentTarget.src = "/images/no-image-icon.jpg")}
                      />
                    </td>

                    <td>
                      <p className="mb-0 mt-0">{item.name}</p>
                    </td>

                    <td>
                      <p className="mb-0 mt-0">
                       {Number(item.price).toLocaleString("vi-VN")} đ
                     </p>
                    </td>

                    <td>
                      <div className="input-group quantity mt-0" style={{ width: "100px" }}>
                        <div className="input-group-btn">
                          <button
                            className="btn btn-sm btn-minus rounded-circle bg-light border"
                            onClick={() =>
                              updateQuantity(item, Math.max(1, item.quantity - 1))
                            }
                            disabled={item.quantity <= 1}
                            type="button"
                          >
                            <i className="fa fa-minus"></i>
                          </button>
                        </div>

                        <span
                          className="form-control text-center border-0"
                          style={{ backgroundColor: "#ffffff" }}
                        >
                          {item.quantity}
                        </span>

                        <div className="input-group-btn">
                          <button
                            className="btn btn-sm btn-plus rounded-circle bg-light border"
                            onClick={() => updateQuantity(item, item.quantity + 1)}
                            type="button"
                          >
                            <i className="fa fa-plus"></i>
                          </button>
                        </div>
                      </div>
                    </td>

                    <td>
                      <p className="mb-0 mt-0">
                        {Number(item.price * item.quantity).toLocaleString("vi-VN")} đ
                      </p>
                    </td>

                    <td>
                      <button
                        className="btn btn-danger rounded-circle bg-light border mt-0"
                        onClick={() => removeItem(item.productId)}
                        type="button"
                      >
                        <i className="fa fa-times text-danger"></i>
                      </button>
                    </td>
                  </tr>
                ))}

                {carts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      Chưa có sản phẩm trong giỏ hàng.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="row g-4 justify-content-end">
            <div className="col-sm-8 col-md-7 col-lg-6 col-xl-5">
              <div className="cart-total-box p-4">
                <div className="p-4">
                  {showMessage && (
                    <p className="text-danger">
                      Bạn chưa chọn sản phẩm để thanh toán!
                    </p>
                  )}

                  <h1 className="display-6 mb-4">
                    Cart <span className="fw-normal">Total</span>
                  </h1>

                  <div className="d-flex justify-content-between mb-4">
                    <h5 className="mb-0 me-4">Subtotal:</h5>
                    <p className="mb-0">
  {Number(subtotal).toLocaleString("vi-VN")} đ
</p>
                  </div>

                  <div className="d-flex justify-content-between">
                    <h5 className="mb-0 me-4">Shipping</h5>
                    <div>
                      <p className="mb-0">Calculated at checkout</p>
                    </div>
                  </div>
                </div>

                <div className="py-4 mb-2 border-top border-bottom d-flex justify-content-between">
                  <h5 className="mb-0 ps-4 me-4">Total</h5>
                  <p className="mb-0 pe-4">
  {Number(subtotal).toLocaleString("vi-VN")} đ
</p>
                </div>

                <button
                  className="btn border-secondary rounded-pill text-primary text-uppercase mb-4 ms-4"
                  type="button"
                  onClick={handleCheckOut}
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}