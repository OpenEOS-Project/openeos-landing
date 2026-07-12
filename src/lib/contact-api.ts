export type ContactType = "demo" | "contact" | "hardware" | "gateway";

export interface ContactPayload {
  type: ContactType;
  name: string;
  email: string;
  organization?: string;
  message: string;
  website: string;
  startedAt: number;
}

export interface ContactSuccess {
  ok: true;
  message?: string;
}

export interface ContactFailure {
  ok: false;
  status: number;
  message?: string;
  details?: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3010";

export async function submitContact(
  payload: ContactPayload,
): Promise<ContactSuccess | ContactFailure> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/public/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, status: 0 };
  }

  const json = await res.json().catch(() => null);

  if (res.ok) {
    return { ok: true, message: json?.data?.message };
  }

  const details = Array.isArray(json?.error?.details)
    ? json.error.details
        .map((d: { message?: string }) => d?.message)
        .filter((m: string | undefined): m is string => Boolean(m))
    : undefined;

  return {
    ok: false,
    status: res.status,
    message: json?.error?.message,
    details,
  };
}
