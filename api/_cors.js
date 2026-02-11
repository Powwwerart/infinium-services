export function applyCors(req, res) {
  const expectedOrigin = process.env.FRONTEND_ORIGIN || '';
  const requestOrigin = req.headers.origin || '';

  if (expectedOrigin && requestOrigin !== expectedOrigin) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ ok: false, error: 'forbidden_origin' }));
    return false;
  }

  if (expectedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', expectedOrigin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return false;
  }

  return true;
}
