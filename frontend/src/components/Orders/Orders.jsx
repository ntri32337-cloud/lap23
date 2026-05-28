// src/components/Orders/Orders.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../Auth/OrdersProvider";
import { useAuth } from "../Auth/AuthProvider";

export default function Orders() {
  const { currentUser } = useAuth();
  const { userOrders, cancelOrder, deleteOrder, updateOrderStatus, markOrdersAsRead } = useOrders();

  // ✅ vào trang orders => markOrdersAsRead (theo PDF)
  useEffect(() => {
    markOrdersAsRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fmtDate = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso || "";
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <h2 className="fw-bold m-0">My Orders</h2>
        <div className="d-flex gap-2">
          <Link to="/" className="btn btn-outline-secondary">
            Back Home
          </Link>
          <Link to="/cart" className="btn btn-outline-primary">
            Cart
          </Link>
        </div>
      </div>

      <div className="text-muted mt-2">
        User: <b>{currentUser?.username}</b>
      </div>

      <div className="table-responsive mt-3">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ width: 140 }}>Order ID</th>
              <th style={{ width: 220 }}>Created</th>
              <th style={{ width: 140 }}>Status</th>
              <th>Total</th>
              <th style={{ width: 240 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {(userOrders ?? []).length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-muted py-4">
                  Chưa có đơn hàng nào.
                </td>
              </tr>
            ) : (
              userOrders
                .slice()
                .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
                .map((o) => {
                  const total = Number(o.grandTotal ?? o.totalPrice ?? 0);
                  const isCancelled = String(o.status).toLowerCase() === "cancelled";
                  const isDone = String(o.status).toLowerCase() === "done";

                  return (
                    <tr key={o.id}>
                      <td className="fw-bold">
                        {o.id}{" "}
                        {o.isNew && <span className="badge bg-warning text-dark ms-1">NEW</span>}
                      </td>
                      <td>{fmtDate(o.created_at)}</td>
                      <td>
                        <span
                          className={`badge ${
                            isCancelled
                              ? "bg-secondary"
                              : isDone
                              ? "bg-success"
                              : "bg-primary"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="fw-semibold">${total.toFixed(2)}</td>
                      <td>
                        <div className="d-flex gap-2 flex-wrap">
                          <button
                            className="btn btn-outline-success btn-sm"
                            type="button"
                            onClick={() => updateOrderStatus(o.id, "Done")}
                            disabled={isCancelled || isDone}
                            title="Mark Done"
                          >
                            Done
                          </button>

                          <button
                            className="btn btn-outline-warning btn-sm"
                            type="button"
                            onClick={() => cancelOrder(o.id)}
                            disabled={isCancelled || isDone}
                            title="Cancel order"
                          >
                            Cancel
                          </button>

                          <button
                            className="btn btn-outline-danger btn-sm"
                            type="button"
                            onClick={() => deleteOrder(o.id)}
                            title="Delete order"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>

      {/* detail items */}
      {(userOrders ?? []).length > 0 && (
        <div className="mt-3">
          <h5 className="fw-bold mb-2">Order items (Latest)</h5>
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              {(userOrders ?? [])
                .slice()
                .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
                .slice(0, 1)
                .map((o) => (
                  <div key={`items-${o.id}`}>
                    <div className="text-muted mb-2">
                      Order <b>#{o.id}</b> items:
                    </div>
                    <ul className="mb-0">
                      {(o.orderItems ?? []).map((it, idx) => (
                        <li key={idx}>
                          {it.name} — ${Number(it.price).toFixed(2)} × {it.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}