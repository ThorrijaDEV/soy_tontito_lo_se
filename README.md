# soy_tontito_lose

Sistema oficial para que Gabri responda a una declaración amorosa. Web minimalista, absurda y con un toque romántico al final.

## Demo

https://thorrija.github.io/soy_tontito_lose/

## Estructura

```
soy_tontito_lose/
├── index.html          # Página principal
├── styles.css          # Estilos
├── app.js              # Lógica frontend
├── netlify.toml        # Configuración Netlify
├── netlify/
│   └── functions/
│       └── telegram-notify.js  # Serverless function para Telegram
├── .env.example        # Variables de entorno (template)
└── README.md
```

## Pantallas

1. **Intro** - Informe oficial con barra de progreso "97% innecesariamente complicada"
2. **Informe** - Ficha técnica del "problema administrativo"
3. **Aclaración** - Mensaje sincero sin presión
4. **Decisión** - Tres botones: SÍ / NO / NECESITO MÁS TIEMPO
5. **Respuestas** - Pantallas específicas para cada opción

## Despliegue

### GitHub Pages (Solo frontend)

1. Push a GitHub
2. Settings → Pages → Deploy from branch → `main` / `root`
3. La web estará en `https://usuario.github.io/soy_tontito_lose/`

### Netlify (Frontend + Telegram Notifications)

1. Conecta el repo a Netlify
2. Build command: (vacío)
3. Publish directory: `.`
4. Functions directory: `netlify/functions`
5. En Site Settings → Environment Variables, añade:
   - `TELEGRAM_BOT_TOKEN` - Token de @BotFather
   - `TELEGRAM_CHAT_ID` - Tu chat ID (usa @userinfobot)
6. Deploy

El frontend enviará la respuesta a Formspree Y llamará a `/.netlify/functions/telegram-notify` en paralelo.

## Formspree

Endpoint configurado: `https://formspree.io/f/mppzqzqp`

Envía campo `respuesta` con valores:
- `SI`
- `NO`
- `NECESITO_MAS_TIEMPO`

## Telegram Bot Setup

1. Habla con @BotFather → `/newbot` → consigue token
2. Habla con @userinfobot → consigue tu chat ID
3. Añade ambas variables en Netlify/Vercel

## Desarrollo Local

```bash
# Servidor simple
npx serve .

# O con Python
python3 -m http.server 8000
```

## Personalización

- Textos: Edita `index.html`
- Colores/estilos: Edita `styles.css` (variables CSS en `:root`)
- Lógica: Edita `app.js`
- Telegram: Edita `netlify/functions/telegram-notify.js`

## Tecnologías

- HTML/CSS/JS vanilla (sin build step)
- CSS Variables para theming
- Formspree para formularios
- Netlify Functions para Telegram (opcional)
- GitHub Pages / Netlify para hosting

## Licencia

MIT - Haz lo que quieras con esto.