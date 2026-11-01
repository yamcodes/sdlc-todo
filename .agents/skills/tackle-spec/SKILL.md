---
name: tackle-spec
description: >-
  An engineer picks up an accepted spec. Use when they tackle a spec, take a
  spec, ask for an implementation plan, or are about to write plan.md. Switch
  this session to plan mode before planning. Do not change the default mode.
---

# Tackle spec

Pick up one accepted spec and plan it. Do not write application code. Do not turn plan mode on for any other session, and do not set a project or user default.

The engineer who writes the plan accepts a routine plan. The technical lead accepts it only when the change is classed as higher risk. Do not send every plan to the technical lead.

The plan shown for acceptance is the text of `plan.md`. It is not a plan about writing `plan.md`.

## Steps

1. Switch this session to plan mode before reading the spec or drafting. In Cursor, request the mode switch. In Claude Code, use plan mode for this session only. If the session is still not in plan mode, stop. Do not plan in agent mode.
2. Read `changes/<name>/intent.md` and `spec.md`. The spec must be accepted. If it is not, stop.
3. Decide the files, the order of work, the risks, the proof, and the options not taken. Ask what the change could break, which step is most risky, and which options were not chosen.
4. The plan you show is only these sections, in this order: a title, Files that change, Order of work, Not chosen, Risks, Proof. No author, date, or status.
5. Do not add a section, a code fence, or a todo whose job is to create `plan.md` later. Do not paste a second copy of the plan inside the plan.
6. When the engineer accepts a routine plan, or the technical lead accepts a higher-risk one, save that same text as `changes/<name>/plan.md`. Change nothing in the wording. Stop. Do not implement.
7. If implementation later departs from the plan, update `plan.md` in the same change.
