# AI-native SDLC

Working notes for a product repo. The source is [The AI-native SDLC playbook](https://claude.com/resources/articles/the-ai-native-sdlc-playbook) (Anthropic). Read this file before fetching that page. Fetch it only when a question is not answered here.

These notes name the stages, artifacts, and gates. They are not the playbook text. People are roles. The project roster lives outside this file.

## The loop

Work moves Plan, Design, Build, Test, Deploy, Maintain, then back to Plan. Each stage ends by committing one artifact. The next stage starts by reading it. A person accepts the artifact before the next stage starts. An agent may draft, investigate, implement, and check. An agent does not accept.

The end state is that accepting an artifact starts the next pass. Until that job exists, a person prompts the next pass by hand. For Design, that person is the product owner.

## Who accepts what here

| Stage | Artifact | Accepts | Question |
| --- | --- | --- | --- |
| Plan | `changes/NNN-short-name/intent.md` | Product owner | Does this solve the right problem? |
| Design | `spec.md` in that same folder | Product owner. The tech lead is consulted when the product owner classes the change as higher risk. | Does the spec solve the stated problem? |
| Build | `plan.md` in that same folder | The engineer who wrote it. The technical lead when the change is classed as higher risk. | Does the plan prove the change before any code? |
| Test | Tests and evals in the same change | The engineer who reviews the pull request | Do the checks prove the plan? |
| Deploy | The pull request | An engineer who did not write the change | Does the diff match the accepted plan, and do the checks pass? |
| Maintain | A new intent when a control band is breached | Product owner, same as any other intent | Is this finding worth a change? |

The author of an intent does not accept it. One person accepts each file. The other may comment.

## Roles

The playbook's names. A roster maps them to people outside this file.

| Role | What they do |
| --- | --- |
| Originator | Describes the problem in their own words. Does not accept the intent. |
| Product owner | Accepts the intent and the spec. Needs no engineering skill. |
| Technical lead | Consulted when a spec is classed as higher risk. Accepts a plan the organization classes as higher risk. The playbook also says tech lead or architect. |
| Engineer | Writes the plan and the code. Accepts a routine plan. Reviews a pull request they did not write. |
| Policy owner | Owns one policy skill. The product owner resolves a flagged concern with them before engineering sees the spec. |
| Service owner | Triages a production finding and routes a product-facing one to the product owner. The playbook also says on-call. |

## Where files live

- Each change: `changes/NNN-short-name/`. The capture-intent skill writes `intent.md` there.
- The draft-spec skill writes `spec.md` in that same folder, only after the intent is on the default branch. `plan.md` joins only after the spec is accepted. Application code stays at the repo root.
- Repo context for agents: `AGENTS.md` and `CLAUDE.md`.
- Repeatable procedures: `.agents/skills/`.
- Later, when they exist: `REVIEW.md` for review passes, `bands.yaml` for control bands.

No application code, frameworks, or tests until the product owner has merged an intent and the plan is accepted. The engineer who wrote the plan accepts a routine one. The technical lead accepts it when the change is classed as higher risk. A closed review is a rejection.

## Plays

Names below are the playbook's menu. The one-line note is how this repo uses each one.

### Plan

- **Capture as intent.** The originator describes the problem in their own words. The capture-intent skill writes a draft. The product owner lists waiting intents with the list-intents skill, then reviews one with the review-intent skill. They write their product answers into the file and approve the exact lines. Merging accepts it and lets Design start. The change is not built yet. Closing the review rejects it. Technical questions stay open for the tech lead. The author and the time come from git history. The file has no status field.

### Design

- **Requirements and design.** The product owner does not write the spec. By hand, they open a session on an accepted intent and the draft-spec skill writes `spec.md` beside it, applies the policy skills that exist, flags concerns, and stops. The review-spec skill shows the exact lines. They resolve each flagged concern with its policy owner before engineering sees the spec. They consult the tech lead when they class the change as higher risk. Merging accepts the spec and lets the plan start. The change is not built yet. Closing the review rejects it. Only after this hand pass does merging `intent.md` start a job that runs draft-spec and opens `spec.md` as a pull request. That job does not exist yet. Policy belongs in skills, applied while the spec is written.

### Build

- **Plan mode.** The write-plan skill runs. The plan shown for acceptance is the text of `plan.md`: files that change, order of work, options not taken, risks, and the proof. Do not show a plan whose job is to create that file later. Acceptance saves that same text. The engineer who wrote it accepts a routine plan. The technical lead accepts it when the change is classed as higher risk. Code starts after that. If implementation departs from the plan, the plan is updated in the same change.
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
- **Managed settings.** Org-wide denies limit what an agent may touch. A repo that has none yet says so in its own context file.
- **CI/CD.** An accepted artifact may start the next job. Production stays behind the human gate.

### Maintain

- **Control bands.** A deterministic check watches one metric. The model does not decide that a band was crossed. A breach can file a new intent, which the product owner still accepts.
- **Recurring scans.** A scheduled finding becomes an intent, or a pull request through the same review gate.
- **On-call intake.** An alert or message can start the same intent path. A person triages it.

## What an agent does next

On a new idea, run capture-intent and stop. When the product owner asks to see intents, run list-intents and stop. When the product owner opens a session on an accepted intent and asks for the spec, run draft-spec and stop. When they review a spec, run review-spec and stop. Do not draft a spec in the same turn as accepting the intent. Do not draft one because the intent merged, until a merge job exists. On an accepted spec with no plan, run write-plan and stop for the engineer who wrote it. Stop for the technical lead instead when the change is classed as higher risk. On an accepted plan, implement only that plan.
