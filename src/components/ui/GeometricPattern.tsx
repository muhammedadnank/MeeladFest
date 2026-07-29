export function GeometricPattern({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 260 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <polygon
        points="130,10 250,75 250,185 130,250 10,185 10,75"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <polygon
        points="130,40 220,90 220,170 130,220 40,170 40,90"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
      />
      <polygon
        points="130,70 190,105 190,155 130,190 70,155 70,105"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
      />
      <circle cx="130" cy="130" r="60" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <circle cx="130" cy="130" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
    </svg>
  );
}
