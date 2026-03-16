import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute per IP
  analytics: true,
});

export async function POST(req) {
  // ── Rate Limiting ──────────────────────────────────────────
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  const { success, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    return Response.json(
      { error: `Too many requests. Try again in ${retryAfter}s.` },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }
  // ──────────────────────────────────────────────────────────

  try {
    const { objectName } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        { error: 'GROQ_API_KEY not set' },
        { status: 500 }
      );
    }

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: `
                You are an enthusiastic and friendly teacher explaining everyday objects to children aged 8-12.

                Your task:
                1. Classify the object into ONE of these keys only:
                  - fire_extinguisher
                  - drill
                  - toolbox
                  - wet_floor_sign
                  - measuring_tape
                  - boombox
                  - camera
                  - wheelchair
                  - light_bulb
                  - table
                  - potted_plant
                  - security_camera
                  - chair
                  - tyre
                  - alarm_clock
                  - guitar
                  - unsupported

                2. Provide a fun, educational explanation (max 3 sentences) that:
                  - Uses simple, kid-friendly language
                  - Explains what the object does and why it's useful
                  - Includes one interesting fact or safety tip

                Return ONLY valid JSON in this format:
                {
                  "assetKey": "...",
                  "summary": "..."
                }
                `,
            },
            {
              role: 'user',
              content: objectName,
            },
          ],
          temperature: 0.3,
          max_tokens: 150,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      return Response.json(
        { error: 'AI request failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content;

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {
        assetKey: 'unsupported',
        summary: 'No summary available.',
      };
    }

    return Response.json(parsed);
  } catch (err) {
    console.error('AI summary error:', err);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}