# sdlc-todo

One product, one repo. Each change lives in `changes/NNN-short-name/`, starting with `intent.md`. `spec.md` and `plan.md` join that folder after their gates. Application code stays at the repo root.

This repo is a practice product for the AI-native SDLC, and it is also where the reusable skills and notes are written. `.agents/skills/` and `.agents/references/` must stay general: playbook roles only (originator, product owner, tech lead, an engineer who did not write the change), no team names, and no facts that are true only of this practice. The roster for this product lives in this file and in `README.md`. Copy the skills and the reference into the next project as they are. Do not copy the roster with them.

## Playbook

Read `.agents/references/ai-native-sdlc.md` before fetching the AI-native SDLC playbook. That file is the working notes for any product repo: stages, artifacts, and which role accepts each one. If a question is about how a play is executed and those notes do not contain the steps, fetch [the playbook](https://claude.com/resources/articles/the-ai-native-sdlc-playbook) and answer from that page.

Design starts when Maya opens a session on an accepted intent, with the skills available, and asks for the spec. It does not start inside the accept step. A job that drafts the spec when the intent merges comes only after that hand pass is a skill.

## People

- Maya Shah, product manager. Accepts the intent, and whether the spec solves the stated problem.
- Leo Martins, tech lead. Accepts the technical risks in the spec, and the plan, before code.
- Sam Okonkwo, Nora Berg, and Amir Haddad, engineers. One of them reviews a pull request only if they did not write the change.

## Intent

New ideas are written with the `capture-intent` skill in `.agents/skills/capture-intent/`. When Maya Shah asks to see all intents, or all open intents, the `list-intents` skill in `.agents/skills/list-intents/` reads the pull requests and the default branch. She reviews one file with the `review-intent` skill in `.agents/skills/review-intent/` and writes her answers into it. Merging accepts it. Closing the review rejects it. The author and the time come from git history. The file has no status field.

## Before any application code

Do not add application code, frameworks, or tests until both of these are true:

- Maya Shah has merged the intent. A closed review is a rejection.
- A plan file exists and Leo Martins has accepted it.

Until then, the only files to add are intent, spec, and plan markdown.

## Commands

None yet. Add the build and test commands here once the app exists.
