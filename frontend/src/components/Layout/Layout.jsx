// frontend/src/components/Layout/Layout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function Layout({ carts = [] }) {
  const location = useLocation();

  // Ẩn Header/Footer khi ở dashboard
  const hideLayout = location.pathname.toLowerCase().startsWith("/dashboard");

  return (
    <>
      {!hideLayout && <Header carts={carts} />}

      <main className={!hideLayout ? "site-main container-page" : ""}>
        <Outlet />
      </main>

      {!hideLayout && <Footer />}
    </>
  );
}