
import { useMemo, useState } from "react";
import { useAuth } from "../Auth/AuthProvider";

export default function Users({ users, setUsers }) {
  const { currentUser, hasPermission } = useAuth();

  const canUpdate = hasPermission("update");
  const canDelete = hasPermission("delete"); // admin mới có
  const isAdmin = currentUser?.role === "admin";

  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    image: "",
    email: "",
    password: "",
    // admin-only:
    role: "",
    locked: false,
  });

  const list = useMemo(() => users ?? [], [users]);

  const saveUsersToStorage = (next) => {
    localStorage.setItem("user", JSON.stringify(next));
    setUsers(next);
  };

  const startEdit = (u) => {
    if (!canUpdate) return;

    // user thường chỉ sửa chính mình
    const isSelf = String(u.id) === String(currentUser?.id);
    if (!isAdmin && !isSelf) return;

    setEditId(u.id);
    setForm({
      image: u.image || "",
      email: u.email || "",
      password: u.password || "",
      role: u.role || "user",
      locked: !!u.locked,
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({ image: "", email: "", password: "", role: "", locked: false });
  };

  const handleUpdate = (id) => {
    if (!canUpdate) return;

    const target = list.find((u) => String(u.id) === String(id));
    if (!target) return;

    const isSelf = String(target.id) === String(currentUser?.id);
    if (!isAdmin && !isSelf) return;

    const next = list.map((u) => {
      if (String(u.id) !== String(id)) return u;

      // ✅ user thường: chỉ sửa email/password/image (không sửa role/locked)
      if (!isAdmin) {
        return {
          ...u,
          image: form.image?.trim() || u.image,
          email: form.email?.trim() || u.email,
          password: form.password || u.password,
        };
      }

      // ✅ admin: sửa toàn bộ (trừ id/username)
      return {
        ...u,
        image: form.image?.trim() || u.image,
        email: form.email?.trim() || u.email,
        password: form.password || u.password,
        role: form.role || u.role,
        locked: !!form.locked,
      };
    });

    saveUsersToStorage(next);
    cancelEdit();
  };

  const handleDelete = (id) => {
    if (!canDelete) return; // chỉ admin có delete theo permissions Lab15
    const next = list.filter((u) => String(u.id) !== String(id));
    saveUsersToStorage(next);
  };

  const toggleLock = (id) => {
    if (!isAdmin) return; // chỉ admin được lock/unlock
    const next = list.map((u) =>
      String(u.id) === String(id) ? { ...u, locked: !u.locked } : u
    );
    saveUsersToStorage(next);
  };

  return (
    <div className="p-3">
      <h3 className="fw-bold mb-3">Users</h3>

      <div className="table-responsive">
        <table className="table table-hover align-middle table-bordered">
          <thead className="table-light">
            <tr>
              <th style={{ width: 90 }}>Avatar</th>
              <th style={{ width: 140 }}>Username</th>
              <th>Email</th>
              <th style={{ width: 120 }}>Role</th>
              <th style={{ width: 120 }}>Status</th>
              <th style={{ width: 220 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {list.map((u) => {
              const isEditing = String(editId) === String(u.id);
              const isSelf = String(u.id) === String(currentUser?.id);

              // user thường chỉ được sửa bản thân
              const canEditRow = canUpdate && (isAdmin || isSelf);

              return (
                <tr key={u.id}>
                  {/* Avatar */}
                  <td className="text-center">
                    {isEditing ? (
                      <input
                        className="form-control form-control-sm"
                        placeholder="Image URL"
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                      />
                    ) : (
                      <img
                        src={u.image || "/images/avatar.jpg"}
                        alt="avatar"
                        width="48"
                        height="48"
                        style={{
                          objectFit: "cover",
                          borderRadius: "50%",
                          border: "1px solid rgba(0,0,0,.1)",
                        }}
                        onError={(e) => (e.currentTarget.src = "/images/avatar.jpg")}
                      />
                    )}
                  </td>

                  {/* Username */}
                  <td>
                    <span className="fw-bold">{u.username}</span>
                    {isSelf && (
                      <span className="badge bg-success ms-2">You</span>
                    )}
                  </td>

                  {/* Email */}
                  <td>
                    {isEditing ? (
                      <input
                        className="form-control form-control-sm"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    ) : (
                      <span className="text-muted">{u.email}</span>
                    )}
                  </td>

                  {/* Role */}
                  <td>
                    {isEditing ? (
                      isAdmin ? (
                        <select
                          className="form-select form-select-sm"
                          value={form.role}
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
                        >
                          <option value="admin">admin</option>
                          <option value="user">user</option>
                          <option value="customer">customer</option>
                        </select>
                      ) : (
                        <span className="badge bg-secondary">{u.role}</span>
                      )
                    ) : (
                      <span className={`badge ${u.role === "admin" ? "bg-danger" : u.role === "user" ? "bg-primary" : "bg-secondary"}`}>
                        {u.role}
                      </span>
                    )}
                  </td>

                  {/* Locked */}
                  <td>
                    {isEditing ? (
                      isAdmin ? (
                        <select
                          className="form-select form-select-sm"
                          value={form.locked ? "locked" : "active"}
                          onChange={(e) =>
                            setForm({ ...form, locked: e.target.value === "locked" })
                          }
                        >
                          <option value="active">Active</option>
                          <option value="locked">Locked</option>
                        </select>
                      ) : (
                        <span className={`badge ${u.locked ? "bg-dark" : "bg-success"}`}>
                          {u.locked ? "Locked" : "Active"}
                        </span>
                      )
                    ) : (
                      <span className={`badge ${u.locked ? "bg-dark" : "bg-success"}`}>
                        {u.locked ? "Locked" : "Active"}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td>
                    {isEditing ? (
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-info btn-sm text-white"
                          onClick={() => handleUpdate(u.id)}
                          disabled={!canEditRow}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex gap-2 flex-wrap">
                        {canEditRow && (
                          <button
                            type="button"
                            className="btn btn-warning btn-sm text-white"
                            onClick={() => startEdit(u)}
                          >
                            Edit
                          </button>
                        )}

                        {/* Lock/Unlock chỉ admin */}
                        {isAdmin && (
                          <button
                            type="button"
                            className={`btn btn-sm ${u.locked ? "btn-success" : "btn-dark"}`}
                            onClick={() => toggleLock(u.id)}
                          >
                            {u.locked ? "Unlock" : "Lock"}
                          </button>
                        )}

                        {/* Delete chỉ admin (permission delete) */}
                        {canDelete && (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm text-white"
                            onClick={() => handleDelete(u.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {list.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4">
                  No users.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="small text-muted mt-2">
        Lab15 permissions: admin có create/update/delete/view;
        <br />
        Chức năng Lock/Unlock chỉ admin để phù hợp kiểm tra `locked` khi Signin.
      </div>
    </div>
  );
}
