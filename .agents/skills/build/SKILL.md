---
name: build
description: >-
  An engineer turns an accepted spec into plan.md and then implements that
  plan. Use when they tackle a spec, ask for an implementation plan, or are
  ready to build after the plan is accepted. Switch this session to plan mode
  before planning. Do not change the default mode.
---

# Build

One accepted spec. Two phases in this session. Plan first, then code. Do not turn plan mode on for any other session, and do not set a project or user default.

The engineer who writes the plan accepts a routine plan. The technical lead accepts it only when the change is classed as higher risk. Do not send every plan to the technical lead.

The plan shown for acceptance is the text of `plan.md`. It is not a plan about writing `plan.md`.

## Plan

1. Switch this session to plan mode before reading the spec or drafting. In Cursor, request the mode switch. In Claude Code, use plan mode for this session only. If the session is still not in plan mode, stop. Do not plan in agent mode.
2. Read `changes/<name>/intent.md` and `spec.md`. The spec must be accepted. If it is not, stop.
3. Draft the plan with only these sections, in this order: a title, Files that change, Order of work, Not chosen, Risks, Proof. No author, date, or status.
4. Interrogate that plan before anyone accepts it. Ask what the change could break, which step is most risky, and which options were not chosen. Revise the plan from the answers. Repeat until an engineer who never saw the conversation could implement it from the plan alone.
5. Do not add a section, a code fence, or a todo whose job is to create `plan.md` later. Do not paste a second copy of the plan inside the plan.
6. Stop. Ask the engineer, for a routine plan, or the technical lead, for a higher-risk one, whether this plan matches the approach. Wait. A request to continue is not acceptance.
7. When they accept, save that same text as `changes/<name>/plan.md` and commit it before any code. Change nothing in the wording. If `plan.md` is not committed, stop. Leave plan mode for this session only. Do not change the default mode.

## Code

8. Start only after that commit. Implement the plan in its accepted order. Do not add application code the plan does not name.
9. If implementation departs from the plan, update `plan.md` in the same commit, including why. If the departure changes the files, the order, or the proof, stop and ask before continuing.
10. Stop when the code matches the plan. Do not merge, and do not start the test or deploy review.
