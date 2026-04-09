"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-surface-container-lowest group-[.toaster]:text-on-surface group-[.toaster]:border-outline-variant group-[.toaster]:shadow-xl",

          description: "group-[.toast]:text-on-surface-variant",

          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-on-primary hover:brightness-105",

          cancelButton:
            "group-[.toast]:bg-surface-container group-[.toast]:text-on-surface-variant hover:bg-surface-container-high",

          // Couleurs personnalisées selon ta palette
          success:
            "group-[.toast]:!bg-[#6043c9] group-[.toast]:!text-white", // tertiary

          error:
            "group-[.toast]:!bg-[#ba1a1a] group-[.toast]:!text-white", // error

          warning:
            "group-[.toast]:!bg-[#fd8603] group-[.toast]:!text-white", // secondary-container (orange)

          info:
            "group-[.toast]:!bg-[#b7102a] group-[.toast]:!text-white", // primary (rouge foncé)
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };