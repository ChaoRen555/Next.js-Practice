import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { credentialsLoginSchema } from "@/lib/validationSchemas";

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
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-[130%] -translate-y-[65%] rounded-full bg-[#d8e5dd]/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 translate-x-[40%] translate-y-[10%] rounded-full bg-[#d5e0e7]/70 blur-3xl"
      />

      <div className="relative w-full max-w-md rounded-[32px] border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(247,250,248,0.68))] p-8 shadow-[0_32px_90px_-44px_rgba(95,121,113,0.42)] backdrop-blur-2xl sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#6d867d,#8ea79f_58%,#d3ddd9)] text-sm font-semibold uppercase tracking-[0.24em] text-white shadow-[0_16px_32px_-18px_rgba(95,121,113,0.55)]">
          NP
        </div>

        <div className="mt-7 text-center">
          <h1 className="text-3xl font-semibold text-[#273432] sm:text-[2rem]">
            Create account
          </h1>
          <p className="mt-3 text-sm leading-7 text-[#6f817d]">
            Register with an email and password
          </p>
        </div>

        {errorMessage ? (
          <div className="mt-6 rounded-[18px] border border-[#d7b4aa] bg-[#fff6f3] px-4 py-3 text-sm text-[#8a4e3d]">
            {errorMessage}
          </div>
        ) : null}

        <form
          className="mt-8 space-y-4"
          action={async (formData) => {
            "use server";

            const validation = credentialsLoginSchema.safeParse({
              email: formData.get("email"),
              password: formData.get("password"),
            });

            if (!validation.success) {
              redirect(`/register?error=InvalidInput&callbackUrl=${encodeURIComponent(redirectTarget)}`);
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
              className="mb-2 block text-sm font-semibold text-[#31403d]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-2xl border border-[#d6e0db] bg-white/88 px-4 py-3 text-base text-[#273432] outline-none transition duration-300 placeholder:text-[#9aaba6] focus:border-[#8ea79f] focus:ring-4 focus:ring-[#d8e5dd]/70"
              placeholder="user1@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-[#31403d]"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="w-full rounded-2xl border border-[#d6e0db] bg-white/88 px-4 py-3 text-base text-[#273432] outline-none transition duration-300 placeholder:text-[#9aaba6] focus:border-[#8ea79f] focus:ring-4 focus:ring-[#d8e5dd]/70"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center rounded-full border border-[#6d867d] bg-[#6d867d] px-5 py-3.5 text-base font-semibold text-white shadow-[0_20px_45px_-30px_rgba(39,52,50,0.45)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#5f7971] hover:shadow-[0_28px_55px_-30px_rgba(39,52,50,0.5)] active:translate-y-0 active:shadow-[0_18px_36px_-26px_rgba(39,52,50,0.45)]"
          >
            Register
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#6f817d]">
            Already have an account?{" "}
            <Link
              href={loginHref}
              className="font-semibold text-[#5f7971] transition duration-300 hover:text-[#41534f]"
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
