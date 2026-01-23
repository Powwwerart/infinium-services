# infinium-services

Frontend estático para INFINIUM (landing + chat mínimo).  

## Configuración de entorno
Configura el frontend desde `config/env.js` con las siguientes variables (recomendado):

- `API_BASE_URL`
- `WHATSAPP_PHONE`
- `BUY_URL`

Ejemplo en `config/env.js`:

```js
window.INFINIUM.env = {
  API_BASE_URL: 'https://tu-backend.com',
  WHATSAPP_PHONE: '19565505115',
  BUY_URL: 'https://tu-enlace-de-compra.com'
};
```

También puedes definir la URL del backend del chat mediante una de estas variables públicas (en orden de prioridad):

- `VITE_API_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_BACKEND_BASE_URL`
- `BACKEND_BASE_URL`

Ejemplo en HTML:

```html
<script>
  window.VITE_API_URL = 'https://tu-backend.com';
</script>
```

> No agregues llaves ni tokens en el frontend.

## Cómo correr en local

```bash
npm run dev
```

Luego abre `http://localhost:5173`.

## Build

```bash
npm run build
```

## Tracking de campañas

Ejemplo de URL con parámetros:

```
https://tu-dominio.com/?s=barberia23&t=teamA&c=flyer01
```

## Placeholders a completar

- `API_BASE_URL` en `config/env.js`.
- `WHATSAPP_PHONE` en `config/env.js`.
- `BUY_URL` en `config/env.js`.
