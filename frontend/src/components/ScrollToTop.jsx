// frontend/src/components/ScrollToTop.jsx
import { useLayoutEffect, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const location = useLocation();

  // ✅ Chặn browser tự restore scroll (nguyên nhân hay làm "mở ở dưới")
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  // ✅ Cuộn lên đầu NGAY khi đổi route (dùng key để chắc chắn)
  useLayoutEffect(() => {
    // Nếu có hash thì ưu tiên scroll tới section đó
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }
    }

    // Cuộn window về top (set cả documentElement/body để tương thích)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [location.key]); // 👈 key thay đổi mỗi lần navigate

  return null;
}