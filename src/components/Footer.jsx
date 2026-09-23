import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <h4>About the shop</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/about">Contact &amp; hours</Link></li>
            <li>Location</li>
          </ul>
        </div>
        <div>
          <h4>Help</h4>
          <ul>
            <li>Payments (COD)</li>
            <li>Shipping</li>
            <li>Returns</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div>
          <h4>Policy</h4>
          <ul>
            <li>Terms Of Use</li>
            <li>Security</li>
            <li>Privacy</li>
          </ul>
        </div>
        <div>
          <h4>App information</h4>
          <ul>
            <li><Link to="/developer">Developed by</Link></li>
            <li>App version 1.0.0</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} TajElectroHub · Taj Electric &amp; Electronics
      </div>
    </footer>
  );
}
