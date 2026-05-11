"use client";

import { useState, type InputHTMLAttributes } from "react";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

const baseInputClassName =
  "app-field rounded-2xl px-4 py-3 pr-20 text-base";

export default function PasswordInput({
  className,
  ...props
}: PasswordInputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={passwordVisible ? "text" : "password"}
        className={`${baseInputClassName}${className ? ` ${className}` : ""}`}
      />
      <button
        type="button"
        aria-label={passwordVisible ? "Hide password" : "Show password"}
        onClick={() => {
          setPasswordVisible((visible) => !visible);
        }}
        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-xl border border-transparent text-[var(--accent-strong)] transition duration-300 hover:border-[var(--line-strong)] hover:bg-[var(--surface-hover)]"
      >
        {passwordVisible ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="m2 2 20 20" />
            <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
            <path d="M9.53 5.24A10.5 10.5 0 0 1 12 5c5 0 9 5 9 7a6.7 6.7 0 0 1-1.87 2.86" />
            <path d="M6.61 6.61C3.76 8.13 2 10.78 2 12c0 2 4 7 10 7a10.8 10.8 0 0 0 4.64-1.07" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}
