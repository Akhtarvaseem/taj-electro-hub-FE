import { Link } from "react-router-dom";
import Logo from "../components/Logo";

export default function Developer() {
  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <div className="about-hero">
        <Logo size={48} />
        <h1 style={{ fontSize: 28, margin: "12px 0 6px" }}>App Information</h1>
        <p style={{ opacity: 0.9 }}>Technical details of this website</p>
      </div>

      <div className="card mb">
        <h3 className="mb">App information</h3>
        <table className="info-table">
          <tbody>
            <tr>
              <td>App name</td>
              <td><b>TajElectroHub</b></td>
            </tr>
            <tr>
              <td>Developed by</td>
              <td><b>Ravi Kumar</b></td>
            </tr>
            <tr>
              <td>App version</td>
              <td><b>1.0.0</b></td>
            </tr>
            <tr>
              <td>Platform</td>
              <td>Web (React + Spring Boot 17)</td>
            </tr>
            <tr>
              <td>Database</td>
              <td>PostgreSQL</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="muted mb">
        Developer credit is listed here only. Shop details are on the{" "}
        <Link to="/about">About Us</Link> page.
      </p>
      <Link to="/" className="btn btn-blue" style={{ display: "inline-block" }}>
        Back to shop →
      </Link>
    </div>
  );
}
