import { NextRequest, NextResponse } from 'next/server';

// In-memory sliding-window rate limiter for API routes.
//
// NOTE: this is per server instance — it blunts single-source abuse
// (spam, quota burn, casual brute force). Brute-force protection for
// reset/verification codes additionally uses persistent per-account
// attempt counters in Firestore (see the reset-password route), which
// hold across instances and restarts.

const hits = new Map<string, number[]>();
const MAX_TRACKED_KEYS = 20000;

function pruneIfNeeded(now: number) {
  if (hits.size <= MAX_TRACKED_KEYS) return;
  for (const [key, timestamps] of hits) {
    const fresh = timestamps.filter((t) => now - t < 24 * 60 * 60 * 1000);
    if (fresh.length === 0) {
      hits.delete(key);
    } else {
      hits.set(key, fresh);
    }
    if (hits.size <= MAX_TRACKED_KEYS) break;
  }
}

export interface RateLimitResult {
  allowed: boolean;
  /** Milliseconds until the oldest hit in the window expires (for Retry-After). */
  resetAfterMs: number;
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const timestamps = hits.get(key) ?? [];
  const fresh = timestamps.filter((t) => now - t < windowMs);

  if (fresh.length >= limit) {
    hits.set(key, fresh);
    return { allowed: false, resetAfterMs: windowMs - (now - fresh[0]) };
  }

  fresh.push(now);
  hits.set(key, fresh);
  pruneIfNeeded(now);
  return { allowed: true, resetAfterMs: 0 };
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0].trim();
    if (first) return first;
  }
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}

export function tooManyRequests(resetAfterMs: number): NextResponse {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(Math.max(1, Math.ceil(resetAfterMs / 1000))),
      },
    }
  );
}
