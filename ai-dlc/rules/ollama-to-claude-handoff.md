# Ollama → Claude Code Handoff Checklist

This checklist defines what must be true about a Unit file before it is passed to Claude Code for implementation. It is the contract between the local Ollama pre-coding workflow and the Claude Code coding phase.

The engineer reviews this before opening Claude Code. Claude Code verifies the same criteria at session start.

---

## Unit File Must Have

- [ ] **Status: Open** (not Draft — Draft means elaboration is not finished)
- [ ] **Intent link** — points to an existing intent file
- [ ] **Elaboration link** — points to the session file where ACs were agreed
- [ ] **Purpose** — one sentence, uses domain language from CLAUDE.md Section 4
- [ ] **Acceptance Criteria** — minimum 2 ACs; all in Given/When/Then form; includes at least one unhappy path
- [ ] **Edge Cases section** — explicitly states which EC-001 through EC-010 apply and how, OR states "No edge cases from the standard list apply to this unit"
- [ ] **Out of Scope** — at least one entry (confirms the boundary was discussed)

---

## Before Opening Claude Code

1. All unit files for the Bolt are checked against the list above.
2. No AC uses vague language ("should work", "handles correctly") — each must be falsifiable.
3. Any open questions from the elaboration session are resolved or explicitly deferred with a reason.
4. The backlog entry for each unit is updated to `Open`.

---

## What to Tell Claude Code

When handing a unit to Claude Code, open with:

```
Implement this unit: ai-dlc/ops/build/units/YYYY-MM-DD-<slug>.md

All acceptance criteria and edge cases are captured in that file.
The elaboration context is in the linked elaboration session.
```

Claude Code will enforce its own quality gate (CLAUDE.md Section 2) before generating any code.

---

## What Ollama Does NOT Produce

Do not expect the following from the Ollama phase — Claude Code handles these:

- API endpoint design
- Database schema or migration files
- DTO or domain model definitions
- Test file structure
- Security or RLS policy decisions
- Architecture decisions (which layer owns what)
