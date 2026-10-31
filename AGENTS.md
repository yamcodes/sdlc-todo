# sdlc-todo

One product, one repo. Each change lives in `changes/NNN-short-name/`, starting with `intent.md`. `spec.md` and `plan.md` join that folder after their gates. Application code stays at the repo root.

## Playbook

Read `.agents/references/ai-native-sdlc.md` before fetching the AI-native SDLC playbook. That file is the working notes for this repo: stages, artifacts, and who accepts each one.

## People

- Maya Shah, product manager. Accepts the intent, and whether the spec solves the stated problem.
- Leo Martins, tech lead. Accepts the technical risks in the spec, and the plan, before code.
- Sam Okonkwo, Nora Berg, and Amir Haddad, engineers. One of them reviews a pull request only if they did not write the change.

## Intent

New ideas are written with the `capture-intent` skill in `.agents/skills/capture-intent/`. Maya Shah reviews the file with the `review-intent` skill in `.agents/skills/review-intent/` and writes her answers into it. Merging accepts it. Closing the review rejects it. The author and the time come from git history. The file has no status field.

## Before any application code

Do not add application code, frameworks, or tests until both of these are true:

- Maya Shah has merged the intent. A closed review is a rejection.
- A plan file exists and Leo Martins has accepted it.

Until then, the only files to add are intent, spec, and plan markdown.

## Commands

None yet. Add the build and test commands here once the app exists.
