"use client";

import {
  Alert,
  Snackbar,
} from "@mui/material";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type ToastSeverity = "success" | "error" | "info" | "warning";

type ToastInput = {
  message: string;
  severity?: ToastSeverity;
};

type ToastItem = ToastInput & {
  id: number;
};

type ToasterContextValue = {
  showToast: ({ message, severity }: ToastInput) => void;
};

const ToasterContext = createContext<ToasterContextValue | null>(null);

type ToasterProviderProps = {
  children: ReactNode;
};

export default function ToasterProvider({
  children,
}: ToasterProviderProps) {
  const [toastQueue, setToastQueue] = useState<ToastItem[]>([]);

  const showToast = useCallback(({ message, severity = "info" }: ToastInput) => {
    setToastQueue((currentQueue) => {
      return [
        ...currentQueue,
        {
          id: Date.now() + currentQueue.length,
          message,
          severity,
        },
      ];
    });
  }, []);

  const handleClose = useCallback(() => {
    setToastQueue((currentQueue) => currentQueue.slice(1));
  }, []);

  const contextValue = useMemo<ToasterContextValue>(() => {
    return {
      showToast,
    };
  }, [showToast]);

  const activeToast = toastQueue[0] ?? null;

  return (
    <ToasterContext.Provider value={contextValue}>
      {children}
      {activeToast ? (
        <Snackbar
          open
          autoHideDuration={4000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={handleClose}
        >
          <Alert
            severity={activeToast.severity}
            variant="filled"
            sx={{ minWidth: 280 }}
            onClose={handleClose}
          >
            {activeToast.message}
          </Alert>
        </Snackbar>
      ) : null}
    </ToasterContext.Provider>
  );
}

export const useToaster = () => {
  const context = useContext(ToasterContext);

  if (!context) {
    throw new Error("useToaster must be used within ToasterProvider.");
  }

  return context;
};
