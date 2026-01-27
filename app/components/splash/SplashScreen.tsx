"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "~/lib/utils";

interface SplashScreenProps {
  finishLoading: () => void;
}

export function SplashScreen({ finishLoading }: SplashScreenProps) {
  const [mounted, setMounted] = React.useState(false);
  const [show, setShow] = React.useState(true);
  const { t } = useTranslation("routes/splash");

  React.useEffect(() => {
    setMounted(true);

    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(() => finishLoading(), 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [finishLoading]);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "bg-background fixed inset-0 z-[9999] flex flex-col items-center justify-center",
        "transition-opacity duration-500 ease-in-out",
        show ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="bg-muted ring-ring/10 relative flex h-20 w-20 items-center justify-center rounded-xl shadow-sm ring-1">
          <img
            src="/icons/logo.png"
            alt="EmpSched Logo"
            className="h-10 w-10 animate-pulse object-contain"
          />
        </div>

        <div className="flex flex-col items-center gap-1">
          <h1 className="text-foreground text-xl font-semibold tracking-tight">
            {t("name")}
          </h1>
        </div>

        <div className="bg-muted mt-4 h-1 w-24 overflow-hidden rounded-full">
          <div className="bg-primary/50 h-full w-1/2 animate-[shimmer_1s_infinite]" />
        </div>
      </div>
    </div>
  );
}
