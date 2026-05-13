"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
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
    <div className="relative flex flex-wrap items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-soft)] p-1.5 shadow-[inset_0_1px_0_var(--glass-highlight)]">
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
                ? "bg-[var(--accent-strong)] text-[var(--on-accent)] shadow-[0_16px_35px_-18px_var(--nav-shadow)]"
                : "text-[var(--text)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent-strong)]",
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
