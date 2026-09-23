import { useState } from "react";
import { resolveImage, CDN } from "../utils/images";

export default function ProductImg({ src, title = "", alt = "", className = "", style }) {
  const [url, setUrl] = useState(() => resolveImage(src, title));
  return (
    <img
      src={url}
      alt={alt || title}
      className={className}
      style={style}
      onError={() => setUrl(CDN.led)}
    />
  );
}
