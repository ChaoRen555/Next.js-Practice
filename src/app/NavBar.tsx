import Link from "next/link";
import { revalidatePath } from "next/cache";
import { auth, signOut } from "@/auth";
import NavBarLinks from "./NavBarLinks";

const NavBar = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="px-4 pt-4 sm:px-6">
      <nav className="relative mx-auto flex w-full max-w-6xl flex-col gap-4 overflow-hidden rounded-[28px] border border-white/65 bg-white/50 px-5 py-4 shadow-[0_24px_70px_-34px_rgba(95,121,113,0.35)] backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-10 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-[#d8e5dd]/55 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 top-0 h-24 w-24 rounded-full bg-[#d5e0e7]/55 blur-3xl"
        />

        <Link
          href="/"
          className="relative flex items-center gap-3 rounded-full border border-white/45 bg-white/40 px-3 py-2 transition duration-300 hover:border-white/70 hover:bg-white/55"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#6d867d,#89a097_55%,#cbd9d4)] text-sm font-semibold uppercase tracking-[0.24em] text-white shadow-[0_12px_30px_-16px_rgba(95,121,113,0.65)]">
            NP
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-[#5f7971]">
              Next Project
            </span>
            <span className="text-sm text-[#6f817d]">
              Build faster with a cleaner workflow
            </span>
          </span>
        </Link>

        <div className="relative flex flex-wrap items-center justify-end gap-3">
          <NavBarLinks />

          {user ? (
            <div className="flex flex-wrap items-center justify-end gap-3 rounded-full border border-white/45 bg-white/35 px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
              <div className="px-3 text-right">
                <p className="text-sm font-semibold text-[#31403d]">
                  {user.name ?? "Signed in"}
                </p>
                {user.email ? (
                  <p className="text-xs text-[#6f817d]">
                    {user.email}
                  </p>
                ) : null}
              </div>
              <form
                action={async () => {
                  "use server";
                  revalidatePath("/issues", "layout");
                  revalidatePath("/", "layout");
                  await signOut({
                    redirectTo: "/",
                  });
                }}
              >
                <button
                  type="submit"
                  className="rounded-full border border-[#c9d6d0] bg-white/80 px-4 py-2 text-sm font-medium text-[#41534f] transition duration-300 hover:border-white hover:bg-white"
                >
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-white/55 bg-[#6d867d] px-5 py-2.5 text-sm font-medium text-white shadow-[0_16px_35px_-18px_rgba(95,121,113,0.55)] transition duration-300 hover:bg-[#5f7971]"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
