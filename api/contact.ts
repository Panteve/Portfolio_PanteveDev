const MAX_BODY = 10_000;

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const destino = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !destino) {
    console.error('Falta configuración: RESEND_API_KEY o CONTACT_TO_EMAIL');
    return json({ ok: false, error: 'config' }, 500);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY) return json({ ok: false, error: 'too_large' }, 413);

  let data: any;
  try {
    data = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  if (!data || typeof data !== 'object') {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  // Honeypot: un bot rellena este campo oculto; una persona no. Respuesta "ok" silenciosa.
  if (data.website) return json({ ok: true });

  const nombre = String(data.nombre ?? '').replace(/[\r\n]+/g, ' ').trim();
  const correo = String(data.correo ?? '').trim();
  const mensaje = String(data.mensaje ?? '').trim();

  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  if (!nombre || nombre.length > 100 || !correoValido || correo.length > 200 ||
      !mensaje || mensaje.length > 5000) {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio <onboarding@resend.dev>',
        to: destino,
        reply_to: correo,
        subject: `Mensaje nuevo en tu portfolio de ${nombre}`,
        text: `De: ${nombre} <${correo}>\n\n${mensaje}`,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error('Resend respondió', res.status);
      return json({ ok: false, error: 'send' }, 502);
    }
    return json({ ok: true });
  } catch {
    console.error('Fallo al llamar a Resend');
    return json({ ok: false, error: 'send' }, 502);
  }
}
