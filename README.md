# sdlc-todo

A dummy TODO app for practicing the AI-native SDLC on one product. There is no application code yet. That is intentional.

## People

| Name | Role | Accepts | Question they answer |
| --- | --- | --- | --- |
| Maya Shah | Product manager | `intent.md`, then the product half of `spec.md` | Does this solve the right problem? |
| Leo Martins | Tech lead | The technical half of `spec.md`, then `plan.md` | Is this safe to build, and does the plan prove it? |
| Sam Okonkwo | Engineer | A pull request he did not write | Does the diff match the accepted plan, and do the checks pass? |
| Nora Berg | Engineer | A pull request she did not write | Does the diff match the accepted plan, and do the checks pass? |
| Amir Haddad | Engineer | A pull request he did not write | Does the diff match the accepted plan, and do the checks pass? |

Maya and Leo both own the product. They accept different artifacts. One person accepts each file. The other can comment, and does not add a second approval on the same file.

## One repo

Intent, spec, plan, and code live here. A second repo is for when one intent has to land in several products. This app is one product.

## What you do first

1. Describe the idea and ask for an intent. The `capture-intent` skill in `.agents/skills/capture-intent/` writes `intent/NNN-short-name.md` from `references/TEMPLATE.md`.
2. The person who had the idea corrects anything the draft got wrong. It stays `Status: draft`.
3. Maya accepts or rejects it. Record that at the bottom of the file, then commit.
4. Only after that does an agent draft `spec.md`.
5. Leo accepts a plan before any application code is written.
