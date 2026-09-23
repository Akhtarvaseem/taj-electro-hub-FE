import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="container">
      <div className="about-hero">
        <p style={{ opacity: 0.9 }}>Taj Electric &amp; Electronics</p>
        <h1 style={{ fontSize: 32, margin: "6px 0 10px" }}>About Us</h1>
        <p style={{ maxWidth: 640, opacity: 0.95 }}>
          Your neighbourhood electrical shop — now online.
        </p>
      </div>

      <div className="card mb">
        <h3 className="mb">Shop / Business name</h3>
        <p style={{ fontSize: 18, fontWeight: 700 }}>TajElectroHub</p>
        <p className="muted">Taj Electric &amp; Electronics</p>
      </div>

      <div className="card mb">
        <h3 className="mb">Who we are</h3>
        <p className="muted" style={{ lineHeight: 1.8 }}>
          TajElectroHub is the online store of Taj Electric &amp; Electronics.
          We supply genuine electrical goods for homes, shops and small sites —
          from house wiring to switches, MCBs, lights, fans and home appliances.
        </p>
      </div>

      <div className="card mb">
        <h3 className="mb">Products &amp; services</h3>
        <ul className="muted" style={{ lineHeight: 1.9, paddingLeft: 18 }}>
          <li>House wiring cables &amp; flexible copper wire</li>
          <li>Modular switches, sockets &amp; switchboards</li>
          <li>MCB, distribution boards &amp; protection</li>
          <li>LED bulbs, fans, extension boards</li>
          <li>Geysers and home appliances</li>
          <li>Selected furniture (beds, chairs)</li>
          <li>Cash on Delivery across serviceable pincodes</li>
        </ul>
      </div>

      <div className="grid grid-2 mb">
        <div className="card">
          <h3 className="mb">Location</h3>
          <p>Taj Electric &amp; Electronics</p>
          <p className="muted">India</p>
          <p className="muted mt">Visit us or order online for home delivery.</p>
        </div>
        <div className="card">
          <h3 className="mb">Business hours</h3>
          <p>Monday – Saturday: <b>9:00 AM – 8:00 PM</b></p>
          <p>Sunday: <b>10:00 AM – 4:00 PM</b></p>
          <p className="muted mt">Online orders accepted 24×7.</p>
        </div>
      </div>

      <div className="card mb">
        <h3 className="mb">Contact</h3>
        <p>📞 +91 98765 43210</p>
        <p>📧 support@tajelectric.com</p>
        <p>🌐 <Link to="/">taj-electro-hub-fe.vercel.app</Link></p>
      </div>

      <div className="card mb">
        <h3 className="mb">Our story</h3>
        <p className="muted" style={{ lineHeight: 1.8 }}>
          Taj Electric &amp; Electronics started as a local electrical shop serving
          families and electricians with trusted brands and honest advice.
          TajElectroHub is our next step — the same genuine products, now with
          easy online ordering and Cash on Delivery, so customers can shop from home
          without compromising on quality.
        </p>
      </div>

      <Link to="/products" className="btn btn-blue" style={{ display: "inline-block" }}>
        Shop now →
      </Link>
    </div>
  );
}
