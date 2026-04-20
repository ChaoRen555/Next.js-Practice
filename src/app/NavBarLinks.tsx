"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/issues", label: "Issues" },
];

const NavBarLinks = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="relative flex flex-wrap items-center gap-2 rounded-full border border-white/45 bg-white/35 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
      {navItems.map((item) => {
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full px-4 py-2.5 text-sm font-medium tracking-[0.02em] transition duration-300",
              active
                ? "bg-[#6d867d] text-white shadow-[0_16px_35px_-18px_rgba(95,121,113,0.55)]"
                : "text-[#41534f] hover:bg-white/70 hover:text-[#5f7971]",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};

export default NavBarLinks;
