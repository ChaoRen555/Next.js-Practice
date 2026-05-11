import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";
import PasswordInput from "@/components/password-input";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { credentialsRegisterSchema } from "@/lib/validationSchemas";

type RegisterPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
    error?: string;
  }>;
};

const getRedirectTarget = (callbackUrl?: string) => {
  if (!callbackUrl) {
    return "/issues";
  }

  if (callbackUrl.startsWith("/")) {
    return callbackUrl;
  }

  try {
    const parsedUrl = new URL(callbackUrl);
    const path = `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;

    return path.startsWith("/") ? path : "/issues";
  } catch {
    return "/issues";
  }
};

const getErrorMessage = (error?: string) => {
  if (!error) {
    return null;
  }

  if (error === "AccountExists") {
    return "This email is already registered.";
  }

  if (error === "InvalidInput") {
    return "Use a valid email and a password with at least 6 characters.";
  }

  if (error === "PasswordMismatch") {
    return "Passwords must match.";
  }

  return "Registration failed. Please try again.";
};

const RegisterPage = async ({
  searchParams,
}: RegisterPageProps) => {
  const session = await auth();
  const { callbackUrl, error } = await searchParams;
  const redirectTarget = getRedirectTarget(callbackUrl);
  const loginHref = `/login?callbackUrl=${encodeURIComponent(redirectTarget)}`;

  if (session?.user) {
    redirect(redirectTarget);
  }

  const errorMessage = getErrorMessage(error);

  return (
    <section className="relative mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-6xl items-center justify-center overflow-hidden px-6 py-16 sm:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-[130%] -translate-y-[65%] rounded-full bg-[var(--accent)] opacity-35 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 translate-x-[40%] translate-y-[10%] rounded-full bg-[var(--accent-strong)] opacity-20 blur-3xl"
      />

      <div className="app-panel relative w-full max-w-md rounded-[32px] p-8 sm:p-10">
        <div className="app-brand-mark mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-semibold uppercase tracking-[0.24em]">
          NP
        </div>

        <div className="mt-7 text-center">
          <h1 className="text-3xl font-semibold text-[var(--text)] sm:text-[2rem]">
            Create account
          </h1>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Register with an email and password
          </p>
        </div>

        {errorMessage ? (
          <div className="app-error mt-6 rounded-[18px] px-4 py-3 text-sm">
            {errorMessage}
          </div>
        ) : null}

        <form
          className="mt-8 space-y-4"
          action={async (formData) => {
            "use server";

            const validation = credentialsRegisterSchema.safeParse({
              email: formData.get("email"),
              password: formData.get("password"),
              confirmPassword: formData.get("confirmPassword"),
            });

            if (!validation.success) {
              const passwordMismatch =
                validation.error.issues.some((issue) =>
                  issue.path.includes("confirmPassword"),
                );

              redirect(
                `/register?error=${passwordMismatch ? "PasswordMismatch" : "InvalidInput"}&callbackUrl=${encodeURIComponent(redirectTarget)}`,
              );
            }

            const { email, password } = validation.data;
            const existingUser = await prisma.user.findUnique({
              where: {
                email,
              },
              select: {
                id: true,
              },
            });

            if (existingUser) {
              redirect(`/register?error=AccountExists&callbackUrl=${encodeURIComponent(redirectTarget)}`);
            }

            await prisma.user.create({
              data: {
                email,
                name: email.split("@")[0],
                passwordHash: await hashPassword(password),
              },
            });

            await signIn("credentials", {
              email,
              password,
              redirectTo: redirectTarget,
            });
          }}
        >
          <div>
            <label
              htmlFor="email"
              className="app-label mb-2 block text-sm font-semibold"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="app-field rounded-2xl px-4 py-3 text-base"
              placeholder="user1@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="app-label mb-2 block text-sm font-semibold"
            >
              Password
            </label>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              required
              minLength={6}
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="app-label mb-2 block text-sm font-semibold"
            >
              Confirm password
            </label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              required
              minLength={6}
              placeholder="Enter password again"
            />
          </div>

          <button
            type="submit"
            className="app-primary-button flex w-full cursor-pointer items-center justify-center rounded-full px-5 py-3.5 text-base font-semibold ease-out hover:-translate-y-0.5 active:translate-y-0"
          >
            Register
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link
              href={loginHref}
              className="font-semibold text-[var(--accent-strong)] transition duration-300 hover:text-[var(--text)]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
