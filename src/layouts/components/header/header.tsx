"use client";

import { usePathname } from "next/navigation";
import { AppLink } from "@/components/app-link";
import { SROnly } from "@/components/sr-only";

const lists = [
  {
    name: "Posts",
    href: "/",
  },
  {
    name: "About",
    href: "/about",
  },
];

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="flex flex-col gap-0.5">
      <h1 className="text-xl">
        <AppLink href="/">
          🟣
          <SROnly label="ホーム" />
        </AppLink>
      </h1>
      <nav aria-label="グローバルナビゲーション">
        <ul className="flex flex-col gap-2">
          {lists.map((v) => (
            <li key={v.name}>
              <AppLink href={v.href} isActive={pathname === v.href}>
                {v.name}
              </AppLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
