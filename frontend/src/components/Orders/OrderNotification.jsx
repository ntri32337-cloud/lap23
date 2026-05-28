// src/components/Orders/OrderNotification.jsx
import { useOrders } from "../Auth/OrdersProvider";

export default function OrderNotification() {
  const { userOrders, toggleCancelOrder } = useOrders();

  return (
    <>
      <div className="container" style={{ paddingTop: "180px", paddingBottom: "130px" }}>
        <h2>My Orders</h2>

        <div className="table-responsive-lg">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Products</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Shipping Address</th>
                <th>Created At</th>
                <th style={{ width: 110 }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {(userOrders ?? []).map((order) => {
                const statusText = String(order.status ?? "");
                const statusLower = statusText.toLowerCase();

                const isShipped = statusLower === "shipped";
                const isCancelled = statusLower === "cancelled";

                // shipped: disable hết
                const disabled = isShipped;

                // UI: cancelled -> undo, processing -> cancel
                const btnClass = disabled
                  ? "btn-secondary"
                  : isCancelled
                    ? "btn-success"
                    : "btn-danger";

                const title = isShipped
                  ? "Đơn đã Shipped nên không thể hủy/hoàn tác"
                  : isCancelled
                    ? "Hoàn tác: chuyển về Processing"
                    : "Hủy đơn: chuyển sang Cancelled";

                const icon = isCancelled ? "bi bi-arrow-counterclockwise" : "bi bi-trash";
                const label = isCancelled ? "Undo" : "Cancel";

                return (
                  <tr key={order._id}>
                    <td>{order._id}</td>

                    <td>
                      <ul className="list-unstyled mb-0">
                        {(order.orderItems ?? []).map((item, i) => (
                          <li key={i}>
                            {item.name ?? item.productId} - Qty: {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>

                    <td>{Number(order.totalPrice ?? 0).toLocaleString()} đ</td>
                    <td>{order.status}</td>

                    <td>
                      <div>{order.address}</div>
                      <div>{order.phone}</div>
                    </td>

                    <td>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>

                    <td className="text-center">
                      <button
                        className={`btn btn-sm ${btnClass}`}
                        onClick={() => toggleCancelOrder(order._id)}
                        disabled={disabled}
                        title={title}
                        style={{ minWidth: 86 }}
                      >
                        <i className={`${icon} me-1`}></i>
                        {label}
                      </button>
                    </td>
                  </tr>
                );
              })}

              {(userOrders ?? []).length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}