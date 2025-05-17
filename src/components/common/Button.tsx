// components/common/button.tsx
"use client";

import { ButtonHTMLAttributes, FC } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary";
}

export const Button: FC<ButtonProps> = ({ className, variant = "default", ...props }) => {
  const base =
    "px-4 py-2 rounded font-medium transition-all cursor-pointer";

  const variants = {
    default: "",
    outline: "border border-gray-300 text-black bg-white hover:bg-gray-50",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
  };

  return (
    <button
      className={clsx(base, variants[variant], className)}
      {...props}
    />
  );
};
