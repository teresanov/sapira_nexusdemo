# Proyecto Nexus

Demo de Compras Asia: gestión de revisiones BOM (bandeja de entrada, biblioteca, borradores, incidencias).

## Requisitos

- Node.js 18+
- npm

## Instalación y ejecución

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). En la página inicial puedes elegir:

- **Asistente Guiado** — Demo paso a paso (`/demo`)
- **Explorar Producto** — Modo producto con datos de prueba (`/app`)

## Scripts

| Comando        | Descripción              |
|----------------|--------------------------|
| `npm run dev`  | Servidor de desarrollo   |
| `npm run build`| Build de producción      |
| `npm run start`| Servidor de producción   |
| `npm run lint` | Ejecutar ESLint          |

## Estructura

- `src/app/` — Rutas Next.js (App Router)
- `src/app/page.tsx` — Inicio (elección demo / producto)
- `src/app/demo/` — Flujo guiado en 9 pasos
- `src/app/app/` — Modo producto (inbox, biblioteca, borradores, incidencias)
- `src/components/` — Componentes UI y de demo
- `src/context/` — Contextos React (demo, producto)
- `src/lib/` — Modelos, mocks y lógica de demo
