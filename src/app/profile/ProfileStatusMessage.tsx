"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ProfileStatusMessageProps = {
  message: string;
  tone: "success" | "error";
};

const statusClasses = {
  success: "border-[#b8d2c2] bg-[#f3fbf6] text-[#3f6f51]",
  error: "border-[#d7b4aa] bg-[#fff6f3] text-[#8a4e3d]",
};

export default function ProfileStatusMessage({
  message,
  tone,
}: ProfileStatusMessageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const nextSearchParams = new URLSearchParams(searchParams.toString());
      nextSearchParams.delete("updated");
      nextSearchParams.delete("error");
      const queryString = nextSearchParams.toString();

      router.replace(queryString ? `${pathname}?${queryString}` : pathname);
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [pathname, router, searchParams]);

  return (
    <div
      className={`mt-6 rounded-[18px] border px-4 py-3 text-sm [animation:profile-status-fade_2000ms_ease-out_forwards] ${statusClasses[tone]}`}
    >
      {message}
      <style>
        {`
          @keyframes profile-status-fade {
            0%, 75% {
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
    </div>
  );
}
