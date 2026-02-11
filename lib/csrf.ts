export function getCookieValue(key: string): string | null {
  const pairs = document.cookie ? document.cookie.split(";") : [];
  for (const pair of pairs) {
    const [rawName, ...rawValue] = pair.trim().split("=");
    if (rawName !== key) {
      continue;
    }

    return rawValue.length ? decodeURIComponent(rawValue.join("=")) : "";
  }

  return null;
}

export function getCsrfToken(): string {
  const csrfCookieName =
    process.env.NEXT_PUBLIC_CSRF_COOKIE_NAME?.trim() || "csrf_token";

  return getCookieValue(csrfCookieName) ?? "";
}
