# Plan: hello world

## Files that change

- package.json, package-lock.json, tsconfig.json, vite.config.ts (new, repo root)
- index.html (new)
- src/main.ts (new)
- src/main.test.ts (new)
- AGENTS.md and CLAUDE.md (commands only, once the app exists)

## Order of work

1. Add a Vite and TypeScript app at the repo root. No UI framework.
2. index.html loads src/main.ts. That module sets the page text to hello world.
3. src/main.test.ts asserts that text.
4. Record the dev, build, and test commands in AGENTS.md and CLAUDE.md.

## Not chosen

- A lone HTML file. Simplest, and it skips the TypeScript stack the intent asks for.
- React or Next.js. The page has no interaction, sign-in, or second route.
- scripts/html-to-markdown stays a local tool. It is not the app.

## Risks

- App files sit beside the skills and docs. Do not change .agents/ or scripts/html-to-markdown.
- The spec left the stack open. This plan answers it with Vite and TypeScript. This change is routine, so the engineer who wrote the plan accepts that choice. If the stack changes, change this file before any code.

## Proof

- npm test runs Vitest and passes only when the page text is hello world.
- npm run dev serves the page. The engineer opens it and sees hello world.
