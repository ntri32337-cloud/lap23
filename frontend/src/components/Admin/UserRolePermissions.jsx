// frontend/src/components/Admin/UserRolePermissions.jsx
import { useEffect, useState } from "react";
import userApi from "../../api/userApi";
import { useAuth } from "../Auth/AuthProvider";

const ALL_PERMS = ["create", "update", "delete", "view"];
const ROLES = ["admin", "manager", "user", "customer"];

export default function UserRolePermissions() {
  const { hasPermission } = useAuth();
  const canUpdate = !!hasPermission("update");
  const canDelete = !!hasPermission("delete");

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await userApi.getUsersPermission();
      console.log("Lấy user permissions:", res.data);
      setUsers(res.data || []);
    } catch (error) {
      console.error("Lỗi lấy user permissions:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ update field (username / role)
  const handleInputChange = async (id, field, value) => {
    if (!canUpdate) return;

    // optimistic UI
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, [field]: value } : u)));

    try {
      const res = await userApi.update(id, { [field]: value });
      alert(res.data.message || "Updated");
      fetchUsers();
    } catch (error) {
      console.error("Lỗi cập nhật user:", error);
      fetchUsers();
    }
  };

  // ✅ toggle permission
  const handlePermissionChange = async (id, perm) => {
    if (!canUpdate) return;

    const current = users.find((u) => u._id === id);
    if (!current) return;

    const curPerms = current.permissions || [];
    const newPermissions = curPerms.includes(perm)
      ? curPerms.filter((p) => p !== perm)
      : [...curPerms, perm];

    // optimistic UI
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, permissions: newPermissions } : u))
    );

    try {
      const res = await userApi.update(id, { permissions: newPermissions });
      alert(res.data.message || "Updated permissions");
    } catch (error) {
      console.error("Lỗi cập nhật permissions:", error);
      fetchUsers();
    }
  };

  // ✅ delete user
  const handleDeleteUser = async (id) => {
    if (!canDelete) return;
    if (!window.confirm("Do you want to delete this user?")) return;

    try {
      const res = await userApi.remove(id);
      if (res.data.status) alert(res.data.message);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Xóa thất bại");
    }
  };

  return (
    <div className="p-3">
      <h3 className="fw-bold mb-3">Manager User Role Permissions</h3>

      {!canUpdate && (
        <div className="alert alert-info">
          Bạn đang ở chế độ <b>View only</b> (không có quyền update).
        </div>
      )}

      <div className="table-responsive-md">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ width: 60 }}>#</th>
              <th>Fullname</th>
              <th>User name</th>
              <th style={{ width: 160 }}>Role</th>
              <th>Permission</th>
              <th style={{ width: 110 }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((us, index) => (
              <tr key={us._id}>
                <td className="text-center">{index + 1}</td>
                <td>{us.fullname}</td>

                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={us.username || ""}
                    disabled={!canUpdate}
                    onChange={(e) => handleInputChange(us._id, "username", e.target.value)}
                  />
                </td>

                <td>
                  <select
                    className="form-select"
                    value={us.role || ""}
                    disabled={!canUpdate}
                    onChange={(e) => handleInputChange(us._id, "role", e.target.value)}
                  >
                    <option value="">Role</option>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <div className="d-flex flex-wrap gap-3">
                    {ALL_PERMS.map((p) => (
                      <label key={p} className="d-flex align-items-center gap-2 m-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={(us.permissions || []).includes(p)}
                          disabled={!canUpdate}
                          onChange={() => handlePermissionChange(us._id, p)}
                        />
                        <span>{p}</span>
                      </label>
                    ))}
                  </div>
                </td>

                <td className="text-center">
                  <button
                    className="btn btn-danger btn-sm"
                    disabled={!canDelete}
                    onClick={() => handleDeleteUser(us._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}