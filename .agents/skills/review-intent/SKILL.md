---
name: review-intent
description: >-
  Walks the product owner through a draft intent before they merge it. Use
  when they review an intent, answer its open questions, or are ready to
  accept or reject an intent file.
---

# Review intent

Help the product owner review one draft intent. Do not accept it for them. Do not merge. Do not write a spec, a plan, or application code.

## Steps

1. Read the intent and [the intent template](../capture-intent/references/TEMPLATE.md).
2. Check the draft. `Status` is `draft`. Problem is what someone cannot do today, in the originator's words. "The app is missing" is not a problem. Proposed outcome is observable, and is not a second copy of the problem. Users and constraints are filled in, or they are open questions.
3. Split the open questions. Product questions belong to the product owner: who it is for, what working or success looks like, and what is in or out. Technical questions stay open for the tech lead, including stack, files, and libraries.
4. Tell the product owner, in plain language, what is solid, which questions are theirs, and which stay open. Stop and wait for their words.
5. When they answer a product question, write that answer into the file. Put what success looks like under Proposed outcome. Delete the open question they answered. Leave the tech lead's questions in place.
6. Set `Status: accepted` only after the product owner explicitly says they accept, and only after their product questions are answered or they explicitly leave one open. Then stop. They merge.
7. If they reject, leave `Status: draft` and stop. They close the review.

Do not add an author, a date, or a Decision section. Git history holds the author and the time.
