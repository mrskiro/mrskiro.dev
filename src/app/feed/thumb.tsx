"use client";

import { useState } from "react";

// Neutral box that stays visible when the image is missing or fails to load
export const Thumb = ({ src }: { src: string | null }) => {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className="h-14 w-20 overflow-hidden rounded-sm bg-neutral-100 md:h-16 md:w-24"
      aria-hidden="true"
    >
      {src && !failed && (
        <img
          src={src}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
};
