// ── Private / internal IP range matchers ──────────────────────────────────

/** CIDR-style check: is an IP within a given prefix + mask? */
function ipInCIDR(ip: number[], prefix: number[], mask: number): boolean {
  for (let i = 0; i < 4; i++) {
    const ipOctet = (ip[i] ?? 0) & (0xff << (8 - mask));
    const prefixOctet = (prefix[i] ?? 0) & (0xff << (8 - mask));
    if (ipOctet !== prefixOctet) return false;
    mask = Math.max(0, mask - 8);
  }
  return true;
}

/** Parse a dotted-decimal IPv4 string into 4 octets, or return null. */
function parseIPv4(s: string): number[] | null {
  const parts = s.split(".");
  if (parts.length !== 4) return null;
  const octets = parts.map(Number);
  if (octets.some((o) => isNaN(o) || o < 0 || o > 255)) return null;
  return octets;
}

/**
 * Check whether a hostname resolves to a private or internal network address.
 *
 * Blocks:
 *   - Named localhost variants
 *   - IPv4 private ranges (10.x, 172.16-31.x, 192.168.x, 127.x, 0.x, 169.254.x)
 *   - IPv6 loopback / unique-local / link-local
 */
export function isPrivateAddress(hostname: string): boolean {
  const lower = hostname.toLowerCase().replace(/\[|\]$/g, ""); // strip IPv6 brackets

  // ── Well-known names ─────────────────────────────────────────────────
  if (
    lower === "localhost" ||
    lower === "localhost.localdomain" ||
    lower === "l" ||
    lower.endsWith(".local") ||
    lower.endsWith(".localhost")
  ) {
    return true;
  }

  // ── IPv6 (require a colon to avoid flagging hostnames like "fc-awesome.com") ──
  if (lower.includes(":")) {
    if (lower.startsWith("::1") || lower === "::") return true;
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // fc00::/7
    if (lower.startsWith("fe80")) return true; // fe80::/10
  }

  // ── IPv4 ──────────────────────────────────────────────────────────────
  const ip = parseIPv4(lower);
  if (!ip) {
    // If we can't parse it as IPv4 and it doesn't look like a hostname with dots,
    // it might be invalid — let the caller decide, return false here.
    return false;
  }

  // 127.0.0.0/8
  if (ip[0] === 127) return true;
  // 0.0.0.0/8
  if (ip[0] === 0) return true;
  // 10.0.0.0/8
  if (ipInCIDR(ip, [10, 0, 0, 0], 8)) return true;
  // 172.16.0.0/12
  if (ipInCIDR(ip, [172, 16, 0, 0], 12)) return true;
  // 192.168.0.0/16
  if (ipInCIDR(ip, [192, 168, 0, 0], 16)) return true;
  // 169.254.0.0/16 (link-local)
  if (ipInCIDR(ip, [169, 254, 0, 0], 16)) return true;

  return false;
}

// ── URL normalization ─────────────────────────────────────────────────────

/**
 * Normalize a user-supplied URL string:
 *   - Lowercases the hostname
 *   - Adds https:// if no protocol is present
 *   - Strips trailing whitespace
 *   - Does NOT preserve credentials or fragments
 */
export function normalizeUrl(raw: string): string {
  let s = raw.trim();

  // If it has a protocol, keep it; otherwise default to https
  if (!/^[a-zA-Z][a-zA-Z0-9+\-.]*:\/\//.test(s)) {
    s = `https://${s}`;
  }

  // Parse and rebuild without credentials / fragment
  try {
    const parsed = new URL(s);
    parsed.username = "";
    parsed.password = "";
    parsed.hash = "";
    return parsed.href;
  } catch {
    // If parsing fails, return the best-effort version for the caller to reject
    return s;
  }
}

// ── Full public-URL validation ────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  normalized?: string;
  error?: string;
}

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

/**
 * Validate that a URL is safe for outbound server-side requests.
 *
 * Checks performed:
 *   1. Must be parseable by the URL constructor after normalization.
 *   2. Must use http: or https: only.
 *   3. Must not contain embedded credentials (user:pass@host).
 *   4. Must not resolve to a private / internal network address.
 *   5. Must have a non-empty, non-trivial hostname.
 */
export function validatePublicUrl(input: string): ValidationResult {
  const raw = input.trim();

  if (!raw) {
    return { valid: false, error: "URL is empty." };
  }

  // ── Quick reject for clearly banned schemes ───────────────────────────
  const schemeMatch = raw.match(/^([a-zA-Z][a-zA-Z0-9+\-.]*):/);
  if (schemeMatch) {
    const scheme = schemeMatch[1].toLowerCase();
    if (
      scheme === "file" ||
      scheme === "ftp" ||
      scheme === "data" ||
      scheme === "javascript" ||
      scheme === "blob" ||
      scheme === "ws" ||
      scheme === "wss"
    ) {
      return {
        valid: false,
        error: `Scheme "${scheme}:" is not allowed. Use http or https.`,
      };
    }
  }

  // ── Normalize ─────────────────────────────────────────────────────────
  const normalized = normalizeUrl(raw);

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return { valid: false, error: "Invalid or unsupported URL." };
  }

  // ── Protocol check ────────────────────────────────────────────────────
  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    return {
      valid: false,
      error: `Protocol "${parsed.protocol}" is not allowed. Use http or https.`,
    };
  }

  // ── Credentials check ─────────────────────────────────────────────────
  if (parsed.username || parsed.password) {
    return {
      valid: false,
      error: "URL must not contain embedded credentials (user:pass@host).",
    };
  }

  // ── Hostname check ────────────────────────────────────────────────────
  const hostname = parsed.hostname;

  if (!hostname || hostname.length === 0) {
    return { valid: false, error: "URL has no hostname." };
  }

  // Reject bare IP addresses that are localhost (catches "127.0.0.1" etc.)
  if (isPrivateAddress(hostname)) {
    return {
      valid: false,
      error: "URL points to a private or internal network address.",
    };
  }

  // Reject hostnames that look like bare internal names
  if (
    hostname === "0.0.0.0" ||
    hostname === "255.255.255.255" ||
    hostname.startsWith("0.") ||
    hostname.startsWith("127.")
  ) {
    return {
      valid: false,
      error: "URL points to a private or internal network address.",
    };
  }

  // Reject TLD-only hostnames e.g. "http://com/" or bare "localhost"
  if (!hostname.includes(".") && !hostname.includes(":")) {
    // Allow single-word hostnames only in dev (e.g. localhost for testing)
    if (hostname === "localhost" || hostname === "localdev") {
      return {
        valid: false,
        error: "URL points to a private or internal network address.",
      };
    }
  }

  return { valid: true, normalized };
}
