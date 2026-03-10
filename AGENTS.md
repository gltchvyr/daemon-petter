# AGENTS.md

## Gl!tch Coding Ethos

This file defines the cross-repo working style, design philosophy, and behavioral expectations for agents contributing to Gl!tch projects.

These repositories are not meant to become generic productivity sludge.
They should remain functional, legible, atmospheric, and slightly strange in ways that still serve the user.

## Core rules

1. Make it work.
2. Make it cleaner.
3. Make it strange in a useful way.

Function comes first.
Clarity matters.
Delight matters.
Tone matters.
Sterility is not a virtue.

## Project character

Gl!tch projects often combine:
- playful interactivity
- strong visual atmosphere
- readable engineering
- emotionally legible UI text
- mythic, liminal, or mischievous flavor
- recursive or symbolic motifs
- small moments of surprise or delight

Do not flatten these qualities into generic app language unless explicitly asked.

## Primary priorities

When making changes, optimize for:
- correctness
- clarity
- maintainability
- deployability
- aesthetic cohesion
- emotional texture
- low-friction local setup

Prefer simple, robust solutions over clever, brittle ones.

## Coding style

- Prefer readable code over impressive-looking code.
- Prefer explicit logic over hidden magic.
- Prefer small helper functions over duplicated behavior.
- Prefer local clarity over premature abstraction.
- Keep components understandable to a human editing manually.
- Keep state changes legible.
- Minimize dependency sprawl.
- Avoid introducing backend requirements unless clearly necessary.

## UI / UX style

Gl!tch interfaces should generally feel:
- dark or high-contrast
- cohesive
- responsive
- slightly theatrical
- slightly mischievous
- readable first, adorned second

Animation should feel intentional, not noisy.
Visual flair should support the experience, not bury it.
Interactions should be lightweight, satisfying, and clear.

## Tone rules

User-facing text may be playful, mythic, warm, mischievous, or daemon-coded,
but it must remain understandable.

Preserve:
- charm
- specificity
- warmth
- weirdness with purpose
- emotional readability

Avoid:
- generic placeholder app copy
- sterile corporate phrasing
- random lore with no functional role
- jokes that reduce usability
- overexplaining simple interactions

## Change philosophy

When modifying a project:

1. Preserve the core user experience.
2. Preserve the project’s personality.
3. Improve clarity where possible.
4. Avoid unnecessary rewrites.
5. Do not replace functioning systems just to make them trendier.
6. Refactor only when it improves maintainability, clarity, or real usability.

Do not confuse abstraction with improvement.

## Repo hygiene

Agents should:
- keep repo roots clean
- use `.gitignore` appropriately
- preserve working build/deploy setup
- avoid needless file churn
- keep README instructions accurate
- keep setup friction low

Do not commit:
- `node_modules`
- build artifacts
- local cache folders
- secrets
- private environment files
- generated clutter unless explicitly intended

## Dependency policy

Before adding a dependency, ask:
- Does this solve a real problem?
- Is plain React, CSS, or JavaScript enough?
- Does this increase setup friction?
- Will this make future edits harder?
- Is the gain worth the weight?

Prefer fewer dependencies when reasonable.

## Deployment expectations

Projects should remain easy to:
- run locally
- build predictably
- deploy with minimal ceremony

Default preference:
- frontend/static projects should remain deployable on Vercel or similarly simple platforms
- avoid unnecessary infrastructure complexity
- preserve working defaults unless there is a real need to change them

## Safe changes

Usually safe:
- copy polish
- UI refinement
- accessibility improvements
- responsiveness improvements
- animation tuning
- small feature additions
- README improvements
- cleanup without behavior change

Use caution with:
- build configuration
- deployment configuration
- routing structure
- state architecture
- dependency changes
- persistence/storage logic
- major visual overhauls
- anything that risks flattening tone or breaking delight

## Forbidden failure modes

Do not:
- make the codebase harder to run without good reason
- replace project voice with generic template text
- overengineer small toys into brittle systems
- add unnecessary complexity in the name of professionalism
- remove symbolic or aesthetic texture that is part of project identity
- break local development for minor visual gains
- make Gl!tch boring

## Notes for future agents

If you change the text, preserve the voice.
If you change the visuals, preserve the atmosphere.
If you change the mechanics, preserve delight.
If you change the structure, preserve legibility.
If you add magic, make sure it still runs locally.