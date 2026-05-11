import Link from "next/link";
import { auth } from "@/auth";
import ThemeToggle from "@/components/theme-toggle";
import NavBarLinks from "./NavBarLinks";
import UserMenu from "./UserMenu";

const NavBar = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="px-4 pt-4 sm:px-6">
      <nav className="relative mx-auto flex w-full max-w-6xl flex-col gap-4 overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--surface)] px-5 py-4 shadow-[0_24px_70px_-34px_var(--nav-shadow)] backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--glass-highlight)] to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-10 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-[var(--accent)] opacity-30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 top-0 h-24 w-24 rounded-full bg-[var(--accent-strong)] opacity-20 blur-3xl"
        />

        <Link
          href="/"
          className="relative flex items-center gap-3 rounded-full border border-[var(--line)] bg-[var(--surface-soft)] px-3 py-2 transition duration-300 hover:border-[var(--accent)] hover:bg-[var(--surface-hover)]"
        >
          <span className="app-brand-mark flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold uppercase tracking-[0.24em]">
            NP
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
              Next Project
            </span>
            <span className="text-sm text-[var(--muted)]">
              Build faster with a cleaner workflow
            </span>
          </span>
        </Link>

        <div className="relative flex flex-wrap items-center justify-end gap-3">
          <NavBarLinks />

          {user ? (
            <UserMenu
              name={user.name}
              email={user.email}
              image={user.image}
              role={user.role}
            />
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-[var(--line)] bg-[var(--accent-strong)] px-5 py-2.5 text-sm font-medium text-[var(--on-accent)] shadow-[0_16px_35px_-18px_var(--nav-shadow)] transition duration-300 hover:bg-[var(--accent)]"
            >
              Login
            </Link>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
