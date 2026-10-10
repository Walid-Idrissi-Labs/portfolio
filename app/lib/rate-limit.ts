const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, { start: number; count: number }>();

// shortcut: counted in one server instance's memory, so a flood spread over many
// instances or addresses gets through; add a Vercel Firewall rate-limit rule then.
export function rateLimited(req: Request): boolean {
  // Vercel sets this header itself, so a caller can't fake another address there.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "";
  const now = Date.now();
  const hit = hits.get(ip);
  if (!hit || now - hit.start > WINDOW_MS) {
    if (hits.size >= 1000) hits.clear();
    hits.set(ip, { start: now, count: 1 });
    return false;
  }
  return ++hit.count > MAX_REQUESTS;
}
