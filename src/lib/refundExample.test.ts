import { createRefundLedger } from "./refundExample";

const request = { paymentId: "payment-142", amountCents: 2500, idempotencyKey: "PAY-142" };

describe("local refund example", () => {
  it("returns the original refund on a retry without adding a ledger entry", () => {
    const ledger = createRefundLedger();
    const first = ledger.submit(request);
    const retry = ledger.submit({ ...request });
    expect(first.ok).toBe(true);
    expect(retry).toEqual(first);
    expect(ledger.count).toBe(1);
  });

  it.each([
    { ...request, amountCents: 5000 },
    { ...request, paymentId: "other-payment" },
  ])("rejects reuse of a key with a different payload: %j", (conflicting) => {
    const ledger = createRefundLedger();
    const original = ledger.submit(request);
    expect(ledger.submit(conflicting)).toEqual({ ok: false, error: "key-conflict" });
    expect(ledger.submit(request)).toEqual(original);
    expect(ledger.count).toBe(1);
  });

  it("rejects a missing key without recording a refund", () => {
    const ledger = createRefundLedger();
    expect(ledger.submit({ ...request, idempotencyKey: " " })).toEqual({ ok: false, error: "missing-key" });
    expect(ledger.count).toBe(0);
  });

  it("treats a new key as a separate request and isolates ledger instances", () => {
    const ledger = createRefundLedger();
    const first = ledger.submit(request);
    const second = ledger.submit({ ...request, idempotencyKey: "PAY-143" });
    expect(first.ok && second.ok && first.refund.id !== second.refund.id).toBe(true);
    expect(ledger.count).toBe(2);
    expect(createRefundLedger().count).toBe(0);
  });
});
