// frontend/src/components/Auth/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthShell from "./AuthShell";
import authApi from "../../api/authApi";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    if (!username.trim()) return "Username is required";
    if (!email.trim()) return "Email is required";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (confirmPassword !== password) return "Passwords do not match";
    if (!agree) return "You must agree to Terms & Conditions";
    return "";
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) return alert(msg);

    setLoading(true);
    try {
      await authApi.register({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      alert("Register success! Please sign in.");
      navigate("/signin");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign up"
      subtitle="Tạo tài khoản mới để mua hàng."
      icon="bi bi-person-plus"
      bottomText="Đã có tài khoản?"
      bottomLinkText="Sign in"
      bottomLinkTo="/signin"
    >
      <form onSubmit={handleSignUp}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Username</label>
          <input
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="VD: testcus"
            autoComplete="off"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <input
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="VD: testcus@gmail.com"
            autoComplete="off"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Password</label>
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ít nhất 6 ký tự"
            autoComplete="off"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Confirm Password</label>
          <input
            className="form-control"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu"
            autoComplete="off"
            required
          />
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="agreeTerms"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="agreeTerms">
            I agree to Terms & Conditions
          </label>
        </div>

        <button className="btn btn-primary text-white w-100 py-2 fw-bold" disabled={loading}>
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>
    </AuthShell>
  );
}