"use client";

import type { ReactNode } from "react";
import { useContactModal } from "@/providers/contact-modal";
import type { ContactType } from "@/lib/contact-api";

export function ContactTrigger({
  type,
  className,
  children,
}: {
  type: ContactType;
  className?: string;
  children: ReactNode;
}) {
  const { open } = useContactModal();

  return (
    <button type="button" className={className} onClick={() => open(type)}>
      {children}
    </button>
  );
}
