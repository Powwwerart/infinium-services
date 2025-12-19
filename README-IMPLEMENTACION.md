# Implementación INFINIUM Landing

Guía rápida para configurar la landing con tracking, eventos y chat tolerante a fallos.

## Configuración de entorno
- Define `window.BACKEND_BASE_URL` antes del cierre de `<body>` o desde un script externo. Ejemplo:
  ```html
  <script>
    window.BACKEND_BASE_URL = 'https://tu-backend.vercel.app';
  </script>
  ```
- No expongas llaves ni tokens en el frontend.

## Endpoints esperados
- **Eventos:** `POST ${BACKEND_BASE_URL}/api/event`
  - Payload: `{ event, ts, page, utmData, userAgent, extra }`
- **Chat:** `POST ${BACKEND_BASE_URL}/api/chat`
  - Payload: `{ message, meta: { utmData, page } }`
  - Respuesta esperada: `{ reply: "Texto de respuesta" }`

## Cómo probar en DevTools
- **UTM tracking**
  - Abre la landing con `?utm_source=test&utm_medium=ads&utm_campaign=launch`.
  - En consola verifica: `"[UTM CHECK]"` con los valores guardados.
  - Refresca la página sin querystring y confirma que los valores persisten (sessionStorage).
- **Eventos**
  - En Network, filtra por `/api/event` y haz clic en:
    - `COMPRA YA`
    - `WhatsApp` (ES/EN)
    - Abrir chat y enviar un mensaje
  - Revisa el payload para confirmar `utmData`, `page` y `userAgent`.
- **Chat**
  - Abre el chat (botón 🤖). Debería disparar `chat_open`.
  - Envía un mensaje:
    - Sin backend configurado: muestra “Backend no conectado”.
    - Con backend configurado: verifica POST a `/api/chat` y render de `reply`.

## Checklist de verificación
- [ ] UTM almacenado en `sessionStorage` y reflejado en consola.
- [ ] Eventos `/api/event` con `utmData`, `page`, `userAgent`.
- [ ] WhatsApp incluye UTM en el mensaje.
- [ ] GA4 recibe eventos si `gtag` existe.
- [ ] Chat abre, envía mensaje y responde (o muestra “Backend no conectado” si falta backend).
