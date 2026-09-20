import { getPaymentEnvironment } from "../lib/paddle";

export function PaymentTestModeBanner() {
  if (getPaymentEnvironment() !== "sandbox") return null;
  return <div className="border-b border-coral bg-coral-soft px-4 py-2 text-center text-xs font-semibold text-coral-strong">Test checkout — no real payment will be taken.</div>;
}