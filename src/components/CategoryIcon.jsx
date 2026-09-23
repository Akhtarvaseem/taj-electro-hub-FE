/** Renders a category icon as an image (if URL) or as emoji/text. */
export default function CategoryIcon({ icon, size = 28, className = "" }) {
  const src = (icon || "").trim();
  const isUrl = /^https?:\/\//i.test(src) || src.startsWith("data:image");
  if (isUrl) {
    return (
      <img
        src={src}
        alt=""
        className={className}
        style={{ width: size, height: size, objectFit: "contain", borderRadius: 8 }}
      />
    );
  }
  return (
    <span className={className} style={{ fontSize: size * 0.72, lineHeight: 1 }}>
      {src || "📦"}
    </span>
  );
}
