import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import PasswordInput from "@/components/password-input";
import RouteToastMessage from "@/components/route-toast-message";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import {
  updatePasswordSchema,
  updateProfileSchema,
} from "@/lib/validationSchemas";

type ProfilePageProps = {
  searchParams: Promise<{
    error?: string;
    updated?: string;
  }>;
};

type StatusMessage = {
  message: string;
  severity: "success" | "error";
};

const getStatusMessage = (
  updated?: string,
  error?: string,
): StatusMessage | null => {
  if (updated === "profile") {
    return {
      message: "Profile settings saved.",
      severity: "success",
    };
  }

  if (updated === "password") {
    return {
      message: "Password updated.",
      severity: "success",
    };
  }

  if (error === "invalid-profile") {
    return {
      message: "Use a name with 80 characters or fewer.",
      severity: "error",
    };
  }

  if (error === "invalid-password") {
    return {
      message: "Use a password between 6 and 128 characters.",
      severity: "error",
    };
  }

  if (error === "password-mismatch") {
    return {
      message: "Passwords must match.",
      severity: "error",
    };
  }

  if (error === "password-unavailable") {
    return {
      message:
        "Password changes are only available for email sign-in accounts.",
      severity: "error",
    };
  }

  return null;
};

const ProfilePage = async ({ searchParams }: ProfilePageProps) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/profile");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      email: true,
      name: true,
      passwordHash: true,
      role: true,
    },
  });

  if (!user) {
    redirect("/login?callbackUrl=/profile");
  }

  const { error, updated } = await searchParams;
  const status = getStatusMessage(updated, error);
  const canChangePassword = Boolean(user.passwordHash);
  const displayName = user.name?.trim() || "Signed in";

  return (
    <section className="relative mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-6xl items-start justify-center overflow-hidden px-6 py-16 sm:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-[130%] rounded-full bg-[#d8e5dd]/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-48 h-80 w-80 translate-x-[40%] rounded-full bg-[#d5e0e7]/70 blur-3xl"
      />

      <div className="relative w-full max-w-2xl rounded-[32px] border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(247,250,248,0.68))] p-8 shadow-[0_32px_90px_-44px_rgba(95,121,113,0.42)] backdrop-blur-2xl sm:p-10">
        <div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6d867d]">
              Account
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[#273432] sm:text-[2rem]">
              Edit profile
            </h1>
          </div>
        </div>

        <div className="mt-7 rounded-[22px] border border-[#d6e0db] bg-white/62 px-5 py-4">
          <p className="text-sm font-semibold text-[#31403d]">{displayName}</p>
          {user.email ? (
            <p className="mt-1 break-words text-sm text-[#6f817d]">
              {user.email}
            </p>
          ) : null}
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#6d867d]">
            {user.role}
          </p>
        </div>

        {status ? (
          <RouteToastMessage
            clearParams={["updated", "error"]}
            message={status.message}
            severity={status.severity}
          />
        ) : null}

        <form
          className="mt-8 space-y-4"
          action={async (formData) => {
            "use server";

            const session = await auth();

            if (!session?.user) {
              redirect("/login?callbackUrl=/profile");
            }

            const validation = updateProfileSchema.safeParse({
              name: formData.get("name"),
            });

            if (!validation.success) {
              redirect("/profile?error=invalid-profile");
            }

            const password = formData.get("password");
            const passwordValue = typeof password === "string" ? password : "";
            const confirmPassword = formData.get("confirmPassword");
            const confirmPasswordValue =
              typeof confirmPassword === "string" ? confirmPassword : "";
            const shouldUpdatePassword =
              passwordValue.length > 0 || confirmPasswordValue.length > 0;

            const existingUser = await prisma.user.findUnique({
              where: {
                id: session.user.id,
              },
              select: {
                passwordHash: true,
              },
            });

            if (shouldUpdatePassword && !existingUser?.passwordHash) {
              redirect("/profile?error=password-unavailable");
            }

            const passwordValidation = shouldUpdatePassword
              ? updatePasswordSchema.safeParse({
                  password: passwordValue,
                  confirmPassword: confirmPasswordValue,
                })
              : null;

            if (passwordValidation && !passwordValidation.success) {
              const passwordMismatch = passwordValidation.error.issues.some(
                (issue) => issue.path.includes("confirmPassword"),
              );

              redirect(
                passwordMismatch
                  ? "/profile?error=password-mismatch"
                  : "/profile?error=invalid-password",
              );
            }

            await prisma.user.update({
              where: {
                id: session.user.id,
              },
              data: {
                name: validation.data.name || null,
                ...(passwordValidation?.success
                  ? {
                      passwordHash: await hashPassword(
                        passwordValidation.data.password,
                      ),
                    }
                  : {}),
              },
            });

            revalidatePath("/", "layout");
            revalidatePath("/profile");
            redirect(
              shouldUpdatePassword
                ? "/profile?updated=password"
                : "/profile?updated=profile",
            );
          }}
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-[#31403d]"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={80}
              defaultValue={user.name ?? ""}
              className="w-full rounded-2xl border border-[#d6e0db] bg-white/88 px-4 py-3 text-base text-[#273432] outline-none transition duration-300 placeholder:text-[#9aaba6] focus:border-[#8ea79f] focus:ring-4 focus:ring-[#d8e5dd]/70"
              placeholder="Your display name"
            />
          </div>

          {canChangePassword ? (
            <>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#31403d]"
                >
                  New password
                </label>
                <PasswordInput
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  minLength={6}
                  maxLength={128}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-[#31403d]"
                >
                  Confirm password
                </label>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="new-password"
                  minLength={6}
                  maxLength={128}
                />
              </div>
            </>
          ) : (
            <div className="rounded-[22px] border border-[#d6e0db] bg-white/62 px-5 py-4 text-sm leading-7 text-[#6f817d]">
              Password changes are not available for this account because your
              sign-in is managed by Google or GitHub.
            </div>
          )}

          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center rounded-full border border-[#6d867d] bg-[#6d867d] px-5 py-3.5 text-base font-semibold text-white shadow-[0_20px_45px_-30px_rgba(39,52,50,0.45)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#5f7971] hover:shadow-[0_28px_55px_-30px_rgba(39,52,50,0.5)] active:translate-y-0 active:shadow-[0_18px_36px_-26px_rgba(39,52,50,0.45)]"
          >
            Save changes
          </button>
        </form>
      </div>
    </section>
  );
};

export default ProfilePage;
