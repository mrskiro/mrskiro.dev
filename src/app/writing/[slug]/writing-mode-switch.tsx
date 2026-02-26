"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const WritingModeSwitch = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isTategaki = searchParams.has("tategaki");

  return (
    <a
      href={isTategaki ? pathname : `${pathname}?tategaki`}
      className="hidden md:inline"
      onClick={(e) => {
        e.preventDefault();
        router.replace(isTategaki ? pathname : `${pathname}?tategaki`);
      }}
    >
      {isTategaki ? "lr-tb" : "tb-rl"}
    </a>
  );
};
