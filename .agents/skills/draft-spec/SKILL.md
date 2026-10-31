---
name: draft-spec
description: >-
  Writes spec.md from an accepted intent. Use when the product owner asks to
  draft a spec, write spec.md, or turn an accepted intent into a requirements
  and design spec.
---

# Draft spec

Write one requirements and design spec from an accepted intent. The product owner does not write it. Do not write a plan or application code. Do not accept the spec.

Do not put an author, a time, or a status in the file. The author and the time come from git history. The product owner chooses accept or reject in the `review-spec` skill.

This is the hand pass. Do not open a pull request. A merge job, once it exists, runs these same steps and opens `spec.md` as a pull request. That job does not exist until this pass has been codified. Do not draft a spec in the same turn as accepting the intent, and do not draft one only because the intent merged.

## Steps

1. The intent must be `changes/<name>/intent.md` on the default branch. If it is only in the working tree, or only in an open review, stop. Say that it is not accepted.
2. Read that intent and [TEMPLATE.md](references/TEMPLATE.md). Read the skills available in this repo. Brand, security, compliance, and UX skills constrain the spec. If none of those exist, say so under Constraints applied. Do not invent a policy.
3. Write `spec.md` in that same change folder. Answer an open question only when the intent or the codebase already answers it. Carry the rest forward. Do not drop an intent question by staying silent.
4. Under Flagged concerns, name any constraint or policy the spec cannot satisfy, and any two policies that contradict. Write "None" when there are none. Do not hide a concern inside Behavior.
5. Do not add an author line, a date, a decision, or a status. Do not add `plan.md`.
6. Stop. The product owner reviews the file with the `review-spec` skill. That skill shows the exact lines, asks them to accept or reject, then merges or closes the review.
