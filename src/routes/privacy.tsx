import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "../components/LegalPage";

const title = "Privacy Notice — ZeroHours";
const description = "How Cameron Taha collects, uses, stores, and shares personal data when you use ZeroHours.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://zerohours.store/privacy" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://zerohours.store/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Notice"
      summary="This notice explains what information is handled when you visit ZeroHours, buy the product, receive delivery emails, or use the downloaded app."
    >
      <section>
        <h2>1. Who controls your information</h2>
        <p><strong>Cameron Taha, trading as ZeroHours</strong>, is the seller and data controller for the personal data described in this notice. “ZeroHours,” “we,” “us,” and “our” refer to Cameron Taha.</p>
        <p>Paddle.com Market Limited or another Paddle group company acts as Merchant of Record for purchases. Paddle handles checkout, payment, tax, subscription administration where applicable, invoicing, fraud prevention, and payment-related support under its own privacy notice.</p>
      </section>

      <section>
        <h2>2. Information we collect</h2>
        <ul>
          <li><strong>Purchase and delivery information:</strong> your name, email address, country or region, order reference, product purchased, transaction status, and refund status. Paddle processes payment-card and other payment-method details; ZeroHours does not collect or store full card details.</li>
          <li><strong>Communications:</strong> messages and information you provide when requesting support, exercising a privacy right, reporting intellectual-property concerns, or discussing an order.</li>
          <li><strong>Website and security data:</strong> IP address, browser and device information, request logs, timestamps, and similar technical information automatically processed by our hosting and security providers.</li>
          <li><strong>Product data:</strong> the downloadable ZeroHours app is local-first. Courses, tasks, assignments, notes, grades, schedules, study sessions, and similar working data are stored on your device unless you choose to export or share them. We do not receive that local app data merely because you use the app.</li>
          <li><strong>Free-guide information:</strong> the current free-guide form downloads the guide directly and does not save the email address entered. If email collection is enabled later, this notice will be updated before that use begins.</li>
        </ul>
      </section>

      <section>
        <h2>3. Why we use information and our legal bases</h2>
        <ul>
          <li><strong>Contract performance:</strong> to confirm purchases, deliver ZeroHours, provide support, and administer refunds.</li>
          <li><strong>Legitimate interests:</strong> to secure the website, prevent abuse and fraud, troubleshoot errors, maintain records, and improve reliability, where those interests are not overridden by your rights.</li>
          <li><strong>Legal obligations:</strong> to comply with tax, accounting, consumer-protection, sanctions, fraud-prevention, and lawful disclosure requirements.</li>
          <li><strong>Consent:</strong> where required for optional marketing or non-essential cookies. You may withdraw consent at any time.</li>
        </ul>
        <p>We do not sell your personal information or use local schoolwork data for advertising.</p>
      </section>

      <section>
        <h2>4. Who receives information</h2>
        <p>We share only what is reasonably necessary with:</p>
        <ul>
          <li><strong>Paddle, our Merchant of Record,</strong> for product sales, checkout, payments, tax compliance, invoicing, refund handling, fraud prevention, and purchase support.</li>
          <li><strong>Service providers</strong> that provide website hosting, security, file delivery, transactional email, and technical infrastructure.</li>
          <li><strong>Professional advisers</strong> such as legal, tax, or accounting advisers where necessary.</li>
          <li><strong>Public authorities</strong> where disclosure is required by law or needed to protect legal rights and safety.</li>
          <li><strong>A successor organization</strong> if the business is reorganized, sold, or transferred, subject to appropriate safeguards.</li>
        </ul>
      </section>

      <section>
        <h2>5. Retention</h2>
        <p>Purchase and tax records may be retained for up to seven years where needed for legal, accounting, dispute, and fraud-prevention purposes. Support communications are generally retained for up to two years after the matter closes. Security logs are kept only as long as reasonably needed to protect and operate the service. Data is deleted or anonymized when no longer needed, unless law requires longer retention.</p>
        <p>Local-first product data remains on your device until you delete it, clear the relevant browser or device storage, or replace it through an import. You control exported copies.</p>
      </section>

      <section>
        <h2>6. Cookies and similar technologies</h2>
        <p>ZeroHours uses essential technologies needed to load, secure, and operate the website and checkout. Paddle may use cookies or similar technologies during checkout for payment, fraud prevention, and service operation. We do not currently use marketing cookies. If optional analytics or marketing cookies are introduced, we will provide appropriate notice and choices before using them where required.</p>
        <p>You can manage cookies through your browser. Blocking essential cookies may prevent checkout or parts of the website from working.</p>
      </section>

      <section>
        <h2>7. International transfers</h2>
        <p>Our providers may process information outside your country, including outside the UK or European Economic Area. Where required, transfers rely on recognized safeguards such as adequacy decisions, standard contractual clauses, or equivalent lawful mechanisms.</p>
      </section>

      <section>
        <h2>8. Your rights</h2>
        <p>Depending on where you live, you may have rights to access, correct, delete, restrict, or receive a portable copy of your personal data; object to certain processing; withdraw consent; and appeal or complain to your local data-protection authority. UK and EEA requests are generally answered within one month, subject to lawful extensions.</p>
        <p>To make a request concerning ZeroHours data, contact Cameron Taha using the support contact included with your purchase. For payment information controlled by Paddle, use <a href="https://paddle.net" rel="noreferrer">paddle.net</a>. We may need to verify your identity before completing a request.</p>
      </section>

      <section>
        <h2>9. Security</h2>
        <p>We use reasonable technical and organizational safeguards appropriate to the information handled, including access controls, encrypted connections, restricted service credentials, and reputable infrastructure providers. No method of transmission or storage is completely secure.</p>
      </section>

      <section>
        <h2>10. Children</h2>
        <p>ZeroHours is designed for students but is not directed to children under 13. If local law requires parental or guardian consent for a younger user to purchase or use the product, that consent must be obtained. If you believe a child provided personal information unlawfully, contact us so it can be reviewed and removed where appropriate.</p>
      </section>

      <section>
        <h2>11. Changes</h2>
        <p>We may update this notice when our practices or legal obligations change. The effective date above identifies the latest version. Material changes will be communicated where required.</p>
        <p>See also our <Link to="/terms">Terms &amp; Conditions</Link> and <Link to="/refund-policy">Refund Policy</Link>.</p>
      </section>
    </LegalPage>
  );
}