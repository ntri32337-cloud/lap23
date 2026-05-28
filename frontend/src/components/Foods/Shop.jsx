import { useState } from "react";

export default function Shop({ foods, categories, addToCart }) {

  const [active, setActive] = useState("all");

  const filtered =
    active === "all"
      ? foods
      : foods.filter((f) => f.category === active);

  return (
    <div className="container" style={{ padding: "60px 0" }}>

      <h2 style={{ textAlign: "center", marginBottom: 40 }}>
        Sản Phẩm
      </h2>

      {/* CATEGORY FILTER */}
      <div className="shop-categories">
        <button onClick={() => setActive("all")}>Tất cả</button>

        {categories.map((c) => (
          <button
            key={c._id}
            onClick={() => setActive(c.name)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* PRODUCTS */}
      <div className="shop-grid">

        {filtered.map((item) => (
          <div className="shop-card" key={item._id}>

            <img src={item.image} alt={item.name} />

            <h4>{item.name}</h4>

            <p>{item.price.toLocaleString()} đ</p>

            <button
              onClick={() => addToCart(item)}
            >
              Thêm vào giỏ
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}