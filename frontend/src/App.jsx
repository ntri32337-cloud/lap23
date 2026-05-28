// src/App.jsx
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout/Layout.jsx";
import Home from "./components/Home/Home.jsx";
import Shop from "./components/Foods/Shop.jsx";
import Contact from "./components/Header/Contact.jsx";
import Navbar from "./components/Footer/Navbar";
import FoodDetail from "./components/Foods/FoodDetail.jsx";
import Cart from "./components/Cart/Cart.jsx";
import Signin from "./components/Auth/Signin.jsx";
import SignUp from "./components/Auth/Signup.jsx";
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx";
import Dashboard from "./components/Admin/Dashboard.jsx";
import Users from "./components/Admin/Users.jsx";
import Product from "./components/Admin/Products/Product.jsx";
import UserRolePermissions from "./components/Admin/UserRolePermissions.jsx";
import UserEmployees from "./components/Admin/UserEmployees.jsx";
import Customers from "./components/Admin/Customers.jsx";
import Contacts from "./components/Admin/Contacts";
import Checkout from "./components/Checkout/Checkout.jsx";
import Profile from "./components/Profile/Profile.jsx";
import OrderNotification from "./components/Orders/OrderNotification.jsx";
import OrderList from "./components/Orders/OrderList.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { useAuth } from "./components/Auth/AuthProvider";
import { useCart } from "./components/Cart/CartProvider";


import { userData } from "./components/data/Users.js";
import customerData from "./components/data/Customers.js";
import employeeData from "./components/data/Employees.js";

import foodApi from "./api/foodApi";
import categoryApi from "./api/categoryApi";
import employeeApi from "./api/employeeApi";

function safeLoad(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === 0) return fallback;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const { currentUser } = useAuth();
  const { carts, addToCart } = useCart();

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);

  // giữ local cho admin các lab cũ
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const u = safeLoad("user", userData);
    const e = safeLoad("employee", employeeData);
    const c = safeLoad("customer", customerData);

    setUsers(u);
    setEmployees(e);  
    setCustomers(c);

    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("employee", JSON.stringify(e));
    localStorage.setItem("customer", JSON.stringify(c));
  }, []);

  useEffect(() => localStorage.setItem("user", JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem("employee", JSON.stringify(employees)), [employees]);
  useEffect(() => localStorage.setItem("customer", JSON.stringify(customers)), [customers]);

  useEffect(() => {
    if (!users || users.length === 0) return;

    setEmployees((prev) => {
      const prevList = prev ?? [];
      const userIds = new Set(users.map((u) => String(u.id)));
      let next = prevList.filter((emp) => userIds.has(String(emp.id)));

      const empIds = new Set(next.map((emp) => String(emp.id)));
      const missing = users
        .filter((u) => !empIds.has(String(u.id)))
        .map((u) => ({
          id: u.id,
          image: u.image ?? "/images/avatar.jpg",
          fullname: "",
          email: u.email ?? "",
          phone: "",
          address: "",
        }));

      if (missing.length) next = [...next, ...missing];
      return next;
    });
  }, [users]);

  const fetchCategories = async () => {
  try {
    const res = await categoryApi.getAll();

    console.log("API categories:", res);

    setCategories(res.data?.data || res.data || []);

  } catch (err) {
    console.error("Fetch categories error:", err);
  }
};

  const fetchFoods = async () => {
  try {

    const res = await foodApi.getAll();

    console.log("API foods:", res);

    const data = Array.isArray(res)
      ? res
      : res.data?.data || res.data?.foods || res.data || [];

    setFoods(data);

  } catch (err) {
    console.error("Fetch foods error:", err);
  }
};
  useEffect(() => {
    fetchCategories();
    fetchFoods();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout carts={carts} />}>


          <Route
            index
            element={<Home
                foods={foods}
                categories={categories}
                addToCart={addToCart}
              />
            }
          />
          <Route path="shop"element={ <Shop
              foods={foods}
              categories={categories}
              addToCart={addToCart}
              />
            }
          />
         <Route path="contact" element={<Contact />}/>
          <Route
            path="food/:id"
            element={
              <FoodDetail
                foods={foods}
                addToCart={addToCart}
              />
            }
          />

          <Route
            path="cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<SignUp />} />

          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="notification"
            element={
              <ProtectedRoute>
                <OrderNotification />
              </ProtectedRoute>
            }
          />

          <Route
            path="orders"
            element={<Navigate to="/notification" replace />}
          />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute roles={["admin", "user"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route
              path="food"
              element={<Product foods={foods} setFoods={setFoods} />}
            />
            <Route
              path="product"
              element={<Product foods={foods} setFoods={setFoods} />}
            />
            <Route
              path="user"
              element={<Users users={users} setUsers={setUsers} />}
            />
            <Route
              path="permissions"
              element={<UserRolePermissions users={users} setUsers={setUsers} />}
            />
            <Route
              path="employees"
              element={
                <UserEmployees
                  users={users}
                  setUsers={setUsers}
                  employees={employees}
                  setEmployees={setEmployees}
                />
              }
            />
            <Route
              path="customers"
              element={
                <Customers
                  customers={customers}
                  setCustomers={setCustomers}
                />
              }
            />
              <Route
                path="contacts"
                element={<Contacts />}
              />         
            <Route
              path="orders"
              element={
                <OrderList
                  employees={employees}
                  customers={customers}
                />
              }
            />
            <Route index element={<Navigate to="food" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}