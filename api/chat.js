import { applyCors } from './_cors.js';

function buildReply(message = '') {
  const normalized = String(message).trim();
  if (!normalized) {
    return 'Cuéntame qué objetivo tienes (energía, descanso, digestión, enfoque o peso) y te ayudo.';
  }

  return `Gracias por tu mensaje: "${normalized}". Te recomiendo iniciar con una evaluación breve para orientarte mejor.`;
}

export default async function handler(req, res) {
  if (!applyCors(req, res)) return;

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ ok: false, error: 'method_not_allowed' }));
    return;
  }

  const body = req.body || {};
  const reply = buildReply(body.message);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({ ok: true, reply }));
}
