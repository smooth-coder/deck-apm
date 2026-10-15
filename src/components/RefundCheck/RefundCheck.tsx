import { useState } from "react";
import { runRefundCheck, type RefundCheckResult } from "../../lib/refundExample";

export function RefundCheck() {
  const [result, setResult] = useState<RefundCheckResult | null>(null);

  return (
    <section className="refund-check" aria-label="PAY-142 retry check" lang="en">
      <div>
        <h2>PAY-142: two requests, one refund.</h2>
        <p>Same payment, $25.00, same idempotency key. A retry must return the original refund.</p>
        <p className="refund-check__scope">Local executable example · not agent-generated · no payment provider.</p>
      </div>
      <div className="refund-check__proof">
        <button type="button" className="btn btn--primary" onClick={() => setResult(runRefundCheck())}>
          {result ? "Run retry check again" : "Run retry check"}
        </button>
        <div role="status" aria-live="polite">
          {result ? (
            <>
              <strong className={result.passed ? "refund-check__pass" : "refund-check__fail"}>
                {result.passed ? "PASS" : "FAIL"}: 2 requests · {result.refundCount} refund{result.refundCount === 1 ? "" : "s"}
              </strong>
              <p>First: <code>{result.firstId}</code> · Retry: <code>{result.retryId}</code></p>
            </>
          ) : <p>Expected: matching refund IDs and exactly one ledger entry.</p>}
        </div>
      </div>
    </section>
  );
}
