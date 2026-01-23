# infinium-services

Frontend estático para INFINIUM (landing + chat mínimo).  

## Configuración de entorno
Define la URL del backend del chat mediante una de estas variables públicas (en orden de prioridad):

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

- Enlace de compra en `index.html`: `https://tu-enlace-de-compra.com`.
- Calendly en `scan.html`: `https://calendly.com/REEMPLAZAR`.
