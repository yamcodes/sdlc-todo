---
name: review-intent
description: >-
  Walks the product owner through a draft intent, shows the exact lines that
  will be saved, then a multiple-choice decision. Use when they review an
  intent, answer its open questions, or are ready to accept or reject it.
  Accepting lets Design start and merges only when git will record Maya Shah.
  Rejecting closes the review under that same name.
---

# Review intent

Help the product owner review one draft intent. Do not decide for them. Do not write a spec, a plan, or application code.

The product owner is not technical. Do not ask them to run git, open a pull request, or click merge. Show the exact lines, then the choice, then wait. Their pick is the request.

The file has no status. Merging the review accepts the intent and lets Design start. The page is not built. Closing the review rejects the intent.

Git history holds the approval. The merge or the close must be recorded as Maya Shah. Do not change git config to make that true. Do not write her name into the file.

## Steps

1. Read the intent and [the intent template](../capture-intent/references/TEMPLATE.md).
2. Check the draft. Problem is what someone cannot do today, in the originator's words. "The app is missing" is not a problem. Proposed outcome is observable, and is not a second copy of the problem. Users and constraints are filled in, or they are open questions. Do not add a status.
3. Split the open questions. Product questions belong to the product owner: who it is for, what working or success looks like, and what is in or out. Technical questions stay open for the tech lead, including stack, files, and libraries.
4. Tell the product owner, in plain language, what is solid, which questions are theirs, and which stay open. Stop and wait for their words.
5. When they answer a product question, write that answer into the file. Put what success looks like under Proposed outcome. Delete the open question they answered. Leave the tech lead's questions in place.
6. When their product questions are answered, or they explicitly leave one open, quote the intent file in the message before any choice. These are the exact lines that will be saved. Include the Proposed outcome in that quote. Do not paraphrase those lines, and do not replace the quote with a summary.
7. Then show a multiple-choice prompt and wait. Use the AskQuestion tool when you have it. The choices are:
   - Accept this intent. Design can start.
   - Reject and leave it a draft
   - Don't decide yet
   A clear yes or no counts only after the exact lines and this prompt are on screen. Do not treat an earlier message as the pick.
8. If they pick Accept or Reject, check the name git will record and the GitHub account that will merge or close. Both must be Maya Shah. If either is someone else, or you cannot see the name, stop. Tell her this session would save her decision under another name, so the review stays open. Do not commit. Do not merge. Do not close.
9. If they pick Accept and both names are Maya Shah: commit the intent file if this review changed it, push the branch, and merge it into `main`. If a pull request is already open for the branch, merge that. If none is open, open one into `main` and merge it in the same step. Tell her, in one plain sentence, that Design can start and the page is not built yet. Include the link. Stop. Do not draft a spec.
10. If they pick Reject and both names are Maya Shah: do not add a status. If a pull request is open, close it without merging. Tell her it stays a draft. Stop.
11. If they pick Don't decide yet, stop and keep reviewing. Nothing is merged, and the review stays open.

Do not add an author, a date, a Decision section, or a status. The merge or the closed review holds the decision, and only when that history names Maya Shah.
