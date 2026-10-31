# Product owner inbox

Living evaluation, not an ADR. Update this file as options enter or leave the hat. Promoted decisions belong in `docs/adr/`.

**Status:** working note. **Chosen public story:** A1 + B3.

## Problem

Maya Shah can see every intent that is waiting for her, understand what she is approving, and accept or reject it without learning git. When she accepts, `intent.md` stays beside the later `spec.md` and `plan.md` for that change. The merge is still the acceptance. Closing the review is still the rejection. A second list must not be able to disagree with the pull requests.

## Layer map

- **Layout:** where `intent.md`, `spec.md`, and `plan.md` live. Items here are substitutes.
- **Queue:** how Maya sees what is waiting. Items here are substitutes. A queue composes with a layout.

## Metrics

| Metric | Question |
| ------ | -------- |
| Alongside | Does `intent.md` stay next to `spec.md` and `plan.md` for the life of the change? |
| One decision | Is the merge the only acceptance, and the closed review the only rejection? |
| Playbook fit | Does this match a watched home, a merge-or-close decision, and a non-engineer who does not have to use git? |
| Maya's load | Can she see the queue and decide without learning the Pull Requests tab? |
| Maintenance | Does a third change, or a spec that is also in review, still have one obvious place to look? |
| Honesty | Can she tell a waiting intent from an accepted intent, and from a spec that is in review? |

## The hat

### Layout

| # | Option | Notes |
| - | ------ | ----- |
| A1 | `changes/NNN-short-name/` holds `intent.md`, then `spec.md`, then `plan.md` | Current tree. Files stay beside each other. |
| A2 | Top-level `intent/`, `spec/`, and `plan/` as separate folders | User option 3. |
| A3 | Drafts live in `intent/` on `main`. Accepting moves the file into `changes/NNN/` | Retracted. Breaks alongside. |
| A4 | `intent/NNN/` holds `intent.md`, `spec.md`, and `plan.md` | developertoolkit.ai. The folder is named intent and also holds the spec and the plan. |
| A5 | One `intent.md`, one `spec.md`, and one `plan.md` at the repo root | bashebr's expense tracker. Fine for a single change. |

### Queue

| # | Option | Notes |
| - | ------ | ----- |
| B1 | Teach Maya the Pull Requests tab. Add an `intent` label and an automatic labeler | User option 1. |
| B2 | A separate inbox folder, encoded in the skill, distinct from `changes/` | User option 2. Same idea as A3. |
| B3 | A skill that lists open intent pull requests, then hands one file to `review-intent` | User option 4, skill half. The pull request stays the record. |
| B4 | An MCP or localhost product-owner dashboard | User option 4, dashboard half. |
| B5 | She looks only at an `intent/` folder on `main` | The playbook's "folder she watches," read on its own. |
| B6 | No queue. She asks an engineer what is waiting | Out of scope. Scored so it does not return later. |

## Evaluation

**A1 change folder** — Alongside holds: the spec and the plan are born in the same folder as the intent. One decision holds, because nothing about the path is an acceptance. Playbook fit is strong on "commit the spec alongside the intent" and weaker on the sentence that names the home `intent/`. Maya's load is unchanged; layout does not show her a queue. Maintenance holds at change 003. Honesty holds once the queue tells her which folders are still on a branch. This is what [ghiaog123/ai-native-sdlc](https://github.com/ghiaog123/ai-native-sdlc) does with `examples/rate-limit/` and `.sdlc/<change>/`, and what the playbook's plan snippet implies by naming code paths outside the markdown.

**A2 separate folders** — Alongside fails. `intent/003.md` and `spec/003.md` can drift, and a reader has to know the number is the join. One decision can still be the merge. Playbook fit is the weakest of the layouts, because the playbook's only placement rule is that the spec sits beside the intent. Maya's load is worse: three folders, and she still cannot see which file is waiting. Maintenance gets a new empty file to keep in sync for every stage. Honesty fails when `intent/003.md` is on `main` and `spec/003.md` is on a branch.

**A3 move on accept** — Alongside fails at the moment of acceptance, which is when the spec is about to be written. One decision splits into "it is in the inbox" and "it was moved." Playbook fit misses both the alongside rule and the single merge. Maya's load is good while the draft sits in `intent/`. Maintenance is a rename on every accept, and git history of the path breaks unless every tool remembers the move. Honesty is good before the move and confusing during it.

**A4 intent folder per change** — Alongside holds, inside a folder named `intent`. One decision holds. Playbook fit is the literal reading of "an `intent/` folder" plus alongside. Maya's load is the same gap as A1. Maintenance holds. Honesty has the same branch problem as A1. The name is the part we already found weird: the folder is called intent and then contains a spec and a plan. developertoolkit.ai documents this layout. Anthropic does not.

**A5 repo root** — Alongside holds for one change and fails on the second, because there can be only one `intent.md`. bashebr's expense tracker is this shape. Out of scope for this repo once 002 exists.

