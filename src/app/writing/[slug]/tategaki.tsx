"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "tategaki";

export const Tategaki = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [isTategaki, setIsTategaki] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("tategaki")) {
      setIsTategaki(true);
    } else if (localStorage.getItem(STORAGE_KEY)) {
      window.history.replaceState(null, "", `${pathname}?tategaki`);
      setIsTategaki(true);
    }
  }, [pathname]);

  const toggle = () => {
    if (isTategaki) {
      localStorage.removeItem(STORAGE_KEY);
      window.history.replaceState(null, "", pathname);
      setIsTategaki(false);
    } else {
      localStorage.setItem(STORAGE_KEY, "1");
      window.history.replaceState(null, "", `${pathname}?tategaki`);
      setIsTategaki(true);
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <Link href="/writing">← Writing</Link>
        <a
          href={isTategaki ? pathname : `${pathname}?tategaki`}
          className="hidden md:inline"
          onClick={(e) => {
            e.preventDefault();
            toggle();
          }}
        >
          {isTategaki ? "lr-tb" : "tb-rl"}
        </a>
      </div>
      {isTategaki ? (
        <div className="tategaki mt-4 h-[calc(100dvh-10rem)] overflow-x-auto overflow-y-hidden [text-orientation:mixed] [writing-mode:vertical-rl]">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
};
