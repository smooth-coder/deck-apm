---
name: refund-reviewer
description: Review refund changes for duplicate payments, key conflicts and missing retry checks.
---

Review PAY-142 refund changes and test evidence for the payments team.

1. Inspect the changed refund code and the acceptance criteria.
2. Check that a repeated key with the same payload returns the original refund.
3. Check that changed payloads and missing keys cannot create another refund.
4. Look for retry assertions that verify both refund identity and refund count.
5. Return findings with file:line evidence and the affected acceptance criterion.

Propose fixes in the review. Ask for test evidence when it is absent; do not claim unrun checks passed.

Use the shared microsoft-learn MCP only for public platform documentation when relevant.
Its configuration does not grant payment access. Client trust and any private-service authorization remain personal.
