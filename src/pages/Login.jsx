import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../api/services";
import { useStore } from "../store/StoreContext";

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

  return (
    <div className="container flex" style={{ maxWidth: 800 }}>
      <div style={{ width: "40%", background: "#2874f0", color: "#fff", padding: 32, borderRadius: "8px 0 0 8px" }}>
        <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
        <p style={{ opacity: .8, marginTop: 10 }}>Access your ElectroHub orders, wishlist &amp; more.</p>
        <div style={{ marginTop: 40, fontSize: 40 }}>⚡ ElectroHub</div>
        <div style={{ fontSize: 12, opacity: .7 }}>Taj Electric &amp; Electronics</div>
      </div>
      <div className="card" style={{ flex: 1, borderRadius: "0 8px 8px 0" }}>
        <form onSubmit={submit}>
          {mode === "register" && <input className="input" placeholder="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
          <input className="input" type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {mode === "register" && <input className="input" placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />}
          <input className="input" type="password" placeholder="Password (min 6)" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <p style={{ color: "#d32f2f" }}>{error}</p>}
          <button className="btn btn-orange" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Please wait…" : mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>
        <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
          style={{ border: 0, background: "none", color: "#2874f0", fontWeight: 600, marginTop: 16, cursor: "pointer", width: "100%" }}>
          {mode === "login" ? "New here? Create an account" : "Existing user? Log in"}
        </button>
        <div className="card mt" style={{ background: "#f7f7f7", fontSize: 12 }}>
          <b>Demo admin:</b> admin@shop.com / admin123
        </div>
      </div>
    </div>
  );
}
