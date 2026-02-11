import { applyCors } from './_cors.js';

export default function handler(req, res) {
  if (!applyCors(req, res)) return;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({ ok: true, service: 'infinium-api' }));
}
