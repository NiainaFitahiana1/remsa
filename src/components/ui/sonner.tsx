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
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg !important",
          
          description: "group-[.toast]:text-muted-foreground",
          
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          
          success: "group-[.toast]:!bg-emerald-500 group-[.toast]:!text-white",
          error: "group-[.toast]:!bg-red-500 group-[.toast]:!text-white",
          warning: "group-[.toast]:!bg-amber-500 group-[.toast]:!text-white",
          info: "group-[.toast]:!bg-blue-500 group-[.toast]:!text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };