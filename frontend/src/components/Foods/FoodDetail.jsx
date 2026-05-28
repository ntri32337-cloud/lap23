// src/components/Foods/FoodDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import foodApi from "../../api/foodApi";

export default function FoodDetail({ foods = [], addToCart }) {
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [food, setFood] = useState(null);

  // Try find from foods prop first (đỡ gọi API lại)
  const foundFromList = useMemo(() => {
    return foods.find((p) => String(p?._id ?? p?.id) === String(id));
  }, [foods, id]);

  useEffect(() => {
    setQuantity(1);

    // Nếu đã có trong list thì dùng luôn
    if (foundFromList) {
      setFood(foundFromList);
      setLoading(false);
      return;
    }

    // Nếu chưa có, fetch từ API (Lab20)
    const fetchFood = async () => {
      try {
        const res = await foodApi.getById(id);
        setFood(res.data);
      } catch (err) {
        console.error("Fetch food error:", err);
        setFood(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id, foundFromList]);

  const relatedProducts = useMemo(() => {
    if (!food) return [];
    const catName = food?.category?.name ?? food?.category;
    return foods
      .filter((p) => String(p?._id) !== String(food?._id))
      .filter((p) => (p?.category?.name ?? p?.category) === catName)
      .slice(0, 4);
  }, [foods, food]);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center text-muted">Loading...</div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="container py-5">
        <h3>Không tìm thấy sản phẩm</h3>
        <Link to="/" className="btn btn-primary mt-3">Về Home</Link>
      </div>
    );
  }

  return (
    <div className="food-detail-wrapper py-5">
      {/* Breadcrumb */}
      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/foods">Foods</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {food.name}
            </li>
          </ol>
        </nav>
      </div>

      {/* Main Product Detail - CÂN ĐỐI 2 CỘT */}
      <div className="container">
        <div className="row g-5 align-items-start">
          {/* CỘT 1: ẢNH - CĂN GIỮA HOÀN HẢO */}
          <div className="col-lg-6">
            <div className="product-gallery">
              <div className="main-image-wrapper">
                <img src={food.image}
                  alt={food.name}
                  className="main-product-img"
                  onError={(e) => (e.currentTarget.src = "/images/no-image-icon.jpg")}
                />
              </div>
            </div>
          </div>

          {/* CỘT 2: INFO - FULL HEIGHT */}
          <div className="col-lg-6">
            <div className="product-info-card">
              <h1 className="product-title mb-3">{food.name}</h1>
              
              <div className="product-meta mb-3">
                <span className="badge bg-light text-dark px-3 py-2 me-2">
                  {food.category?.name ?? food.category ?? "Other"}
                </span>
              </div>

              <div className="product-price mb-4">
                <span className="price-current fs-2 fw-bold text-danger">
                  {Number(food.price ?? 0).toLocaleString()} đ
                </span>
                <span className="price-unit ms-2">/ thùng</span>
              </div>

              <div className="product-description mb-4">
                <p>{food.description ?? "No description"}</p>
              </div>

              {/* Quantity & Buttons */}
              <div className="quantity-section mb-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <label className="fw-bold fs-6 mb-0">Số lượng:</label>
                  <div className="quantity-control">
                    <button 
                      className="qty-btn" 
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      -
                    </button>
                    <input
                      className="qty-input"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                    />
                    <button 
                      className="qty-btn" 
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-add-cart flex-fill rounded-pill py-3 fw-bold"
                    style={{ background: "#e60023", color: "white", border: "none" }}
                    onClick={() => addToCart(food, quantity)}
                  >
                    <i className="fas fa-cart-plus me-2"></i>
                    Thêm vào giỏ
                  </button>
                  <Link 
                    to="/cart" 
                    className="btn btn-outline-secondary rounded-pill px-4 py-3"
                  >
                    Xem giỏ hàng
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <>
          <hr className="my-5" />
          <div className="container">
            <h3 className="section-title mb-4 text-center">Sản phẩm liên quan</h3>
            <div className="row g-4">
              {relatedProducts.map((p) => (
                <div className="col-lg-3 col-md-6" key={p._id}>
                  <div className="related-card h-100">
                    <div className="related-image-wrapper">
                      <img
                        src={p.image}
                        className="related-img"
                        alt={p.name}
                        onError={(e) => (e.currentTarget.src = "/images/no-image-icon.jpg")}
                      />
                    </div>
                    <div className="card-body p-4">
                      <h6 className="related-title fw-bold mb-2">{p.name}</h6>
                      <div className="price mb-3 fs-5 fw-bold text-danger">
                        {Number(p.price ?? 0).toLocaleString()} đ
                      </div>
                      <div className="d-flex gap-2">
                        <Link
                          to={`/food/${p._id}`}
                          className="btn btn-outline-primary btn-sm flex-fill rounded-pill"
                        >
                          Chi tiết
                        </Link> 
                        <button 
                          className="btn btn-danger btn-sm rounded-pill px-3"
                          onClick={() => addToCart(p, 1)}
                        >
                          Thêm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}