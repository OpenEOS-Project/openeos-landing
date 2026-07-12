"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ContactModal } from "@/components/ContactModal";
import type { ContactType } from "@/lib/contact-api";

interface ContactModalContextValue {
  open: (type?: ContactType) => void;
}

const ContactModalContext = createContext<ContactModalContextValue | null>(null);

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<ContactType>("demo");

  const open = useCallback((nextType: ContactType = "demo") => {
    setType(nextType);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <ContactModalContext.Provider value={value}>
      {children}
      {isOpen && <ContactModal type={type} onClose={close} />}
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const ctx = useContext(ContactModalContext);
  if (!ctx) {
    throw new Error("useContactModal must be used within a ContactModalProvider");
  }
  return ctx;
}
