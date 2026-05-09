export default function LeafWatermark() {
  return (
    <svg
      aria-hidden="true"
      className="absolute bottom-0 left-0 w-72 h-72 opacity-[0.13] pointer-events-none select-none"
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >  
      <path
        d="M20 280 C60 200, 180 160, 240 40 C180 80, 80 100, 20 280Z"
        fill="#6b7c6b"
      />
      <path
        d="M20 280 C80 240, 160 180, 240 40"
        stroke="#6b7c6b"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M130 160 C110 180, 80 200, 50 230"
        stroke="#6b7c6b"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}