**B1 teach the Pull Requests tab** — Alongside is not this layer. One decision is exact: the tab is the merge and the close. Playbook fit is the governance sentence. The playbook also says a person who does not use git should not have to. Maya's load is the highest of the real options. Labels and an auto-labeler lower the noise and add a machine that must keep the label true. Maintenance is a labeler plus a lesson that has to be retaught. Honesty is good if the filter is right, and bad if a spec review and an intent review share one list and the label is missing.

**B2 separate inbox folder** — This is A3 as a queue. One decision fails, because the folder and the pull request can disagree. Playbook fit misses alongside as soon as the accepted file leaves the inbox. Maya's load is good. Maintenance is two homes. Honesty looks good in the inbox and lies if a closed pull request leaves the file behind.

**B3 list skill** — Alongside is inherited from the layout. One decision holds: the skill reads open pull requests and does not keep its own list. Playbook fit is the connector the playbook already asks for, pointed at the reviews she owns. Maya's load is the lines of each intent and a choice, which `review-intent` already does for one file. Maintenance is one skill that calls `gh pr list`. Honesty holds if the skill says "intent" and "spec" as different waits, and if it refuses to invent a request that `gh` did not return.

**B4 dashboard** — One decision holds only while the page is a view of the pull requests. The moment it stores its own "approved" mark, honesty fails. Playbook fit is ahead of anything Anthropic or the community kits show. Maya's load is the best surface and the most machinery. Maintenance is a localhost app, an MCP, or both, for a queue that is already a pull request list. Not required to close this gap.

**B5 folder on main** — Alongside depends on A4 or A2. One decision fails if a file on `main` is still a draft, because we removed the status field. The playbook's example says `Status: draft` inside the file, and its governance says the merge is the decision. A folder of drafts on `main` needs one of those, and we kept the merge. Maya's load is good. Honesty fails without a status field: everything in the folder looks the same.

**B6 ask an engineer** — Maya's load is a meeting. One decision still happens later, in a pull request she did not see. This is the traditional handoff the playbook is replacing.

## Tier list

**S**

- **A1 + B3** — Files for one change stay in `changes/NNN-short-name/`. Maya's queue is a skill that lists open intent pull requests and then runs `review-intent` on the one she picks. The Pull Requests tab remains the record. This is the best bridge, and it is the stack most aligned with the playbook: alongside, the merge, and a connector for someone who does not use git. The closest public implementation is ghiaog123's change folder plus `/ai-sdlc-status`, which reports where a change sits. We do not need that plugin.

**A**

- **A1 + B1** — Same files. Maya uses the Pull Requests tab herself, filtered by an `intent` label. Aligned with the playbook's merge. Higher load. Ship only if she wants GitHub. The labeler is not required for B3.
- **B4 on top of A1 + B3** — A dashboard that renders the same pull requests. Optional later. Do not build it to close this gap.

**B**

- **A4 + B5** — Matches the playbook's folder name and fails the no-status rule. The weird folder name returns.

**C**

- **A3 + B2** — A real inbox, and the intent leaves its spec behind when she accepts.

**D**

- **A2 with any queue** — The spec is not beside the intent.
- **A5** — One change only.
- **B6** — She never sees the queue.

## S and A usage

### Use case 1: two intents waiting, and a spec in review

**S:**

```text
Maya asks what is waiting.
The skill runs gh pr list and says:
  1. changes/002-due-dates/intent.md — open
  2. changes/003-shared-lists/intent.md — open
It does not list the spec review for 001 as an intent.
She picks 2. review-intent quotes that file and offers
accept, reject, or not yet.
```

**A (B1):**

```text
Maya opens Pull Requests, filters label:intent, and sees 002 and 003.
She still has to read the diff and click merge, or hand that to the skill.
```

**A (B4):**

```text
A local page shows the same two rows the skill would print.
Accept still merges the pull request. The page stores nothing.
```

### Use case 2: she accepts one

**S:**

```text
She picks Accept on 003.
The skill merges that pull request.
main gains changes/003-shared-lists/intent.md.
spec.md does not exist yet. The folder is the change, not an inbox.
```

**A (B1):**

```text
She clicks Merge on the filtered pull request. Same result on main.
```

### Use case 3: she rejects one

**S:**

```text
She picks Reject on 002.
The skill closes the pull request without merging.
changes/002-due-dates/ never appears on main.
The closed review is the rejection.
```

**A (B1):**

```text
She closes the pull request herself. Same result.
```

## Current lean

A1 is the tree. B3 is the `list-intents` skill. Do not add a labeler, a dashboard, a second inbox folder, or separate `intent/` and `spec/` trees to close this.

The playbook's `intent/` folder and the Pull Requests tab are the same idea only after the merge. Before the merge, the tab is the queue. The skill is how Maya reads that tab.

## Changelog of this note

- 2026-10-31: First write-up. Layout and queue scored separately. S is A1 + B3.
- 2026-10-31: B3 is the `list-intents` skill. "All intents" includes accepted files on the default branch. "Open intents" is only open pull requests that touch `intent.md`.
