export default function CameraIcon() {
  return (
    <div className="w-24 h-24 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-lg mb-6 cursor-pointer hover:bg-[#2a2a2a] transition-colors duration-200">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="4" y="13" width="32" height="22" rx="3" fill="white" />
        <circle cx="20" cy="24" r="7" fill="#1a1a1a" />
        <circle cx="20" cy="24" r="4" fill="white" />
        <path d="M14 13 L16 8 H24 L26 13" fill="white" />
        <circle cx="31" cy="17" r="2" fill="#1a1a1a" />
      </svg>
    </div>
  );
}
