/** TajElectroHub mark — gold bolt on navy shield. */
export default function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="tehGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5d76e" />
          <stop offset="100%" stopColor="#c9a227" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="12" fill="#0b2c4a" />
      <rect x="2" y="2" width="44" height="44" rx="12" fill="none" stroke="url(#tehGold)" strokeWidth="2.5" />
      <path d="M26.5 8 L14 26 h9 L18.5 40 L35 21 h-9 L26.5 8z" fill="url(#tehGold)" />
    </svg>
  );
}
