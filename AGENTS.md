## Project structure

- Next.js application using the App Router
- app - Next.js pages, layouts, metadata, and Route Handlers. Route Handlers are in app/api/**/route.ts
- components - React components used within the Next.js pages
- connections - server-side data-source connections
- data - static JSON data used in server-side logic
- hooks - custom React hooks used in UI components
- lib - Better Auth configuration and client setup
- public - image and other static assets
- services - server-side data-source/business services and the client-side API wrapper (api-service.ts)
- styles - CSS files and Material UI theme configuration
- util - utility functions that can be used in either server or UI code

The `@/*` TypeScript path alias refers to the repository root.

Keep database, authentication, and secret-dependent code on the server. Do not import server-only code into client components.

## Code style

- Use TypeScript with strict type checking. Script: `npm run check-types`
- Use ESLint for linting. Script: `npm run lint`
- Use Prettier for formatting. Script: `npm run format`
- Prettier is authoritative for formatting; preserve the repository's existing style conventions.

## Validation

Before completing a change, run the relevant checks:

- `npm run check-types`
- `npm run lint`
- `npm run test -- --run`
- `npm run format`

`npm run test` runs Vitest in watch mode. Use `npm run test -- --run` for a one-off or CI test run.

## Testing framework

- Vitest with React Testing Library for testing UI components and Mock Service Worker (MSW) for mocking external calls.
- Tests for a given file are located in `{fileDir}/__tests__/{fileName}.test.{ts|tsx}`.
- All unit tests should be self-contained. Mock network, database, authentication, and other external calls.
- Shared test setup and mocks live in `test-utils/` and local `__mocks__/` directories.
- When writing tests, if any code appears incorrect or cannot be tested, pause and notify before proceeding.

## Environment variables

- Keep secrets in local environment files and never commit credentials.
- Use `NEXT_PUBLIC_` only for values that are safe to expose to the browser.
- Do not pass server-only environment variables into client components.
