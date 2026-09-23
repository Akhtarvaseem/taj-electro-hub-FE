export default function Ticker({ maxOff = 0 }) {
  const off = maxOff > 0 ? `Up to ${maxOff}% OFF` : "Live deals on electronics";
  const msg = `⚡ ${off} on TajElectroHub  ·  💵 Cash on Delivery  ·  🚚 Free delivery above ₹500  ·  ↩️ 7-day replacement  ·  Genuine Taj Electric products  ·  `;
  return (
    <div className="ticker">
      <div className="ticker-track">
        <span>{msg}</span>
        <span>{msg}</span>
      </div>
    </div>
  );
}
