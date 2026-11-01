# Plan: hello world

## Files that change

- `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `vite.config.ts` (new, repo root)
- `index.html` (new)
- `src/main.tsx` (new)
- `src/App.tsx` (new)
- `src/App.test.tsx` (new)
- `AGENTS.md` and `CLAUDE.md` (Commands section only)

## Order of work

1. Add a Vite, TypeScript, and React app at the repo root. Install it with pnpm, which writes `pnpm-lock.yaml`. Do not add `pnpm-workspace.yaml`. Use `@vitejs/plugin-react`. TypeScript is strict, with `jsx` set to `react-jsx`. Vitest uses happy-dom and `@testing-library/react`. Scripts are `dev` (`vite`), `build` (`vite build`), and `test` (`vitest run`).
2. `index.html` loads `src/main.tsx` as a module and contains one empty root element. `src/main.tsx` renders `App` into that element. `App` shows only the text `hello world`.
3. `src/App.test.tsx` fails unless that text is `hello world`.
4. Replace the Commands section in `AGENTS.md` and `CLAUDE.md` with `pnpm dev`, `pnpm build`, and `pnpm test`.

## Not chosen

- npm and `package-lock.json`. The engineer asked for pnpm. Yarn is the same kind of choice, and it was not asked for.
- Vite and TypeScript with no UI framework. Smaller, and the engineer asked for React.
- Next.js. The page has no sign-in, no second route, and nothing to add or manage.
- A single HTML file. It skips TypeScript and React.
- A Node HTTP server, Bun, or Deno. Vite already serves the page and builds it.
- `scripts/html-to-markdown`. That tree is a local converter with its own `package.json`. It is not the app.

## Risks

- The scaffold is the risky step. App files sit at the repo root beside `.agents/` and `scripts/html-to-markdown`. React adds the Vite plugin and JSX. pnpm would treat a workspace file as an install of that converter too. Do not change those trees, and do not add `pnpm-workspace.yaml`.
- The spec left the stack open for the tech lead. This plan answers it with Vite, TypeScript, React, and pnpm. The change is not classed as higher risk, so the engineer who wrote the plan accepts that choice. If the stack should change, change this file before any code.

## Proof

- `pnpm test` passes only when the page text is `hello world`.
- `pnpm dev` serves the page. Opening it shows `hello world` and nothing else to do.
- `pnpm build` completes.
