import { useEffect, useState } from "react";

export default function MyOrders() {

  const [orders,setOrders] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(()=>{

    fetch(`http://localhost:5000/api/orders/user/${userId}`)
      .then(res => res.json())
      .then(data => setOrders(data.data || []));

  },[])

  return (

    <div className="container mt-4">

      <h2>Đơn hàng của tôi</h2>

      {orders.map(order => (

        <div key={order._id} className="card mb-3">
          <div className="card-body">

            <p><b>Mã đơn:</b> {order._id}</p>

            <p>
              <b>Tổng tiền:</b> {order.totalPrice.toLocaleString()} đ
            </p>

            <p>
              <b>Trạng thái:</b> {order.status}
            </p>

          </div>
        </div>

      ))}

    </div>
  );
}