"use client";

import { outfit } from "@/lib/fonts";

export function Logo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Background shape */}
        <rect
          x="2"
          y="2"
          width="52"
          height="52"
          rx="14"
          className="fill-primary"
        />
        {/* Stylized "4" */}
        <text
          x="28"
          y="39"
          textAnchor="middle"
          className="fill-primary-foreground"
          fontFamily="Outfit, sans-serif"
          fontWeight="700"
          fontSize="28"
        >
          4M
        </text>
      </svg>
      <span
        className={`${outfit.className} text-3xl font-bold tracking-tight text-foreground`}
      >
        <span className="text-primary">4</span>Market
      </span>
    </div>
  );
}
