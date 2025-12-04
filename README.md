# AI Writing Assistant

**AI Writing Assistant** es un asistente de escritura con IA orientado a portafolios profesionales. Permite **reescribir**, **resumir** y **expandir** textos en español, con selección de modo, tono, historial de transformaciones y presets rápidos.

---

## ✨ Características principales

### Modos de escritura

- **Reescribir**: mejora claridad y estilo sin alterar el significado.
- **Expandir**: añade contexto, ejemplos y detalles.
- **Resumir**: condensa contenido manteniendo ideas clave.

### Tonos disponibles

- Profesional  
- Neutro  
- Casual  
- Creativo  

### Presets rápidos

- Email profesional  
- Resumen ejecutivo  
- Historia creativa  
- Mensaje casual  

### UI / UX

- Editor dual (entrada / salida).
- Botón de copia rápida.
- Historial de ejecuciones (hasta 20).
- Diseño oscuro tipo SaaS, responsive y limpio.

### API de IA

- Endpoint: `POST /api/ai`
- Payload: `{ text, mode, tone }`
- Respuesta mock local (`from: "mock"`), preparado para integrar OpenAI u otros modelos.

---

## 🛠️ Stack técnico

- **Next.js 16 (App Router + React Compiler)**
- **React 19**
- **TypeScript**
- **Tailwind CSS 3**
- **API Routes** (`src/app/api/ai/route.ts`)

---

## 📁 Estructura principal

```txt
ai-writing-assistant/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── ai/
│   │   │       └── route.ts     # Endpoint IA (mock, listo para OpenAI)
│   │   ├── layout.tsx           # Layout global y metadata
│   │   ├── page.tsx             # UI principal del asistente
│   │   └── globals.css          # Tailwind + estilos globales
│   └── ...
├── public/
│   └── favicon.ico
├── tailwind.config.ts
├── postcss.config.mjs
├── package.json
├── tsconfig.json
└── README.md
