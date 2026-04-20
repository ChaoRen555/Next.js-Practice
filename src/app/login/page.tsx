import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";

type LoginPageProps = {
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

  if (error === "OAuthAccountNotLinked") {
    return "This email is already linked to a different sign-in method.";
  }

  return "Sign in failed. Please try again.";
};

const LoginPage = async ({
  searchParams,
}: LoginPageProps) => {
  const session = await auth();
  const { callbackUrl, error } = await searchParams;
  const redirectTarget = getRedirectTarget(callbackUrl);

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
            Welcome back
          </h1>
          <p className="mt-3 text-sm leading-7 text-[#6f817d]">
            Choose a sign-in method
          </p>
        </div>

        {errorMessage ? (
          <div className="mt-6 rounded-[18px] border border-[#d7b4aa] bg-[#fff6f3] px-4 py-3 text-sm text-[#8a4e3d]">
            {errorMessage}
          </div>
        ) : null}

        <form
          className="mt-8"
          action={async () => {
            "use server";
            await signIn("google", {
              redirectTo: redirectTarget,
            });
          }}
        >
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-[#d6e0db] bg-white px-5 py-3.5 text-base font-semibold text-[#273432] shadow-[0_20px_45px_-30px_rgba(39,52,50,0.45)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#bcc9c3] hover:bg-[#f8fbf9] hover:shadow-[0_28px_55px_-30px_rgba(39,52,50,0.5)] active:translate-y-0 active:shadow-[0_18px_36px_-26px_rgba(39,52,50,0.45)]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 shrink-0"
            >
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.86c2.26-2.08 3.58-5.15 3.58-8.64Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.86-3c-1.07.72-2.44 1.15-4.09 1.15-3.15 0-5.82-2.13-6.77-5H1.24v3.09A12 12 0 0 0 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.23 14.24A7.2 7.2 0 0 1 4.85 12c0-.78.14-1.53.38-2.24V6.67H1.24A12 12 0 0 0 0 12c0 1.93.46 3.75 1.24 5.33l3.99-3.09Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.43-3.43C17.95 1.16 15.24 0 12 0A12 12 0 0 0 1.24 6.67l3.99 3.09c.95-2.87 3.62-4.99 6.77-4.99Z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </form>

        <form
          className="mt-4"
          action={async () => {
            "use server";
            await signIn("github", {
              redirectTo: redirectTarget,
            });
          }}
        >
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-[#d6e0db] bg-white px-5 py-3.5 text-base font-semibold text-[#273432] shadow-[0_20px_45px_-30px_rgba(39,52,50,0.45)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#bcc9c3] hover:bg-[#f8fbf9] hover:shadow-[0_28px_55px_-30px_rgba(39,52,50,0.5)] active:translate-y-0 active:shadow-[0_18px_36px_-26px_rgba(39,52,50,0.45)]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 shrink-0 fill-current"
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.11.79-.25.79-.56v-2.18c-3.2.7-3.88-1.36-3.88-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.71 1.25 3.37.95.1-.75.4-1.25.72-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a10.98 10.98 0 0 1 5.78 0c2.19-1.49 3.16-1.18 3.16-1.18.63 1.58.24 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.28 5.68.41.36.78 1.08.78 2.18v3.23c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
            <span>Continue with GitHub</span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-[#5f7971] transition duration-300 hover:text-[#41534f]"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
