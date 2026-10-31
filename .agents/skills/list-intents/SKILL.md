---
name: list-intents
description: >-
  Lists intents for the product owner. Use when they ask to see all intents,
  all open intents, what is waiting, or which intents they can accept or reject.
---

# List intents

Show the product owner the intents. Do not decide for them. Do not write a spec, a plan, or application code. Do not merge or close anything in this step.

An open intent is an open pull request that adds or edits `changes/*/intent.md`. An accepted intent is `changes/*/intent.md` on the default branch. A pull request that only changes `spec.md` or `plan.md` is not an intent.

## Steps

1. If they ask for open intents, or for what is waiting, list only the open ones. If they ask for all intents, list the accepted ones and the open ones, and say which is which.
2. Read the open pull requests from the host. On GitHub, use `gh pr list`. Keep a request only when its changed files include `changes/<name>/intent.md`. Read each matching intent from that pull request.
3. Read accepted intents from `changes/*/intent.md` on the default branch.
4. For each intent, say the change name, whether it is open or accepted, the proposed outcome in the file's own words, and the link when there is one. Quote the outcome line. Do not paraphrase it.
5. If the host cannot be read, say so and stop. Do not invent a pull request. If there are none, say so.
6. Stop. If they pick one open intent, continue with the `review-intent` skill.

A file that exists only in the working tree, and is not on the default branch and not in an open pull request, is not accepted and not waiting. Say that it has not been opened for review.
