import React from "react";
import Image from "next/image";

interface OliveBranchProps {
  className?: string;
  imageClassName?: string;
  flip?: boolean;
  variant?: 1 | 2 | 3 | 4 | "drape" | "cascade-left";
  alt?: string;
}

export function OliveBranchBotanical({
  className = "h-44 w-44 sm:h-60 sm:w-60",
  imageClassName = "",
  flip = false,
  variant = 1,
  alt = "Botanical Olive Branch Illustration",
}: OliveBranchProps) {
  let imageSrc = "/images/olive-branch-botanical-lively.png";
  if (variant === 2) {
    imageSrc = "/images/olive-branch-botanical-lively-2.png";
  } else if (variant === 3 || variant === "drape") {
    imageSrc = "/images/olive-branch-drape.png";
  } else if (variant === 4 || variant === "cascade-left") {
    imageSrc = "/images/olive-branch-cascade-left.png";
  }

  return (
    <div
      className={`relative select-none pointer-events-none transition-transform duration-700 ${flip ? "-scale-x-100" : ""
        } ${className}`}
      aria-hidden="true"
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes="(max-width: 640px) 180px, (max-width: 1024px) 280px, 420px"
        className={`object-contain transition-opacity duration-700 ${imageClassName}`}
        priority
      />
    </div>
  );
}
