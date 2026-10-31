# AI-native SDLC

Working notes for this repo. The source is [The AI-native SDLC playbook](https://claude.com/resources/articles/the-ai-native-sdlc-playbook) (Anthropic). Read this file before fetching that page. Fetch it only when a question is not answered here.

These notes are ours. They name the stages, artifacts, and gates. They are not the playbook text.

## The loop

Work moves Plan, Design, Build, Test, Deploy, Maintain, then back to Plan. Each stage ends by committing one artifact. The next stage starts by reading it. A person accepts the artifact before the next stage starts. An agent may draft, investigate, implement, and check. An agent does not accept.

## Who accepts what here

| Stage | Artifact | Accepts | Question |
| --- | --- | --- | --- |
| Plan | `intent/NNN-short-name.md` | Maya Shah | Does this solve the right problem? |
| Design | `spec.md` for that intent | Maya Shah on the product half. Leo Martins on the technical risks. | Does the spec solve the stated problem, and is it safe to build? |
| Build | `plan.md` for that intent | Leo Martins | Does the plan prove the change before any code? |
| Test | Tests and evals in the same change | The engineer who reviews the pull request | Do the checks prove the plan? |
| Deploy | The pull request | Sam Okonkwo, Nora Berg, or Amir Haddad, if they did not write the change | Does the diff match the accepted plan, and do the checks pass? |
| Maintain | A new intent when a control band is breached | Maya Shah, same as any other intent | Is this finding worth a change? |

The author of an intent does not accept it. One person accepts each file. The other may comment.

## Where files live

- Intents: `intent/NNN-short-name.md`, drafted with `.agents/skills/capture-intent/`.
- Specs and plans: next to the intent they come from, only after the previous acceptance.
- Repo context for agents: `AGENTS.md` and `CLAUDE.md`.
- Repeatable procedures: `.agents/skills/`.
- Later, when they exist: `REVIEW.md` for review passes, `bands.yaml` for control bands.

No application code, frameworks, or tests until Maya Shah has merged an intent and Leo Martins has accepted a plan. A closed review is a rejection.

## Plays

Names below are the playbook's menu. The one-line note is how this repo uses each one.

### Plan

- **Capture as intent.** The originator describes the problem in their own words. The capture-intent skill writes a draft with `Status: draft`. Maya reviews it with the review-intent skill, writes her product answers into the file, sets `Status: accepted`, and merges. Technical questions stay open for Leo. She rejects by closing the review and leaving `Status: draft`. The author and the time come from git history.

### Design

- **Requirements and design.** After Maya accepts the intent, an agent drafts the spec from that file. Maya checks that it solves the stated problem. Leo checks technical risk before anyone writes a plan. Policy belongs in skills, applied while the spec is written.

### Build

- **Plan mode.** An agent drafts `plan.md`: files that change, order of work, risks, and the proof. Leo accepts it. Code starts after that. If implementation departs from the plan, the plan is updated in the same change.
- **Auto mode.** Routine edits can proceed without a prompt per edit only after the plan is accepted and the repo's checks exist.
- **Legacy source of truth.** On an existing system, the agent reads the running code and its records. It does not invent a second design beside them.
- **CLAUDE.md.** Commands, conventions, architecture, and known mistakes live in `AGENTS.md` and `CLAUDE.md`, in git.
- **Skills.** A repeated procedure becomes a skill under `.agents/skills/`. Chat history is not the procedure.
- **Hooks.** A script may allow, ask, or block an action while the agent works.
- **Parallel sessions.** A check can run in a separate session. That session does not approve the change it is checking.

### Test

- **Feedback loop.** Build and test commands live in `AGENTS.md` and `CLAUDE.md` so the agent runs them.
- **Continuous evals.** Checks that must keep passing run in CI when the code or the agent's setup changes.

### Deploy

- **PR review.** An agent may review a pull request against `REVIEW.md` once that file exists. Findings do not merge it. A human who did not write the change approves it.
- **Approval-gate hooks.** A release or other named action waits for a named person.
- **Managed settings.** Org-wide denies limit what an agent may touch. This practice repo does not have them yet.
- **CI/CD.** An accepted artifact may start the next job. Production stays behind the human gate.

### Maintain

- **Control bands.** A deterministic check watches one metric. The model does not decide that a band was crossed. A breach can file a new intent, which Maya still accepts.
- **Recurring scans.** A scheduled finding becomes an intent, or a pull request through the same review gate.
- **On-call intake.** An alert or message can start the same intent path. A person triages it.

## What an agent does next

On a new idea, run capture-intent and stop. On an intent Maya has merged, with no spec, draft the spec and stop for Maya and Leo. On an accepted spec with no plan, draft the plan and stop for Leo. On an accepted plan, implement only that plan.
