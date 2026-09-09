"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

export function Logo({
  size = "md",
  className = "",
  showText = true,
}: LogoProps) {
  const iconSize = size === "sm" ? 22 : size === "lg" ? 34 : 26;

  return (
    <div className={`flex items-center gap-2.5 font-semibold select-none ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <rect width="128" height="128" rx="28" fill="#0f1117" />
        <rect
          x="2"
          y="2"
          width="124"
          height="124"
          rx="26"
          fill="none"
          stroke="#262a36"
          strokeWidth="3"
        />
        {/* Top face */}
        <polygon
          points="64,22 102,44 64,66 26,44"
          fill="#6366f1"
          stroke="#818cf8"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Right face */}
        <polygon
          points="64,66 102,44 102,88 64,110"
          fill="#4338ca"
          stroke="#6366f1"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Left face */}
        <polygon
          points="64,66 26,44 26,88 64,110"
          fill="#312e81"
          stroke="#4f46e5"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Wireframe axes */}
        <line
          x1="64"
          y1="66"
          x2="64"
          y2="40"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="64"
          y1="66"
          x2="84"
          y2="78"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="64"
          y1="66"
          x2="44"
          y2="78"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Vertex nodes */}
        <circle cx="64" cy="22" r="4.5" fill="#ffffff" />
        <circle cx="102" cy="44" r="4" fill="#a5b4fc" />
        <circle cx="26" cy="44" r="4" fill="#a5b4fc" />
        <circle cx="64" cy="66" r="5" fill="#ffffff" />
        <circle cx="102" cy="88" r="4" fill="#a5b4fc" />
        <circle cx="26" cy="88" r="4" fill="#a5b4fc" />
        <circle cx="64" cy="110" r="4.5" fill="#818cf8" />
      </svg>
      {showText && (
        <span className="tracking-tight text-[#f8fafc] text-base font-semibold">
          3D Viewre
        </span>
      )}
    </div>
  );
}
