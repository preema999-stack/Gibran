import React from "react";
import Image from "next/image";

interface OliveBranchProps {
  className?: string;
  flip?: boolean;
  variant?: 1 | 2;
  alt?: string;
}

export function OliveBranchBotanical({
  className = "h-44 w-44 sm:h-60 sm:w-60",
  flip = false,
  variant = 1,
  alt = "Botanical Olive Branch Illustration",
}: OliveBranchProps) {
  const imageSrc =
    variant === 2
      ? "/images/olive-branch-botanical-lively-2.png"
      : "/images/olive-branch-botanical-lively.png";

  return (
    <div
      className={`relative select-none pointer-events-none transition-transform duration-700 ${
        flip ? "-scale-x-100" : ""
      } ${className}`}
      aria-hidden="true"
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes="(max-width: 640px) 180px, (max-width: 1024px) 280px, 420px"
        className="object-contain filter drop-shadow-[0_16px_36px_rgba(0,0,0,0.55)]"
        priority
      />
    </div>
  );
}
