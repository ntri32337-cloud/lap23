// src/components/Cart/CartProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthProvider";
import cartApi from "../../api/cartApi";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { currentUser, isAuthenticated } = useAuth();
  const [carts, setCarts] = useState([]);

  const ownerId = currentUser?._id ?? currentUser?.id ?? null;
  const ownerType = currentUser?.role ?? null;

  const loadCart = async () => {
    try {
      if (!isAuthenticated || !ownerId) {
        setCarts([]);
        return;
      }

      const res = await cartApi.getCart(ownerId);
      setCarts(res?.data?.items ?? []);
    } catch (error) {
      console.error("Load cart error:", error);
      setCarts([]);
    }
  };

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerId, isAuthenticated]);

  const addToCart = async (product, value = 1) => {
    try {
      if (!isAuthenticated || !ownerId || !ownerType) {
        alert("Vui lòng đăng nhập trước khi thêm vào giỏ hàng");
        return;
      }

      const quantity = Math.max(1, Number(value) || 1);
      const productId = String(product?._id ?? product?.id ?? "");

      if (!productId) {
        alert("Sản phẩm không hợp lệ");
        return;
      }

      const res = await cartApi.addToCart({
        ownerId,
        ownerType,
        product: {
          productId,
          name: product.name,
          image: product.image,
          price: Number(product.price) || 0,
          quantity,
        },
      });

      setCarts(res?.data?.items ?? []);
      alert("Add to cart");
    } catch (error) {
      console.error("Add to cart error:", error);
      alert(error?.response?.data?.message ?? "Add to cart failed");
    }
  };

  const removeItem = async (productId) => {
    try {
      if (!ownerId) return;

      const res = await cartApi.removeItem({
        ownerId,
        productId: String(productId),
      });

      setCarts(res?.data?.items ?? []);
    } catch (error) {
      console.error("Remove item error:", error);
      alert("Remove item failed");
    }
  };

  const updateQuantity = async (item, quantity) => {
    try {
      if (!ownerId) return;

      const nextQty = Math.max(1, Number(quantity) || 1);

      const res = await cartApi.updateQuantity({
        ownerId,
        productId: String(item.productId),
        quantity: nextQty,
      });

      setCarts(res?.data?.items ?? []);
    } catch (error) {
      console.error("Update quantity error:", error);
      alert("Update quantity failed");
    }
  };

  const toggleSelect = async (productId, selected) => {
    try {
      if (!ownerId) return;

      const res = await cartApi.updateSelected({
        ownerId,
        productId: String(productId),
        selected: !selected,
      });

      setCarts(res?.data?.items ?? []);
    } catch (error) {
      console.error("Toggle select error:", error);
      alert("Update selected failed");
    }
  };

  const toggleSelectAll = async (checked) => {
    try {
      if (!ownerId) return;

      // update UI trước
      const updated = carts.map((item) => ({
        ...item,
        selected: checked,
      }));
      setCarts(updated);

      // gọi API từng item
      for (const item of carts) {
        await cartApi.updateSelected({
          ownerId,
          productId: String(item.productId),
          selected: checked,
        });
      }
    } catch (error) {
      console.error("Toggle select all error:", error);
      await loadCart();
    }
  };

  return (
    <CartContext.Provider
      value={{
        carts,
        setCarts,
        loadCart,
        addToCart,
        removeItem,
        updateQuantity,
        toggleSelect,
        toggleSelectAll,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);