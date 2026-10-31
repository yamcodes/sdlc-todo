# sdlc-todo

A dummy TODO app for practicing the AI-native SDLC on one product. There is no application code yet. That is intentional.

Working notes for the playbook live in `.agents/references/ai-native-sdlc.md`. `AGENTS.md` and `CLAUDE.md` point agents there. The official article stays at [The AI-native SDLC playbook](https://claude.com/resources/articles/the-ai-native-sdlc-playbook).

## People

| Name | Role | Accepts | Question they answer |
| --- | --- | --- | --- |
| Maya Shah | Product manager | `intent.md`, then `spec.md` | Does this solve the right problem? |
| Leo Martins | Tech lead | A spec Maya classes as higher risk, then `plan.md` | Is this higher-risk spec sound, and does the plan prove it? |
| Sam Okonkwo | Engineer | A pull request he did not write | Does the diff match the accepted plan, and do the checks pass? |
| Nora Berg | Engineer | A pull request she did not write | Does the diff match the accepted plan, and do the checks pass? |
| Amir Haddad | Engineer | A pull request he did not write | Does the diff match the accepted plan, and do the checks pass? |

Maya and Leo both own the product. They accept different artifacts. One person accepts each file. The other can comment, and does not add a second approval on the same file.

## One repo

Each change lives in `changes/NNN-short-name/`, starting with `intent.md`. `spec.md` and `plan.md` join that folder after their gates. Application code stays at the repo root. A second repo is for when one intent has to land in several products. This app is one product.

## What you do first

1. Describe the idea and ask for an intent. The `capture-intent` skill in `.agents/skills/capture-intent/` writes `changes/NNN-short-name/intent.md` from `references/TEMPLATE.md`.
2. The person who had the idea corrects anything the draft got wrong. The author and the time come from git history. The file has no status field.
3. Maya asks to see all intents, or all open intents. The `list-intents` skill in `.agents/skills/list-intents/` reads the pull requests and the default branch. She reviews one file with the `review-intent` skill in `.agents/skills/review-intent/`. She writes her answers into the file. Merging accepts it. Closing the review rejects it.
4. Maya opens a session on the accepted intent and asks for the spec. The `draft-spec` skill in `.agents/skills/draft-spec/` writes `changes/NNN-short-name/spec.md` and stops. She reviews that file with the `review-spec` skill in `.agents/skills/review-spec/`. She does not write it. Merging accepts it. Closing the review rejects it. Leo is consulted when she classes the change as higher risk. A merge-triggered spec job comes only after this hand pass.
5. Leo accepts a plan before any application code is written.
