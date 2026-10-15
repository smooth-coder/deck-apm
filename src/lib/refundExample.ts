/** Local teaching example only: no HTTP endpoint, payment provider or persistent storage. */
export interface RefundRequest {
  readonly paymentId: string;
  readonly amountCents: number;
  readonly idempotencyKey: string;
}

interface Refund extends RefundRequest {
  readonly id: string;
}

type RefundResult =
  | { readonly ok: true; readonly refund: Refund }
  | { readonly ok: false; readonly error: "missing-key" | "key-conflict" };

export function createRefundLedger() {
  const refunds = new Map<string, Refund>();

  return {
    get count() {
      return refunds.size;
    },
    submit(request: RefundRequest): RefundResult {
      if (!request.idempotencyKey.trim()) return { ok: false, error: "missing-key" };
      const previous = refunds.get(request.idempotencyKey);
      if (previous) {
        if (previous.paymentId !== request.paymentId || previous.amountCents !== request.amountCents) {
          return { ok: false, error: "key-conflict" };
        }
        return { ok: true, refund: previous };
      }
      const refund = { ...request, id: `refund-${refunds.size + 1}` };
      refunds.set(request.idempotencyKey, refund);
      return { ok: true, refund };
    },
  };
}

export interface RefundCheckResult {
  readonly passed: boolean;
  readonly firstId: string;
  readonly retryId: string;
  readonly refundCount: number;
}

export function runRefundCheck(): RefundCheckResult {
  const ledger = createRefundLedger();
  const request: RefundRequest = { paymentId: "payment-142", amountCents: 2500, idempotencyKey: "PAY-142" };
  const first = ledger.submit(request);
  const retry = ledger.submit(request);
  return {
    passed: first.ok && retry.ok && first.refund.id === retry.refund.id && ledger.count === 1,
    firstId: first.ok ? first.refund.id : first.error,
    retryId: retry.ok ? retry.refund.id : retry.error,
    refundCount: ledger.count,
  };
}
