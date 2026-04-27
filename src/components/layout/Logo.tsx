import Image from "next/image";
import { cx } from "@/utils/cx";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Image
      src="/logo_dark_trans.png"
      alt="OpenEOS"
      width={160}
      height={40}
      className={cx("h-8 w-auto", className)}
      priority
    />
  );
}
