  import { useEffect, useMemo, useState } from "react";
  import { Link, useSearchParams } from "react-router-dom";
  import BannerSlider from "./BannerSlider";
  

  export default function Home({ foods = [], categories = [], addToCart }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const catParam = searchParams.get("cat");
    const [active, setActive] = useState(0);

    // Sync active tab
    useEffect(() => {
      if (!categories?.length || !catParam) {
        setActive(0);
        return;
      }
      const decoded = decodeURIComponent(catParam);
      const idx = categories.findIndex(c => 
        c.name.toLowerCase().includes(decoded.toLowerCase())
      );
      setActive(idx >= 0 ? idx : 0);
    }, [catParam, categories]);

    const handleTabClick = (index) => {
      setActive(index);
      const name = categories[index]?.name;
      if (!name || name === "All Products") {
        setSearchParams({});
      } else {
        setSearchParams({ cat: name });
      }
    };

    // 🔥 UNIVERSAL FILTER - HOẠT ĐỘNG VỚI MỌI DATA
const filteredFoods = useMemo(() => {
  if (!catParam) return foods;

  const urlCat = decodeURIComponent(catParam).trim().toLowerCase();
  
  return foods.filter((food) => {
    const foodName = (food.name || '').toLowerCase();
    
    // 🔥 BIA - match tất cả 6 sản phẩm
    if (urlCat === 'bia') {
      return foodName.includes('bia') || 
             foodName.includes('heineken') ||
             foodName.includes('strongbow') ||
             foodName.includes('sài gòn');
    }
    
    // Nước ngọt
    if (urlCat === 'nước ngọt') {
      return foodName.includes('7up') || foodName.includes('coca') ||
             foodName.includes('pepsi') || foodName.includes('mirinda') ||
             foodName.includes('revive') || foodName.includes('sting') ||
             foodName.includes('number one') || foodName.includes('rockstar') ||
             foodName.includes('nước cam') || foodName.includes('chanh');
    }
    
    // Nước suối
    if (urlCat === 'nước suối') {
      return foodName.includes('aquafina') || 
             foodName.includes('dasani') || 
             foodName.includes('lavie');
    }
    
    // Fallback
    const foodCat = String(food.category || '').trim().toLowerCase();
    return foodCat === urlCat;
  });
}, [foods, catParam]);
    return (
      <>
        <div className="container-fluid hero-header shop-hero">
          <div className="container py-5">
            <div className="row g-5 align-items-center">
              <div className="col-lg-7">
                <h1 className="display-5">Đại Lý Bia - Nước Ngọt</h1>
                <h5 style={{ color: "#e21c1c", fontWeight: "600" }}>
                  Giá sỉ cho quán nhậu – giao nhanh 1 giờ
                </h5>
              </div>
              <div className="col-lg-5">
                <div className="hero-right-card">
                  <img
                    src="/img/banner-bia.jpg"
                    alt="banner"
                    className="img-fluid hero-right-img"
                    onError={(e) =>
                      (e.currentTarget.src = "/img/banner-bia2.jpg")
                    }
                  />
                  <span className="hero-chip bg-secondary text-white">
                    Đại Lý Bia - Nước Ngọt
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT AREA */}
        <div className="container-fluid fruite py-5">
          <div className="container py-5">
            <div className="row g-4 align-items-center mb-4">
              <div className="col-lg-4">
                <h2 className="product-title">Sản Phẩm Bán Chạy</h2>
              </div>
            </div>
<div className="container-fluid px-0">
    <BannerSlider />
</div>
        

            {/* FILTER BUTTONS - ACTIVE STYLE */}
            <div className="product-filter text-center my-5">
              {categories?.length > 0 && categories.map((cat, index) => (
                <button
                  key={cat._id || index}
                  className={`btn mx-2 ${active === index ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={() => handleTabClick(index)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* FILTER INFO */}
            <div className="row mb-4">
              <div className="col-12 text-center">
                <small className="text-muted">
                  {filteredFoods.length} sản phẩm 
                  {catParam && (
                    <>trong danh mục <strong>"{decodeURIComponent(catParam)}"</strong></>
                  )}
                </small>
              </div>
            </div>

            {/* PRODUCT LIST */}
            <div className="row g-4 product-grid">
              {filteredFoods.map((item) => (
                <div className="col-md-6 col-lg-4 col-xl-3" key={item._id}>
                  <div className="rounded position-relative fruite-item product-card">
                    <div className="fruite-img">
                      <img
                        src={item.image}
                        className="img-fluid w-100"
                        alt={item.name}
                        onError={(e) =>
                          (e.currentTarget.src = "/images/no-image-icon.jpg")
                        }
                      />
                    </div>

                    <div
                      className="text-white bg-secondary px-3 py-1 rounded position-absolute"
                      style={{ top: 10, left: 10 }}
                    >
                      {item.category?.name || item.category}
                    </div>

                    <div className="p-4 border border-secondary border-top-0 rounded-bottom fruite-body">
                      <h4>{item.name}</h4>
                      <p className="fruite-desc text-muted">
                        {item.description ?? "No description"}
                      </p>
                      <div className="fruite-actions">
                        <p className="product-price">
                          {Number(item.price).toLocaleString("vi-VN")} đ / thùng
                        </p>
                        <div className="product-buttons">
                          <Link
                            to={`/food/${item._id}`}
                            className="btn border border-secondary rounded-pill px-3 text-primary"
                          >
                            Detail
                          </Link>
                          <button
                            type="button"
                            className="btn border border-secondary rounded-pill px-3 text-primary"
                            onClick={() => addToCart(item, 1)}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredFoods.length === 0 && catParam && (
                <div className="col-12 text-center text-muted py-5">
                  <i className="fas fa-inbox fa-3x mb-3 d-block"></i>
                  <h5>Không tìm thấy sản phẩm</h5>
                  <p>Không có sản phẩm nào trong danh mục <strong>"{decodeURIComponent(catParam)}"</strong></p>
                  <button 
                    className="btn btn-outline-danger"
                    onClick={() => handleTabClick(0)}
                  >
                    ← Xem tất cả sản phẩm
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }