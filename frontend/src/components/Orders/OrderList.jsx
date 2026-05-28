// src/components/Orders/OrderList.jsx
import { format } from "date-fns";
import { useOrders } from "../Auth/OrdersProvider";

export default function OrderList({ employees = [], customers = [] }) {
  const { orders, updateOrderStatus, deleteOrder } = useOrders();

  const searchName = (userId) => {
    const employee = employees.find((u) => String(u._id) === String(userId));
    if (employee) return employee.fullname || employee.username || "Employee";

    const customer = customers.find((u) => String(u._id) === String(userId));
    if (customer) return customer.fullname || customer.username || "Customer";

    return "No name";
  };

  return (
    <>
      <h2 className="mb-4">Order List</h2>

      <div className="table-responsive-lg">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>Orderer's name</th>
              <th>Products</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Shipping Address</th>
              <th>Created At</th>
              <th style={{ width: 90 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {(orders ?? []).map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.customerName}</td>

                <td>
                  <ul className="list-unstyled mb-0">
                    {(order.orderItems ?? []).map((item, index) => (
                      <li key={index}>
                        {item.name ? item.name : item.productId} - Quantity: {item.quantity} - Price:{" "}
                        {item.price} đ
                        
                      </li>
                    ))}
                  </ul>
                </td>

                <td>
  {(order.totalPrice ?? 0).toLocaleString("vi-VN")} đ
</td>

                <td>
                  <select
                    className="form-select"
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  >
                   <option value="pending">Pending</option>
<option value="processing">Processing</option>
<option value="shipped">Shipped</option>
<option value="delivered">Delivered</option>
<option value="cancelled">Cancelled</option>
                  </select>
                </td>

                <td>
                  <div>Email: {order.email}</div>
                  <div>Address: {order.address}</div>
                  <div>Phone: {order.phone}</div>
                </td>

                <td>{order.createdAt
  ? format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")
  : "N/A"}</td>

                <td className="text-center">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteOrder(order._id)}
                    title="Delete order"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}

            {(!orders || orders.length === 0) && (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}