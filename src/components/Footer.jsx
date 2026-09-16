export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <h4>About</h4>
          <ul><li>Contact Us</li><li>About Us</li><li>Careers</li></ul>
        </div>
        <div>
          <h4>Help</h4>
          <ul><li>Payments</li><li>Shipping</li><li>Returns</li><li>FAQ</li></ul>
        </div>
        <div>
          <h4>Policy</h4>
          <ul><li>Terms Of Use</li><li>Security</li><li>Privacy</li></ul>
        </div>
        <div>
          <h4>Social</h4>
          <ul><li>Facebook</li><li>Instagram</li><li>YouTube</li></ul>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} ElectroHub · Taj Electric &amp; Electronics · All rights reserved
      </div>
    </footer>
  );
}
