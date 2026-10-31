---
name: review-spec
description: >-
  Walks the product owner through a draft spec, shows the exact lines that
  will be saved, then a multiple-choice decision. Use when they review a spec,
  resolve a flagged concern, or are ready to accept or reject it. Accepting
  lets the plan start and merges the review. Rejecting closes it.
---

# Review spec

Help the product owner review one draft spec. Do not decide for them. Do not write a plan or application code.

The product owner is not technical. Do not ask them to run git, open a pull request, or click merge. Show the exact lines, then the choice, then wait. Their pick is the request. After they pick, you merge or close the review from the session they are in.

The file has no status. Merging the review accepts the spec and lets the plan start. The change is not built yet. Closing the review rejects the spec.

The product owner accepts the spec. The tech lead is consulted only when the product owner says the organization classes the change as higher risk. That consultation is not a second acceptance.

## Steps

1. Read the spec, the `intent.md` in the same change folder, and [the spec template](../draft-spec/references/TEMPLATE.md). If that intent is not on the default branch, stop. Say that the intent is not accepted.
2. Check the draft. Solves is the intent's proposed outcome and how this design meets it, not a second copy of the problem. Behavior is what the affected users can do, not a file list and not an implementation plan. Every open question from the intent is answered in the spec or carried forward. Flagged concerns are explicit. Constraints applied names the policy skills that were applied, or says that none exist. Do not add a status.
3. Tell the product owner, in plain language, what is solid, which flagged concerns they must resolve with the policy owner, and which questions stay open for the tech lead. Stop and wait for their words.
4. When they resolve a flagged concern, write that resolution into the spec and remove or update the concern. Do not invent a policy owner's answer. A concern they explicitly leave open stays under Flagged concerns.
5. When the concerns are resolved or explicitly left open, ask whether the organization classes this change as higher risk. If they say yes, stop and wait for the tech lead. Do not show the accept choice yet. When the tech lead's answer changes the spec, write that answer into the spec.
6. When the higher-risk question is settled, quote the spec file in the message before any choice. These are the exact lines that will be saved. Include Solves and Flagged concerns in that quote. Do not paraphrase those lines, and do not replace the quote with a summary.
7. Then show a multiple-choice prompt and wait. Use the AskQuestion tool when you have it. The choices are:
   - Accept this spec. The plan can start.
   - Reject and leave it a draft
   - Don't decide yet
   A clear yes or no counts only after the exact lines and this prompt are on screen. Do not treat an earlier message as the pick.
8. If they pick Accept: commit the spec file if this review changed it. If this work is on the default branch, commit it on a new branch first. Push the branch and merge it into the default branch. If a pull request is already open for the branch, merge that. If none is open, open one and merge it in the same step. Tell them, in one plain sentence, that the plan can start and the change is not built yet. Include the link. Stop. Do not draft a plan.
9. If they pick Reject: do not add a status. If a pull request is open, close it without merging. Tell them it stays a draft. Stop.
10. If they pick Don't decide yet, stop and keep reviewing. Nothing is merged, and the review stays open.

Do not add an author, a date, a Decision section, or a status. Git history holds the author and the time. The merge or the closed review holds the decision.
