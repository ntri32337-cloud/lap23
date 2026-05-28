// src/components/Auth/Signin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthShell from "./AuthShell";
import authApi from "../../api/authApi";
import { useAuth } from "./AuthProvider";

export default function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login({ username, password });

      if (res.data?.status === false) {
        alert(res.data.message);
        return;
      }

      // ✅ lưu user + token
      login(res.data.user, res.data.token);

      const role = String(res.data.user?.role || "").toLowerCase();
      if (role === "customer") navigate("/");
      else navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Sai tài khoản hoặc mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign in"
      subtitle="Đăng nhập để tiếp tục mua hàng hoặc vào Dashboard."
      icon="bi bi-box-arrow-in-right"
      bottomText="Chưa có tài khoản?"
      bottomLinkText="Sign up"
      bottomLinkTo="/signup"
    >
      <form onSubmit={handleSignin}>
        {/* Username */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Username</label>
          <input
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="VD: testcus / admin / emp01..."
            autoComplete="off"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Password</label>
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            autoComplete="off"
            required
          />
        </div>

        <button
          className="btn btn-primary text-white w-100 py-2 fw-bold"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}