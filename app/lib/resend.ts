import { Resend } from "resend";

// The API key is only needed at the moment an email is actually sent
// (runtime), never when this module is merely imported (e.g. during
// `next build`, which evaluates every route). So we create the client
// lazily, on first use, to avoid a build-time crash when the key is
// absent (e.g. in CI).
let client: Resend | null = null;

export function getResend(): Resend {
  if (!client) {
    client = new Resend(process.env.RESEND_FIRST_API_KEY);
  }
  return client;
}
