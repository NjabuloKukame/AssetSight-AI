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
    const { command } = await req.json();

    if (!command) {
      return Response.json(
        { action: 'idle', summary: 'No command provided.' },
        { status: 200 }
      );
    }

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
                    You map user commands to avatar actions.

                    Allowed actions:
                    - wave
                    - point
                    - dance
                    - salute
                    - dropKick
                    - climb
                    - jog
                    - jump
                    - walkForward
                    - walkBackward
                    - idle

                    Rules:
                    - For single actions, return: {"action": "actionName", "summary": "description"}
                    - For sequences (e.g., "wave then jump"), return: {"actions": ["wave", "jump"], "summary": "description"}
                    - Choose the closest matching action(s).
                    - If no action applies, return "idle".
                    - Respond ONLY in valid JSON.
              `,
            },
            {
              role: 'user',
              content: command,
            },
          ],
          temperature: 0.3,
          max_tokens: 120,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);

      return Response.json(
        {
          action: 'idle',
          summary: 'The avatar remains idle due to an AI processing error.',
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content?.trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {
        action: 'idle',
        summary:
          'The avatar remains idle because the command could not be interpreted.',
      };
    }

    const allowedActions = [
      'wave',
      'point',
      'dance',
      'jump',
      'walkForward',
      'walkBackward',
      'salute',
      'dropKick',
      'climb',
      'jog',
      'idle',
    ];

    // Handle sequence of actions
    if (parsed.actions && Array.isArray(parsed.actions)) {
      const validActions = parsed.actions.filter(a => allowedActions.includes(a));
      if (validActions.length === 0) {
        parsed.action = 'idle';
        delete parsed.actions;
      }
    } else if (!allowedActions.includes(parsed.action)) {
      parsed.action = 'idle';
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('interpret-command error:', err);

    return Response.json(
      {
        action: 'idle',
        summary: 'The avatar remains idle due to an internal system error.',
      },
      { status: 200 }
    );
  }
}