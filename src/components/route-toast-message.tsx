"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useToaster } from "@/components/toaster-provider";
import {
  getNotificationMessage,
  type NotificationKey,
} from "@/lib/notifications";

type RouteToastMessageProps = {
  clearParams: string[];
  notificationKey: NotificationKey;
};

export default function RouteToastMessage({
  clearParams,
  notificationKey,
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
    const notification = getNotificationMessage(notificationKey);

    if (!notification) {
      return;
    }

    showToast({
      message: notification.message,
      severity: notification.severity,
    });

    const nextSearchParams = new URLSearchParams(searchParams.toString());

    clearParams.forEach((paramName) => {
      nextSearchParams.delete(paramName);
    });

    const queryString = nextSearchParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  }, [clearParams, notificationKey, pathname, router, searchParams, showToast]);

  return null;
}
