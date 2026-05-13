"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type LoginFieldErrorProps = {
  message: string | null;
};

export default function LoginFieldError({
  message,
}: LoginFieldErrorProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!message) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const nextSearchParams = new URLSearchParams(searchParams.toString());
      nextSearchParams.delete("error");
      const queryString = nextSearchParams.toString();

      router.replace(queryString ? `${pathname}?${queryString}` : pathname);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [message, pathname, router, searchParams]);

  if (!message) {
    return null;
  }

  return (
    <>
      <p className="mt-2 text-sm font-medium text-[var(--danger-text)] [animation:login-field-error-fade_3000ms_ease-out_forwards]">
        {message}
      </p>
      <style>
        {`
          @keyframes login-field-error-fade {
            0%, 70% {
              opacity: 1;
              transform: translateY(0);
            }
            100% {
              opacity: 0;
              transform: translateY(-2px);
            }
          }
        `}
      </style>
    </>
  );
}
