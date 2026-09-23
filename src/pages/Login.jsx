import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../api/services";
import { useStore } from "../store/StoreContext";
import Logo from "../components/Logo";

export default function Login() {
  const navigate = useNavigate();
  const { loginSuccess, toast } = useStore();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const data = mode === "login"
        ? await AuthAPI.login({ email: form.email, password: form.password })
        : await AuthAPI.register(form);
      loginSuccess(data);
      toast(mode === "login" ? "Welcome back!" : "Account created!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally { setLoading(false); }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="container login-wrap">
      <div className="login-side">
        <Logo size={56} />
        <h2 style={{ marginTop: 16 }}>{mode === "login" ? "Login" : "Sign Up"}</h2>
        <p style={{ opacity: .85, marginTop: 10 }}>
          Access your TajElectroHub orders, wishlist &amp; more.
        </p>
        <div style={{ marginTop: 28, fontWeight: 800, fontSize: 22 }}>TajElectroHub</div>
        <div style={{ fontSize: 12, opacity: .75 }}>Taj Electric &amp; Electronics</div>
      </div>
      <div className="card login-form">
        <form onSubmit={submit} autoComplete="on">
          {mode === "register" && (
            <input className="input" name="name" placeholder="Full Name" required value={form.name} onChange={set("name")} />
          )}
          <input className="input" name="email" type="email" autoComplete="email" placeholder="Email" required value={form.email} onChange={set("email")} />
          {mode === "register" && (
            <input className="input" name="phone" autoComplete="tel" placeholder="Phone (optional)" value={form.phone} onChange={set("phone")} />
          )}
          <input className="input" name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="Password (min 6)" required value={form.password} onChange={set("password")} />
          {error && <p style={{ color: "#d32f2f" }}>{error}</p>}
          <button type="submit" className="btn btn-orange" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Please wait…" : mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
          style={{ border: 0, background: "none", color: "var(--blue)", fontWeight: 600, marginTop: 16, cursor: "pointer", width: "100%" }}
        >
          {mode === "login" ? "New here? Create an account" : "Existing user? Log in"}
        </button>
      </div>
    </div>
  );
}
