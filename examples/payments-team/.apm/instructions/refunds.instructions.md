---
description: Refund conventions maintained by the payments team
applyTo: "src/**/refund*.ts"
---

- Return Result<T,E> for expected failures.
- Require an idempotency key for each refund request.
- Return the original refund when the same key and payload are retried.
- Reject a reused key if the payment or amount differs.
- Verify that two identical requests create exactly one refund.
