import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "../components/LegalPage";

const title = "Refund Policy — ZeroHours";
const description = "The 14-day ZeroHours refund policy and instructions for requesting a refund through Paddle.";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://zerohours.store/refund-policy" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://zerohours.store/refund-policy" }],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <LegalPage
      eyebrow="Purchase policy"
      title="Refund Policy"
      summary="We want you to have a clear and fair way to request a refund if ZeroHours is not right for you."
    >
      <section>
        <h2>14-day refund period</h2>
        <p>ZeroHours offers a <strong>14-day money-back guarantee</strong>. If you are not satisfied with your purchase, you may request a full refund within 14 calendar days of the original transaction date.</p>
        <p>This policy applies to the ZeroHours digital product purchased through our official checkout. It does not limit any additional refund, cancellation, or consumer rights you may have under applicable law.</p>
      </section>

      <section>
        <h2>How to request a refund</h2>
        <ol>
          <li>Visit <a href="https://paddle.net" rel="noreferrer">paddle.net</a>.</li>
          <li>Use the email address connected to your purchase.</li>
          <li>Select the ZeroHours order and request a refund, or contact Paddle’s purchase support.</li>
        </ol>
        <p>Paddle is our Merchant of Record and handles payment support and returns. Providing your order email or transaction reference helps Paddle locate the purchase.</p>
      </section>

      <section>
        <h2>Processing</h2>
        <p>Approved refunds are returned to the original payment method. The time for funds to appear depends on the payment method and financial institution. Paddle will provide the applicable status and confirmation.</p>
        <p>After a full refund, your license to use ZeroHours ends and you should stop using the app. Data you created locally remains under your control.</p>
      </section>

      <section>
        <h2>Duplicate charges and technical issues</h2>
        <p>If you see a duplicate charge, cannot access the app using your link and code, or experience another order problem, contact Paddle through <a href="https://paddle.net" rel="noreferrer">paddle.net</a>. Access problems can often be corrected without affecting your right to request a refund within the 14-day period.</p>
      </section>

      <section>
        <h2>Related terms</h2>
        <p>Payment and refund mechanics are also subject to <a href="https://www.paddle.com/legal/checkout-buyer-terms" rel="noreferrer">Paddle’s Buyer Terms</a>. Please also review the ZeroHours <Link to="/terms">Terms &amp; Conditions</Link> and <Link to="/privacy">Privacy Notice</Link>.</p>
      </section>
    </LegalPage>
  );
}