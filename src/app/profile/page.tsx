import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import PasswordInput from "@/components/password-input";
import RouteToastMessage from "@/components/route-toast-message";
import { getRouteNotificationKey } from "@/lib/notifications";
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
  const notificationKey = getRouteNotificationKey("profile", {
    error,
    updated,
  });
  const canChangePassword = Boolean(user.passwordHash);
  const displayName = user.name?.trim() || "Signed in";

  return (
    <section className="relative mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-6xl items-start justify-center overflow-hidden px-6 py-16 sm:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-[130%] rounded-full bg-[var(--accent)] opacity-35 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-48 h-80 w-80 translate-x-[40%] rounded-full bg-[var(--accent-strong)] opacity-20 blur-3xl"
      />

      <div className="app-panel relative w-full max-w-2xl rounded-[32px] p-8 sm:p-10">
        <div>
          <div>
            <p className="app-eyebrow text-sm font-semibold uppercase tracking-[0.18em]">
              Account
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--text)] sm:text-[2rem]">
              Edit profile
            </h1>
          </div>
        </div>

        <div className="app-surface mt-7 rounded-[22px] px-5 py-4">
          <p className="text-sm font-semibold text-[var(--text)]">{displayName}</p>
          {user.email ? (
            <p className="mt-1 break-words text-sm text-[var(--muted)]">
              {user.email}
            </p>
          ) : null}
          <p className="app-eyebrow mt-2 text-xs font-semibold uppercase tracking-[0.12em]">
            {user.role}
          </p>
        </div>

        {notificationKey ? (
          <RouteToastMessage
            clearParams={["updated", "error"]}
            notificationKey={notificationKey}
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
              className="app-label mb-2 block text-sm font-semibold"
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
              className="app-field rounded-2xl px-4 py-3 text-base"
              placeholder="Your display name"
            />
          </div>

          {canChangePassword ? (
            <>
              <div>
                <label
                  htmlFor="password"
                  className="app-label mb-2 block text-sm font-semibold"
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
                  className="app-label mb-2 block text-sm font-semibold"
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
            <div className="app-surface rounded-[22px] px-5 py-4 text-sm leading-7 text-[var(--muted)]">
              Password changes are not available for this account because your
              sign-in is managed by Google or GitHub.
            </div>
          )}

          <button
            type="submit"
            className="app-primary-button flex w-full cursor-pointer items-center justify-center rounded-full px-5 py-3.5 text-base font-semibold ease-out hover:-translate-y-0.5 active:translate-y-0"
          >
            Save changes
          </button>
        </form>
      </div>
    </section>
  );
};

export default ProfilePage;
