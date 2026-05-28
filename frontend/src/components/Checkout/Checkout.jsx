import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";
import { useCart } from "../Cart/CartProvider";
import orderApi, { createOrder } from "../../api/orderApi";
import cartApi from "../../api/cartApi";

export default function Checkout() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { carts, setCarts } = useCart();

  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    email: "",
    address: "",
  });

  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      email: currentUser?.email ?? "",
    }));
  }, [currentUser]);

  const selectedProducts = useMemo(
    () => carts.filter((item) => item.selected === true),
    [carts]
  );

  const subtotal = useMemo(
    () =>
      selectedProducts.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
        0
      ),
    [selectedProducts]
  );

  const total = useMemo(() => subtotal + shippingFee, [subtotal, shippingFee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (selectedProducts.length === 0) {
    alert("Vui lòng chọn sản phẩm!");
    return;
  }

  const orderData = {
    ownerId: currentUser._id,                    // ✅ ID user
    customerName: formData.fullname,             // ✅ Tên Dashboard
    orderItems: selectedProducts.map(item => ({
      productId: item.productId?._id || item.productId,  // ✅ ID món ăn
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
      image: item.image
    })),
    totalPrice: subtotal,                        // ✅ Tổng sản phẩm
    shippingFee: shippingFee,                    // ✅ Phí ship
    address: formData.address,
    phone: formData.phone,
    email: formData.email || currentUser.email
  };

  console.log("📤 Gửi đơn hàng:", orderData);

  try {
    const response = await createOrder(orderData);
    
    if (response.data.status) {
      // Xóa cart
      await cartApi.deleteSelectedCart();
      setCarts([]);
      
      alert("✅ Đặt hàng thành công!");
      navigate("/");
    } else {
      alert(response.data.message || "Lỗi đặt hàng");
    }
  } catch (error) {
    console.error("❌ Lỗi API:", error);
    alert(error.response?.data?.message || "Lỗi kết nối server");
  }
};
const isShipFree = shippingFee === 0;
const isShipFlat = shippingFee === 15000;
const isShipLocal = shippingFee === 8000;

  return (
    <>
      <div className="container-fluid py-5">
        <div className="container py-5">
          <h1 className="mb-4">Billing details</h1>

          <form onSubmit={handleSubmit}>
            <div className="row g-5">
              {/* LEFT */}
              <div className="col-md-12 col-lg-6 col-xl-5">
                <div className="row">
                  <div className="col-md-12 col-lg-6">
                    <div className="form-item w-100">
                      <label className="form-label my-3">
                        Full Name <sup>*</sup>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-12 col-lg-6">
                    <div className="form-item w-100">
                      <label className="form-label my-3">
                        Phone <sup>*</sup>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-item">
                  <label className="form-label my-3">
                    Email <sup>*</sup>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-item">
                  <label className="form-label my-3">
                    Address <sup>*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* RIGHT */}
              <div className="col-md-12 col-lg-6 col-xl-7">
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th scope="col">Products</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Total</th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedProducts.map((item) => (
                        <tr key={item._id ?? String(item.productId)}>
                          <th scope="row">
                            <div className="d-flex align-items-center mt-2">
                              <img
                                src={item.image}
                                className="img-fluid rounded-circle"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                }}
                                alt={item.name}
                                onError={(e) =>
                                  (e.currentTarget.src = "/images/no-image-icon.jpg")
                                }
                              />
                            </div>
                          </th>

                          <td>{item.name}</td>
                          <td>{Number(item.price).toLocaleString("vi-VN")} ₫</td>
                          <td>{item.quantity}</td>
                          <td>
                              {(Number(item.price) * Number(item.quantity)).toLocaleString("vi-VN")} ₫
                          </td>
                        </tr>
                      ))}

                      <tr>
                        <th scope="row" colSpan={3}></th>
                        <td>
                          <p className="mb-0 text-dark py-2">Subtotal</p>
                        </td>
                        <td>
                          <div className="py-2 border-bottom border-top">
                            <p className="mb-0 text-dark">{subtotal.toLocaleString("vi-VN")} ₫</p>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <th scope="row"></th>
                        <td className="py-2">
                          <p className="mb-0 text-dark py-4">Shipping</p>
                        </td>
                        <td colSpan="3" className="py-2">
                          <div className="form-check text-start">
                           <input
  type="radio"
  name="shipping"
  className="form-check-input bg-primary border-0"
  checked={isShipFree}
  onChange={() => setShippingFee(0)}
/>
                            <label className="form-check-label" htmlFor="Shipping-1">
                              Free Shipping
                            </label>
                          </div>

                          <div className="form-check text-start">
                            <input
  type="radio"
  name="shipping"
  className="form-check-input bg-primary border-0"
  checked={isShipFlat}
  onChange={() => setShippingFee(15000)}
/>
                            <label className="form-check-label" htmlFor="Shipping-2">
                              Giá cố định: 15.000 ₫
                            </label>
                          </div>

                          <div className="form-check text-start">
                           <input
  type="radio"
  name="shipping"
  className="form-check-input bg-primary border-0"
  checked={isShipLocal}
  onChange={() => setShippingFee(8000)}
/>  
                            <label className="form-check-label" htmlFor="Shipping-3">
                              Nhận tại cửa hàng: 8.000 ₫
                            </label>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <th scope="row"></th>
                        <td className="py-2" colSpan={3}>
                          <p className="mb-0 text-dark text-uppercase py-3">TOTAL</p>
                        </td>
                        <td className="py-2">
                          <div className="py-3 border-bottom border-top">
                            <p className="mb-0 text-dark">{total.toLocaleString("vi-VN")} ₫</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="row g-4 text-center align-items-center justify-content-center pt-4">
                  <button
                    type="submit"
                    className="btn border-secondary py-3 px-4 text-uppercase w-100 text-primary"
                    disabled={selectedProducts.length === 0}
                  >
                    PLACE ORDER
                  </button>
                </div>

                {selectedProducts.length === 0 && (
                  <p className="text-danger mt-3">
                    You haven&apos;t selected any items to proceed with checkout!
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}