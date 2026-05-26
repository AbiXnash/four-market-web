"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--toast-close-button-start": "unset",
          "--toast-close-button-end": "0",
          "--toast-close-button-transform": "translate(35%, -35%)",
        } as React.CSSProperties
      }
      closeButton
      toastOptions={{
        classNames: {
          error:
            "text-red-600! dark:text-red-400! [&_[data-close-button]]:text-red-500!",
          success:
            "text-green-600! dark:text-green-400! [&_[data-close-button]]:text-green-500!",
          warning:
            "text-amber-600! dark:text-amber-400! [&_[data-close-button]]:text-amber-500!",
          info:
            "text-blue-600! dark:text-blue-400! [&_[data-close-button]]:text-blue-500!",
          closeButton:
            "!bg-popover !shadow-sm !size-5 !p-0.5 !transition-opacity hover:!opacity-80 [&_svg]:!size-3",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
