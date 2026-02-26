"use client";

import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

export const Tategaki = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams();
  const isTategaki = searchParams.has("tategaki");

  const contentRef = (node: HTMLDivElement | null) => {
    if (node) node.scrollLeft = 0;
  };

  if (!isTategaki) return children;

  return (
    <div
      ref={contentRef}
      data-tategaki
      className="group/tategaki h-[calc(100dvh-10rem)] max-w-full overflow-x-auto overflow-y-hidden leading-[1.8] [line-break:strict] [text-underline-position:left] wrap-anywhere [text-orientation:mixed] [writing-mode:vertical-rl]"
    >
      {children}
    </div>
  );
};
