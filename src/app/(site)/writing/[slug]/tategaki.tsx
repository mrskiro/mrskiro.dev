"use client";

import type { ReactNode } from "react";

import { useSearchParams } from "next/navigation";

export const Tategaki = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams();
  const isTategaki = searchParams.has("tategaki");

  const contentRef = (node: HTMLDivElement | null) => {
    if (!node) return;
    node.scrollLeft = 0;
    const handler = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      node.scrollLeft -= e.deltaY;
    };
    node.addEventListener("wheel", handler, { passive: false });
    return () => node.removeEventListener("wheel", handler);
  };

  if (!isTategaki) return children;

  return (
    <div
      ref={contentRef}
      data-tategaki
      className="group/tategaki h-[calc(100dvh-10rem)] max-w-full overflow-x-auto overflow-y-hidden leading-[1.8] wrap-anywhere [line-break:strict] [text-orientation:mixed] [text-underline-position:left] [writing-mode:vertical-rl]"
    >
      {children}
    </div>
  );
};
