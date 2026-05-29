// backend/seedFoods.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Import models (đúng đường dẫn theo backend của bạn)
const Category = require("./models/category");
const Food = require("./models/food");

// ===== Data từ Foods.js (Lab19) =====
// Giữ nguyên image "/img/..." như Foods.js của bạn
const IMG_BASE = "/img";

const FOODS = [
  {
    name: "Grapes",
    categoryName: "Fruits",
    price: 4.99,
    rating: 5,
    image: `${IMG_BASE}/fruite-item-5.jpg`,
    description: "Fresh grapes – sweet & crisp. Great for snacks and desserts.",
    stock: 100,
  },
  {
    name: "Raspberries",
    categoryName: "Fruits",
    price: 4.99,
    rating: 5,
    image: `${IMG_BASE}/fruite-item-2.jpg`,
    description: "Raspberries rich in antioxidants. Perfect for smoothies.",
    stock: 100,
  },
  {
    name: "Apricots",
    categoryName: "Fruits",
    price: 4.99,
    rating: 4,
    image: `${IMG_BASE}/fruite-item-4.jpg`,
    description: "Apricots soft, sweet, fragrant. Delicious when chilled.",
    stock: 100,
  },
  {
    name: "Oranges",
    categoryName: "Fruits",
    price: 5.49,
    rating: 4,
    image: `${IMG_BASE}/fruite-item-1.jpg`,
    description: "Juicy oranges full of vitamin C. Great for breakfast.",
    stock: 100,
  },
  {
    name: "Banana",
    categoryName: "Fruits",
    price: 4.99,
    rating: 4,
    image: `${IMG_BASE}/fruite-item-3.jpg`,
    description: "Sweet bananas, energy-rich snack. Perfect for workouts.",
    stock: 100,
  },
  {
    name: "Apple",
    categoryName: "Fruits",
    price: 4.99,
    rating: 5,
    image: `${IMG_BASE}/best-product-1.jpg`,
    description: "Crisp apples – great for a healthy and fresh lifestyle.",
    stock: 100,
  },
  {
    name: "Tomato",
    categoryName: "Vegetables",
    price: 2.49,
    rating: 5,
    image: `${IMG_BASE}/vegetable-item-1.jpg`,
    description: "Organic tomato – fresh, juicy. Ideal for salads & cooking.",
    stock: 100,
  },
  {
    name: "Broccoli",
    categoryName: "Vegetables",
    price: 3.19,
    rating: 4,
    image: `${IMG_BASE}/vegetable-item-2.jpg`,
    description: "Broccoli full of fiber and vitamins. Steam or stir-fry.",
    stock: 100,
  },
  {
    name: "Pumpkin",
    categoryName: "Vegetables",
    price: 3.99,
    rating: 4,
    image: `${IMG_BASE}/vegetable-item-5.jpg`,
    description: "Fresh pumpkin – great for soup and healthy meals.",
    stock: 100,
  },
  {
    name: "Bread",
    categoryName: "Bread",
    price: 3.49,
    rating: 4,
    image: `${IMG_BASE}/best-product-3.jpg`,
    description: "Fresh baked bread with soft texture and rich aroma.",
    stock: 100,
  },
  {
    name: "Chicken",
    categoryName: "Meat",
    price: 6.99,
    rating: 5,
    image: `${IMG_BASE}/best-product-6.jpg`,
    description: "Premium chicken – clean, tender. Great for grilling & soups.",
    stock: 100,
  },
];

async function ensureCategory(name) {
  // All categories để isActive=true để GET /api/categories thấy được
  let cat = await Category.findOne({ name });
  if (!cat) {
    cat = await Category.create({
      name,
      description: name === "All Products" ? "Show all" : `${name} category`,
      image: "/images/no-image-icon.jpg",
      isActive: true,
    });
  }
  return cat;
}

async function run() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("Missing MONGO_URI in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected MongoDB");

    // 1) Ensure categories
    const categoryNames = ["All Products", "Fruits", "Vegetables", "Bread", "Meat"];
    const catMap = {};
    for (const name of categoryNames) {
      const cat = await ensureCategory(name);
      catMap[name] = cat._id;
    }
    console.log("✅ Categories ensured:", categoryNames.join(", "));

    // 2) Upsert foods theo name (tránh trùng khi chạy lại)
    let upserted = 0;
    for (const f of FOODS) {
      const payload = {
        name: f.name,
        price: f.price,
        image: f.image,
        description: f.description,
        category: catMap[f.categoryName], // ObjectId (đúng schema ref Category)
        stock: f.stock ?? 0,
        rating: f.rating ?? 0,
      };

      const result = await Food.findOneAndUpdate(
        { name: f.name },     // key để không insert trùng
        payload,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      if (result) upserted++;
    }

    console.log(`✅ Seed done. Upserted ${upserted} foods.`);
    console.log("👉 Bạn test: GET https://backend-lap23.onrender.com/foods");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

run();