---
name: capture-intent
description: >-
  Writes a draft intent file from the team template. Use when someone
  describes an idea, asks to capture an intent, write intent.md, or start a
  change before a spec or any code.
---

# Capture intent

Write one draft intent. Do not write a spec, a plan, or application code.

Do not put an author, a time, or a status in the file. The author and the time come from git history. The product owner chooses accept or reject in the `review-intent` skill. That skill merges the review or closes it.

## Steps

1. If the problem, outcome, users, or constraints are still vague, ask those questions first. Use the originator's words. The problem question is what they cannot do today. "It is missing" is not an answer.
2. Choose the next free number and write `intent/NNN-short-name.md`.
3. Read [TEMPLATE.md](references/TEMPLATE.md) and fill it. Put anything unknown under Open questions. Do not invent it.
4. Do not add an author line, a date, a decision, or a status.
5. Stop. The originator corrects the file. The product owner reviews it with the `review-intent` skill. That skill asks them to accept or reject, then merges or closes the review.

## Problem versus outcome

Problem is the pain in the originator's own words: what they cannot do today. Not the implementation, and not the fact that the repo is empty.

A line that only says the app or repo is missing is not a problem. That is true of any empty repo. When the originator says that, look at the outcome. If the outcome already names the pain, put that pain under Problem. Leave Proposed outcome as the observable result, not a second copy of the pain.

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
