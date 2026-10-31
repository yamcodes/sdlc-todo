---
name: capture-intent
description: >-
  Writes a draft intent file for sdlc-todo from the team template. Use when
  someone describes an idea, asks to capture an intent, write intent.md, or
  start a change before a spec or any code.
---

# Capture intent

Write one draft intent and leave `Status: draft`. Do not write a spec, a plan, or application code.

Do not put an author or a time in the file. Both come from git history. Leave `Status: draft`. Maya Shah sets `Status: accepted` later, through the `review-intent` skill, and then merges. She rejects by closing the review.

## Steps

1. If the problem, outcome, users, or constraints are still vague, ask those questions first. Use the originator's words. The problem question is what they cannot do today. "It is missing" is not an answer.
2. Choose the next free number and write `intent/NNN-short-name.md`.
3. Read [TEMPLATE.md](references/TEMPLATE.md) and fill it. Put anything unknown under Open questions. Do not invent it.
4. Set `Status: draft`. Leave it there. Do not add an author line, a decision, or `Status: accepted`.
5. Stop. The originator corrects the file. Maya reviews it with the `review-intent` skill. She sets `Status: accepted` and merges, or she rejects by closing the review and leaving `Status: draft`.

## Problem versus outcome

Problem is the pain in the author's own words: what they cannot do today. Not the implementation, and not the fact that the repo is empty.

A line that only says the app or repo is missing is not a problem. That is true of any empty repo. When the author says that, look at the outcome. If the outcome already names the pain, put that pain under Problem. Leave Proposed outcome as the observable result, not a second copy of the pain.

Bad:

```markdown
## Problem

The entire app is missing.

## Proposed outcome

A basic hello world first, just to see that it is working.
```

Good:

```markdown
## Problem

We need to prove that a basic hello world runs before anyone builds the rest of the app.

## Proposed outcome

A basic hello world, just to see that it is working.
```
