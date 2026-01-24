"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cx } from "@/utils/cx";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show light logo by default during SSR, then switch based on theme
  const logoSrc = mounted && resolvedTheme === "dark"
    ? "/logo_light_trans.png"
    : "/logo_dark_trans.png";

  return (
    <Image
      src={logoSrc}
      alt="OpenEOS"
      width={160}
      height={40}
      className={cx("h-8 w-auto", className)}
      priority
    />
  );
}
