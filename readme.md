
# Deployd

Proyecto realizado con [Next.js](https://nextjs.org) y TypeScript, estructurado con el sistema de rutas App Router. Incluye autenticación JWT, manejo de usuarios, libros y reviews, y está preparado para despliegue continuo con GitHub Actions y Vercel.

## Estructura principal

- `/src/app`: Rutas de la aplicación (páginas y API).
- `/src/components`: Componentes reutilizables (BookList, BookDetail, SearchBar, NavBar, etc).
- `/src/models`: Modelos de datos (Users, Review, Favorite, Vote).
- `/src/lib`: Lógica de autenticación y helpers (auth, db, withAuth).
- `/src/hooks`: Hooks personalizados para lógica de búsqueda y manejo de estado.

## Autenticación

La autenticación se maneja con JWT. El helper `src/lib/auth.ts` provee funciones para firmar tokens, leer cookies y verificar usuarios. El flujo de login y registro está implementado en `/src/app/auth`.

## Testing

El proyecto incluye tests con Vitest para hooks y componentes, ubicados en `src/__tests__` y junto a los componentes.

## Scripts principales

- `npm run dev`: Levanta el servidor de desarrollo.
- `npm run build`: Compila la app para producción.
- `npm test`: Ejecuta los tests con Vitest.

## GitHub Actions

El proyecto cuenta con integración continua (CI) mediante tres workflows:

- **PR — Build (`.github/workflows/pr-build.yml`)**: Compila la app en cada Pull Request para asegurar que no haya errores de build.
- **PR — Tests (`.github/workflows/pr-tests.yml`)**: Ejecuta los tests automáticamente en cada Pull Request.
- **Publish Docker (`.github/workflows/publish-docker.yml`)**: Al hacer push a `main` o crear un tag, construye y publica una imagen Docker en GitHub Container Registry (GHCR).

Esto garantiza calidad y despliegue automatizado en cada cambio.

## Deploy

La aplicación está desplegada en [Vercel](https://vercel.com/), lo que permite actualizaciones automáticas con cada push a la rama principal. El deploy es rápido y sin configuración adicional gracias a la integración nativa de Next.js con Vercel.

## Cómo correr localmente

1. Instala dependencias:
	```bash
	npm install
	```
2. Crea un archivo `.env.local` con tus variables de entorno (por ejemplo, `JWT_SECRET`).
3. Inicia el servidor:
	```bash
	npm run dev
	```
4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.
