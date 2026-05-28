// src/components/Admin/UserEmployees.jsx
import { useMemo, useRef, useState, useEffect } from "react";
import { useAuth } from "../Auth/AuthProvider";
import employeeData from "../data/Employees";
import employeeApi from "../../api/employeeApi";

const EMPTY_AVATAR = "/images/avatar.jpg";

export default function UserEmployees({ users, setUsers, employees, setEmployees }) {
  const { hasPermission, currentUser } = useAuth();

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const res = await employeeApi.getAll();
        console.log("API Response:", res);

        // ✅ Fix: Kiểm tra data tồn tại trước khi map
        const data = res?.data?.employees || res?.data || employeeData || [];
        
        if (!Array.isArray(data)) {
          console.warn("Data is not an array:", data);
          return;
        }

        const usersData = data
          .filter(e => e) // ✅ Loại bỏ undefined/null
          .map((e) => ({
            id: e._id || e.id || `temp-${Date.now()}`,
            username: e.username || "",
            email: e.email || "",
            role: e.role || "user",
            locked: e.locked || false,
            permissions: e.permissions || ["view"],
          }));

        const employeesData = data
          .filter(e => e) // ✅ Loại bỏ undefined/null
          .map((e) => ({
            id: e._id || e.id || `temp-${Date.now()}`,
            image: e.image || EMPTY_AVATAR,
            fullname: e.fullname || "",
            email: e.email || "",
            phone: e.phone || "",
            address: e.address || "",
          }));

        console.log("Processed usersData:", usersData);
        console.log("Processed employeesData:", employeesData);

        setUsers(usersData);
        setEmployees(employeesData);

      } catch (error) {
        console.error("Load employees error:", error);
        // Fallback to employeeData nếu API lỗi
        const usersData = (employeeData || [])
          .filter(e => e)
          .map((e) => ({
            id: e._id || e.id || `temp-${Date.now()}`,
            username: e.username || "",
            email: e.email || "",
            role: e.role || "user",
            locked: e.locked || false,
            permissions: e.permissions || ["view"],
          }));

        const employeesData = (employeeData || [])
          .filter(e => e)
          .map((e) => ({
            id: e._id || e.id || `temp-${Date.now()}`,
            image: e.image || EMPTY_AVATAR,
            fullname: e.fullname || "",
            email: e.email || "",
            phone: e.phone || "",
            address: e.address || "",
          }));

        setUsers(usersData);
        setEmployees(employeesData);
      }
    };

    loadEmployees();
  }, [setUsers, setEmployees]);

  const canCreate = !!hasPermission("create");
  const canUpdate = !!hasPermission("update");
  const canDelete = !!hasPermission("delete");
  const canView = hasPermission("view") ?? true;

  const listUsers = useMemo(() => (users && Array.isArray(users) ? users : []), [users]);
  const listEmps = useMemo(() => (employees && Array.isArray(employees) ? employees : []), [employees]);

  const [editingId, setEditingId] = useState(null);
  const [newUser, setNewUser] = useState(null);
  const [newEmployee, setNewEmployee] = useState(null);

  const usernameRef = useRef(null);

  const findEmp = (id) => {
    if (!id || !listEmps.length) return null;
    return listEmps.find((e) => String(e?.id) === String(id));
  };

  const handleAdd = () => {
    if (!canCreate) return;

    const newId = `new-${Date.now()}`;
    setNewUser({
      id: newId,
      image: EMPTY_AVATAR,
      username: "",
      password: "",
      email: "",
      role: "user",
      locked: false,
      permissions: ["view"],
    });

    setNewEmployee({
      id: newId,
      image: EMPTY_AVATAR,
      fullname: "",
      email: "",
      phone: "",
      address: "",
    });

    // Focus sau khi render
    setTimeout(() => usernameRef.current?.focus(), 0);
  };

  const handleEdit = (id) => {
    if (!canUpdate) return;
    setEditingId(id);
  };

  const handleCancel = () => {
    setNewUser(null);
    setNewEmployee(null);
    setEditingId(null);
  };

  const handleSave = async () => {
    // Save new user/employee
    if (newUser && newEmployee) {
      if (!newUser.username?.trim()) {
        alert("Username is required!");
        return;
      }

      try {
      const res = await employeeApi.create({
  user: newUser,
  employee: newEmployee,
});

const e = res?.data?.employee;
const u = res?.data?.user;

if (u?._id && e) {
  setUsers((prev) => [
    ...(prev || []),
    {
      id: u._id,
      username: u.username,
      email: u.email,
      role: u.role,
      locked: u.locked,
      permissions: u.permissions || [],
    },
  ]);

  setEmployees((prev) => [
    ...(prev || []),
    {
      id: u._id,
      image: e.image || EMPTY_AVATAR,
      fullname: e.fullname || "",
      email: u.email || "",
      phone: e.phone || "",
      address: e.address || "",
    },
  ]);
}

        handleCancel();
      } catch (error) {
        console.error("Create error:", error);
        alert("Create failed: " + (error.message || "Unknown error"));
      }
      return;
    }

    // Exit edit mode
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!canDelete || !id) return;

    if (!confirm("Are you sure to delete this employee?")) return;

    try {
      await employeeApi.remove(id);

      setUsers((prev) =>
        (prev || []).filter((u) => String(u?.id) !== String(id))
      );

      setEmployees((prev) =>
        (prev || []).filter((e) => String(e?.id) !== String(id))
      );
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete failed: " + (error.message || "Unknown error"));
    }
  };

  const handleChange = (e, id, isNew = false, isUser = false) => {
    const { name, value } = e.target;

    if (isNew) {
      if (isUser) {
        setNewUser((prev) => ({ ...prev, [name]: value }));
      } else {
        setNewEmployee((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    if (!canUpdate || !id) return;

    if (isUser) {
      setUsers((prev) =>
        (prev || []).map((u) =>
          String(u?.id) === String(id) ? { ...u, [name]: value } : u
        )
      );
    } else {
      setEmployees((prev) =>
        (prev || []).map((emp) =>
          String(emp?.id) === String(id) ? { ...emp, [name]: value } : emp
        )
      );
    }
  };

  const handleImageChange = (e, id, isNew = false) => {
    if (!canUpdate && !isNew) return;
    if (!canCreate && isNew) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (isNew) {
        setNewEmployee((prev) => ({ ...prev, image: dataUrl }));
      } else {
        setEmployees((prev) =>
          (prev || []).map((emp) =>
            String(emp?.id) === String(id) ? { ...emp, image: dataUrl } : emp
          )
        );
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleImageClick = (id) => {
    const input = document.getElementById(`file-input-${id}`);
    input?.click();
  };

  if (!canView) {
    return (
      <div className="p-3">
        <div className="alert alert-warning">Bạn không có quyền xem dữ liệu.</div>
      </div>
    );
  }

  return (
    <div className="p-3">
      <h3 className="fw-bold mb-3">Employee Management</h3>

      {!canUpdate && (
        <div className="alert alert-info">
          Bạn đang ở chế độ <b>View only</b> (không có quyền update).
        </div>
      )}

      {canCreate && (
        <button
          className="btn btn-primary text-white mb-3"
          onClick={handleAdd}
          disabled={!!editingId || !!newUser}
        >
          ➕ Add New
        </button>
      )}

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ width: 80 }}>ID</th>
              <th style={{ width: 90 }}>Image</th>
              <th style={{ width: 160 }}>Username</th>
              <th>Fullname</th>
              <th>Email</th>
              <th style={{ width: 140 }}>Phone</th>
              <th>Address</th>
              <th style={{ width: 180 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {/* New row */}
            {newUser && newEmployee && (
              <tr className="table-info">
                <td>{newUser.id}</td>
                <td className="text-center">
                  <input
                    id={`file-input-${newEmployee.id}`}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageChange(e, newEmployee.id, true)}
                  />
                  <img
                    src={newEmployee.image || EMPTY_AVATAR}
                    alt="Preview"
                    width="44"
                    height="44"
                    className="rounded-circle object-fit-cover"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleImageClick(newEmployee.id)}
                    onError={(ev) => (ev.currentTarget.src = EMPTY_AVATAR)}
                  />
                </td>
                <td>
                  <input
                    ref={usernameRef}
                    name="username"
                    className="form-control form-control-sm"
                    value={newUser.username || ""}
                    onChange={(e) => handleChange(e, newUser.id, true, true)}
                    placeholder="Enter username"
                  />
                </td>
                <td>
                  <input
                    name="fullname"
                    className="form-control form-control-sm"
                    value={newEmployee.fullname || ""}
                    onChange={(e) => handleChange(e, newEmployee.id, true, false)}
                    placeholder="Enter fullname"
                  />
                </td>
                <td>
                  <input
  name="email"
  type="email"
  className="form-control form-control-sm"
  value={newUser.email || ""}
  onChange={(e) => handleChange(e, newUser.id, true, true)}
/>
                </td>
                <td>
                  <input
                    name="phone"
                    className="form-control form-control-sm"
                    value={newEmployee.phone || ""}
                    onChange={(e) => handleChange(e, newEmployee.id, true, false)}
                    placeholder="Phone number"
                  />
                </td>
                <td>
                  <input
                    name="address"
                    className="form-control form-control-sm"
                    value={newEmployee.address || ""}
                    onChange={(e) => handleChange(e, newEmployee.id, true, false)}
                    placeholder="Address"
                  />
                </td>
                <td className="d-flex gap-1">
                  <button className="btn btn-success btn-sm" onClick={handleSave}>
                    💾 Save
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
                    ❌ Cancel
                  </button>
                </td>
              </tr>
            )}

            {/* Existing rows */}
            {listUsers.map((u) => {
              const emp = findEmp(u.id);
              const isEditing = String(editingId) === String(u.id);

              return (
                <tr key={String(u.id)} className={isEditing ? "table-warning" : ""}>
                  <td>{u.id}</td>
                  <td className="text-center">
                    {isEditing ? (
                      <>
                        <input
                          id={`file-input-${u.id}`}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handleImageChange(e, u.id, false)}
                        />
                        <img
                          src={emp?.image || EMPTY_AVATAR}
                          alt="Avatar"
                          width="44"
                          height="44"
                          className="rounded-circle object-fit-cover"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleImageClick(u.id)}
                          onError={(ev) => (ev.currentTarget.src = EMPTY_AVATAR)}
                        />
                      </>
                    ) : (
                      <img
                        src={emp?.image || EMPTY_AVATAR}
                        alt="Avatar"
                        width="44"
                        height="44"
                        className="rounded-circle object-fit-cover"
                        onError={(ev) => (ev.currentTarget.src = EMPTY_AVATAR)}
                      />
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        name="username"
                        className="form-control form-control-sm"
                        value={u.username || ""}
                        onChange={(e) => handleChange(e, u.id, false, true)}
                      />
                    ) : (
                      <strong>{u.username || "N/A"}</strong>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        name="fullname"
                        className="form-control form-control-sm"
                        value={emp?.fullname || ""}
                        onChange={(e) => handleChange(e, u.id, false, false)}
                      />
                    ) : (
                      emp?.fullname || "N/A"
                    )}
                  </td>
                  <td>{isEditing ? (
                    <input
                      name="email"
                      type="email"
                      className="form-control form-control-sm"
                      value={emp?.email || ""}
                      onChange={(e) => handleChange(e, u.id, false, false)}
                    />
                  ) : (
                    emp?.email || "N/A"
                  )}</td>
                  <td>{isEditing ? (
                    <input
                      name="phone"
                      className="form-control form-control-sm"
                      value={emp?.phone || ""}
                      onChange={(e) => handleChange(e, u.id, false, false)}
                    />
                  ) : (
                    emp?.phone || "N/A"
                  )}</td>
                  <td>{isEditing ? (
                    <input
                      name="address"
                      className="form-control form-control-sm"
                      value={emp?.address || ""}
                      onChange={(e) => handleChange(e, u.id, false, false)}
                    />
                  ) : (
                    emp?.address || "N/A"
                  )}</td>
                  <td className="d-flex gap-1">
                    {isEditing ? (
                      <>
                        <button className="btn btn-success btn-sm" onClick={handleSave}>
                          💾 Save
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
                          ❌ Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        {canUpdate && (
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleEdit(u.id)}
                            disabled={!!newUser}
                          >
                            ✏️ Edit
                          </button>
                        )}
                        {canDelete && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(u.id)}
                            disabled={!!newUser}
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
            })}

            {listUsers.length === 0 && !newUser && (
              <tr>
                <td colSpan={8} className="text-center text-muted py-4">
                  📭 No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {listUsers.length > 0 && (
        <div className="small text-muted mt-2">
          Total: {listUsers.length} employees. 
          View-only users can see but cannot edit.
        </div>
      )}
    </div>
  );
}