---
name: write-plan
description: >-
  Turns an accepted spec into plan.md. Use when an engineer starts plan mode,
  asks for an implementation plan, or is about to write plan.md. The plan
  shown for acceptance is the file. Do not plan to create the file later.
---

# Write plan

Write one implementation plan for one accepted spec. Do not write application code.

The engineer who writes the plan accepts a routine plan. The technical lead accepts it only when the change is classed as higher risk. Do not send every plan to the technical lead.

Cursor plan mode and Claude plan mode both show a plan before they can edit files. That shown plan is the text of `plan.md`. It is not a plan about writing `plan.md`.

## Steps

1. Read `changes/<name>/intent.md` and `spec.md`. The spec must be accepted. If it is not, stop.
2. Decide the files, the order of work, the risks, the proof, and the options not taken. Ask what the change could break, which step is most risky, and which options were not chosen.
3. The plan you show is only these sections, in this order: a title, Files that change, Order of work, Not chosen, Risks, Proof. No author, date, or status.
4. Do not add a section, a code fence, or a todo whose job is to create `plan.md` later. Do not paste a second copy of the plan inside the plan.
5. When the engineer accepts a routine plan, or the technical lead accepts a higher-risk one, save that same text as `changes/<name>/plan.md`. Change nothing in the wording. Stop. Do not implement.
6. If implementation later departs from the plan, update `plan.md` in the same change.
