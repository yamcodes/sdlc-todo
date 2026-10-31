---
name: review-intent
description: >-
  Walks Maya Shah through a draft intent before she merges it. Use when she
  reviews an intent, answers its open questions, or is ready to accept or
  reject intent/NNN-short-name.md.
---

# Review intent

Help Maya Shah review one draft intent. Do not accept it for her. Do not merge. Do not write a spec, a plan, or application code.

## Steps

1. Read the intent, [the intent template](../capture-intent/references/TEMPLATE.md), and the Plan section of [the playbook notes](../../references/ai-native-sdlc.md).
2. Check the draft. `Status` is `draft`. Problem is what someone cannot do today, in the originator's words. "The app is missing" is not a problem. Proposed outcome is observable, and is not a second copy of the problem. Users and constraints are filled in, or they are open questions.
3. Split the open questions. Product questions are Maya's: who it is for, what working or success looks like, and what is in or out. Technical questions stay open for Leo Martins, including stack, files, and libraries.
4. Tell Maya, in plain language, what is solid, which questions are hers, and which stay open. Stop and wait for her words.
5. When she answers a product question, write that answer into the file. Put what success looks like under Proposed outcome. Delete the open question she answered. Leave Leo's questions in place.
6. Set `Status: accepted` only after she explicitly says she accepts, and only after her product questions are answered or she explicitly leaves one open. Then stop. She merges.
7. If she rejects, leave `Status: draft` and stop. She closes the review.

Do not add an author, a date, or a Decision section. Git history holds the author and the time.
