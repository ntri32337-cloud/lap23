// frontend/src/components/Admin/Customers.jsx
import { useEffect, useState } from "react";
import customerApi from "../../api/customerApi";
import { useAuth } from "../Auth/AuthProvider";

export default function Customers({ customers, setCustomers }) {
  const { hasPermission } = useAuth();

  const [newCustomer, setNewCustomer] = useState({
    username: "",
    password: "",
    fullname: "",
    phone: "",
    email: "",
    address: "",
    role: "customer",
    locked: false,
  });

  const [editingId, setEditingId] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});

  const fetchCustomers = async () => {
    const res = await customerApi.getAll();
    console.log("customer:", res.data);
    setCustomers(res.data || []);
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePasswordVisibility = (id, disabled) => {
    if (!disabled) setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    setCustomers((prev) => prev.map((c) => (c._id === id ? { ...c, [name]: value } : c)));
  };

  const handleCheckboxChange = (e, id) => {
    setCustomers((prev) =>
      prev.map((c) => (c._id === id ? { ...c, locked: e.target.checked } : c))
    );
  };

  const handleNewUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCustomer((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddCustomer = async () => {
    try {
      await customerApi.create(newCustomer);
      await fetchCustomers();
      setNewCustomer({
        username: "",
        password: "",
        fullname: "",
        phone: "",
        email: "",
        address: "",
        role: "customer",
        locked: false,
      });
      setShowPasswords({});
    } catch (err) {
      alert(err.response?.data?.message || "Create failed");
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await customerApi.remove(id);
      fetchCustomers();
    } catch {
      alert("Delete failed");
    }
  };

  const handleEditCustomer = (id) => setEditingId(id);

  const handleSaveCustomer = async (id) => {
    const customer = customers.find((c) => c._id === id);
    try {
      await customerApi.update(id, customer);
      alert("Updated successfully");
      setEditingId(null);
      setShowPasswords({});
      fetchCustomers();
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className="p-3">
      <h3 className="fw-bold mb-3">Customer Management</h3>

      <div className="table-responsive-md">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ width: 60 }}>#</th>
              <th>Username</th>
              <th style={{ width: 200 }}>Password</th>
              <th>Fullname</th>
              <th style={{ width: 140 }}>Phone</th>
              <th style={{ width: 220 }}>Email</th>
              <th>Address</th>
              <th style={{ width: 90 }} className="text-center">
                Unlock
              </th>
              <th style={{ width: 150 }} className="text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer, index) => (
              <tr key={customer.id}>
                <td className="text-center">{index + 1}</td>

                <td>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={customer.username || ""}
                    onChange={(e) => handleInputChange(e, customer._id)}
                    disabled={editingId !== customer._id}
                    autoComplete="off"
                  />
                </td>

                <td style={{ position: "relative" }}>
                  <input
                    type={showPasswords[customer._id] ? "text" : "password"}
                    name="password"
                    value={customer.password || ""}
                    onChange={(e) => handleInputChange(e, customer._id)}
                    disabled={editingId !== customer._id}
                    autoComplete="off"
                    className="form-control"
                    style={{ paddingRight: 36 }}
                  />
                  <span
                    onClick={() => togglePasswordVisibility(customer._id, editingId !== customer._id)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: editingId !== customer._id ? "not-allowed" : "pointer",
                      opacity: editingId !== customer._id ? 0.5 : 1,
                    }}
                  >
                    <i className={showPasswords[customer._id] ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"} />
                  </span>
                </td>

                <td>
                  <input
                    type="text"
                    className="form-control"
                    name="fullname"
                    value={customer.fullname || ""}
                    onChange={(e) => handleInputChange(e, customer._id)}
                    disabled={editingId !== customer._id}
                  />
                </td>

                <td>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={customer.phone || ""}
                    onChange={(e) => handleInputChange(e, customer._id)}
                    disabled={editingId !== customer._id}
                  />
                </td>

                <td>
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    value={customer.email || ""}
                    onChange={(e) => handleInputChange(e, customer._id)}
                    disabled={editingId !== customer._id}
                  />
                </td>

                <td>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={customer.address || ""}
                    onChange={(e) => handleInputChange(e, customer._id)}
                    disabled={editingId !== customer._id}
                  />
                </td>

                <td className="text-center">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={!!customer.locked}
                    onChange={(e) => handleCheckboxChange(e, customer._id)}
                    disabled={editingId !== customer._id}
                  />
                </td>

                <td className="text-center">
                  {editingId === customer._id ? (
                    <button
                      onClick={() => handleSaveCustomer(customer._id)}
                      className="btn btn-info btn-sm text-white px-2 py-0 rounded"
                      disabled={!hasPermission("update")}
                    >
                      Save
                    </button>
                  ) : (
                    hasPermission("update") && (
                      <button
                        onClick={() => handleEditCustomer(customer._id)}
                        className="btn btn-warning btn-sm text-white px-2 py-0 rounded"
                      >
                        Edit
                      </button>
                    )
                  )}

                  {hasPermission("delete") && (
                    <button
                      onClick={() => handleDeleteCustomer(customer._id)}
                      className="btn btn-danger btn-sm text-white px-2 py-0 rounded ms-2"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {/* New row */}
            <tr>
              <td className="text-center fw-bold">New</td>
              <td>
                <input className="form-control" name="username" value={newCustomer.username} onChange={handleNewUserChange} />
              </td>
              <td style={{ position: "relative" }}>
                <input
                  className="form-control"
                  type={showPasswords.new ? "text" : "password"}
                  name="password"
                  value={newCustomer.password}
                  onChange={handleNewUserChange}
                  style={{ paddingRight: 36 }}
                />
                <span
                  onClick={() => togglePasswordVisibility("new", false)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
                >
                  <i className={showPasswords.new ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"} />
                </span>
              </td>
              <td>
                <input className="form-control" name="fullname" value={newCustomer.fullname} onChange={handleNewUserChange} />
              </td>
              <td>
                <input className="form-control" name="phone" value={newCustomer.phone} onChange={handleNewUserChange} />
              </td>
              <td>
                <input className="form-control" name="email" value={newCustomer.email} onChange={handleNewUserChange} />
              </td>
              <td>
                <input className="form-control" name="address" value={newCustomer.address} onChange={handleNewUserChange} />
              </td>
              <td className="text-center">
                <input className="form-check-input" type="checkbox" name="locked" checked={newCustomer.locked} onChange={handleNewUserChange} />
              </td>
              <td className="text-center">
                {hasPermission("create") && (
                  <button onClick={handleAddCustomer} className="btn btn-primary text-white px-2 py-0 rounded">
                    Add
                  </button>
                )}
              </td>
            </tr>

            {customers.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center text-muted py-4">
                  No customers.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}