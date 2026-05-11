"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useToaster } from "@/components/toaster-provider";

type RouteToastSeverity = "success" | "error" | "info" | "warning";

type RouteToastMessageProps = {
  clearParams: string[];
  message: string;
  severity?: RouteToastSeverity;
};

export default function RouteToastMessage({
  clearParams,
  message,
  severity = "info",
}: RouteToastMessageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToaster();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (hasShownToast.current) {
      return;
    }

    hasShownToast.current = true;

    showToast({
      message,
      severity,
    });

    const nextSearchParams = new URLSearchParams(searchParams.toString());

    clearParams.forEach((paramName) => {
      nextSearchParams.delete(paramName);
    });

    const queryString = nextSearchParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  }, [clearParams, message, pathname, router, searchParams, severity, showToast]);

  return null;
}
