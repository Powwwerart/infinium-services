# infinium-services

## Configuración de entorno

Define la URL del backend del chat mediante la variable pública `NEXT_PUBLIC_BACKEND_BASE_URL`.

Ejemplo en HTML:

```html
<script>
  window.NEXT_PUBLIC_BACKEND_BASE_URL = 'https://infinium-chat-api.vercel.app';
</script>
```

Si no se define, el frontend usará por defecto `https://infinium-chat-api.vercel.app`.
