import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "../components/LegalPage";

const title = "Terms & Conditions — ZeroHours";
const description = "Terms governing access to and use of the ZeroHours digital academic execution system.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://zerohours.store/terms" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://zerohours.store/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      summary="These terms govern your purchase of, access to, and use of ZeroHours. Please read them before buying or using the product."
    >
      <section>
        <h2>1. Seller and acceptance</h2>
        <p>ZeroHours is sold by <strong>Arrow Wilder, trading as ZeroHours</strong> (“ZeroHours,” “we,” “us,” or “our”). You are contracting with Arrow Wilder for the digital product and related services described here.</p>
        <p>By purchasing, accessing, or continuing to use ZeroHours, you agree to these Terms &amp; Conditions and the <Link to="/privacy">Privacy Notice</Link>. If you do not agree, do not use the product. If you purchase or use ZeroHours for an organization, you confirm that you have authority to bind it. You must be legally able to enter this agreement or have permission from a parent or guardian where required.</p>
      </section>

      <section>
        <h2>2. What ZeroHours provides</h2>
        <p>ZeroHours is a browser-based, local-first academic organization and execution tool for students. It works on mobile and desktop without a download or install. It includes workflows for tasks, courses, assignments, exams, schedules, notes, reading, grades, study sessions, focus, progress, review, and recovery from procrastination.</p>
        <p>ZeroHours is a productivity aid, not medical, mental-health, educational, or professional advice. It does not guarantee grades, academic outcomes, focus, or freedom from procrastination. You remain responsible for your decisions, deadlines, schoolwork, backups, and use of the product.</p>
      </section>

      <section>
        <h2>3. License and ownership</h2>
        <p>After a valid purchase, we grant you a limited, personal, non-exclusive, non-transferable, and revocable license to use ZeroHours for your own lawful purposes. The product is licensed, not sold.</p>
        <p>Arrow Wilder retains all rights in ZeroHours, including its software, design, workflows, text, documentation, graphics, branding, and other intellectual property. These terms do not transfer ownership of that intellectual property to you.</p>
        <p>You may create, enter, and export your own content. You retain your rights in that content and grant us only the limited rights needed to process content you deliberately send to us for support or service delivery.</p>
      </section>

      <section>
        <h2>4. Acceptable use</h2>
        <p>You must not:</p>
        <ul>
          <li>use ZeroHours unlawfully, fraudulently, to spam others, or to violate another person’s rights;</li>
          <li>upload, transmit, or distribute malware or other harmful code;</li>
          <li>probe, disrupt, overload, bypass, or interfere with security or technical limits;</li>
          <li>scrape the website or use automated access in a way that burdens or damages the service;</li>
          <li>reverse engineer, decompile, or attempt to extract source code except where applicable law expressly permits it;</li>
          <li>copy, resell, sublicense, redistribute, publish, or commercially exploit the product or access details;</li>
          <li>remove ownership notices or misrepresent ZeroHours as your own product; or</li>
          <li>infringe intellectual-property, privacy, or other legal rights.</li>
        </ul>
      </section>

      <section>
        <h2>5. Purchases, delivery, and Paddle</h2>
        <p>ZeroHours is currently offered for a one-time price shown before checkout. There is no recurring subscription for the core product. Any future optional product will be clearly described and priced separately before purchase.</p>
        <p><strong>Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns.</strong></p>
        <p>Payment, billing, applicable tax, cancellation, and refund mechanics are governed by <a href="https://www.paddle.com/legal/checkout-buyer-terms" rel="noreferrer">Paddle’s Buyer Terms</a> together with our <Link to="/refund-policy">Refund Policy</Link>. You must provide accurate purchase and delivery information.</p>
        <p>Your access link and code are sent to the email address used at checkout and may also be shown immediately after a confirmed purchase. Open the link in any browser, enter the code once, and ZeroHours unlocks permanently on that device without an install or repeat entry. You are responsible for entering a working email address and keeping your exported data backed up.</p>
      </section>

      <section>
        <h2>6. Service availability and updates</h2>
        <p>We aim to keep the website, checkout connection, delivery process, and product functioning, but do not guarantee uninterrupted, secure, or error-free availability. Maintenance, provider outages, compatibility changes, device settings, and events outside our control may affect access or performance.</p>
        <p>We may provide fixes or updates and may change or discontinue non-essential features. Nothing in these terms requires us to provide a particular update indefinitely.</p>
      </section>

      <section>
        <h2>7. Suspension and termination</h2>
        <p>We may suspend delivery, support, access, or a license when reasonably necessary because of a material breach, non-payment or reversed payment, suspected fraud or security risk, unlawful use, or repeated or serious violations of these terms. Where practical, we will provide notice and an opportunity to correct the issue.</p>
        <p>You may stop using ZeroHours at any time. On termination, your license ends and you must stop using the product. Terms that by their nature should continue—including ownership, liability, and dispute provisions—remain in effect. Local data stays on your device unless you delete it.</p>
      </section>

      <section>
        <h2>8. Intellectual-property complaints</h2>
        <p>If you believe material connected with ZeroHours infringes your rights, contact Arrow Wilder through the support contact included with a purchase and describe the work, the allegedly infringing material, its location, your contact information, and the basis for your claim. We may remove or restrict material while reviewing a complaint and may terminate repeat infringers.</p>
      </section>

      <section>
        <h2>9. Disclaimers</h2>
        <p>To the fullest extent permitted by law, ZeroHours is provided “as is” and “as available.” We disclaim implied warranties of merchantability, fitness for a particular purpose, non-infringement, and uninterrupted or error-free operation. These disclaimers do not affect mandatory consumer rights that cannot legally be excluded.</p>
      </section>

      <section>
        <h2>10. Limitation of liability</h2>
        <p>To the fullest extent permitted by law, Arrow Wilder will not be liable for indirect, incidental, special, consequential, or punitive loss, or for lost profits, opportunities, goodwill, or data arising from ZeroHours. Our total liability relating to the product will not exceed the amount you paid for ZeroHours during the 12 months before the event giving rise to the claim.</p>
        <p>Nothing in these terms excludes or limits liability that cannot legally be excluded, including liability for fraud or for death or personal injury caused by negligence where applicable.</p>
      </section>

      <section>
        <h2>11. Your responsibility</h2>
        <p>You are responsible for your lawful use, your content, and reasonable backups. To the extent permitted by law, you agree to indemnify Arrow Wilder against third-party claims caused by your unlawful content, infringement of another person’s rights, misuse of ZeroHours, or material breach of these terms.</p>
      </section>

      <section>
        <h2>12. General terms</h2>
        <p>We are not responsible for delay or failure caused by events beyond reasonable control. You may not assign these terms without our consent; we may assign them as part of a business transfer or reorganization. If one provision is unenforceable, the remaining provisions continue in effect. A delay in enforcement is not a waiver.</p>
        <p>These terms are governed by the laws applicable where Arrow Wilder is established, without depriving you of mandatory consumer protections in your home jurisdiction. Courts with lawful jurisdiction may resolve disputes. Before filing a claim, both parties should try in good faith to resolve it through the available support channel.</p>
      </section>

      <section>
        <h2>13. Changes</h2>
        <p>We may update these terms to reflect product, provider, or legal changes. The effective date above shows the current version. Material changes will be communicated where required. Continued use after an update means you accept the revised terms, except where additional consent is legally required.</p>
      </section>
    </LegalPage>
  );
}