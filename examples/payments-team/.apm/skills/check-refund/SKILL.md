---
name: check-refund
description: "Trigger: refund endpoint, duplicate refund, payment retry. Verify idempotency against the team's acceptance criteria."
license: MIT
metadata:
  author: payments-team
  version: "1.0.0"
---

## Activation Contract

Use when implementing or reviewing refund creation or retry behavior.

## Hard Rules

- Use isolated test data and a local or sandbox payment adapter.
- Assert refund identity and the number of recorded refunds, not only HTTP success.

## Decision Gates

- Same key and payload: return the existing refund.
- Same key with a different payment or amount: return a conflict without another refund.
- Missing key: reject the request without a refund.

## Execution Steps

1. Read the refund entry point and the repository's test command.
2. Submit one valid refund; retain its identifier and the recorded refund count.
3. Retry the identical request. Assert the same identifier and one recorded refund.
4. Reuse the key with changed payment and amount in separate cases; assert rejection and unchanged count.
5. Send a request without a key; assert rejection and no new refund.
6. Run the relevant checks and report their actual outcomes.

## Output Contract

Return each acceptance criterion, pass/fail status, executed command and evidence. Mark unexercised criteria explicitly.
