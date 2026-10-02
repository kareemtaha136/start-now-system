import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { TemplateEntry } from "./registry";
import { productConfig } from "@/lib/zerohours-config";

// Guide PDF links in email must be absolute.
const SITE_URL = "https://project--8bdcf2c0-cd83-44f5-956b-6e817c0f0074.lovable.app";

export interface PurchaseDeliveryProps {
  orderId?: string;
}

const styles = {
  body: {
    backgroundColor: "#faf9f6",
    fontFamily: "'Work Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    color: "#20242e",
    margin: 0,
    padding: "24px 0",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e8e5df",
    maxWidth: "520px",
    margin: "0 auto",
    padding: "40px 32px",
  },
  heading: {
    fontFamily: "'Sora', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: "26px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    margin: "0 0 12px",
    color: "#20242e",
  },
  text: {
    fontSize: "15px",
    lineHeight: "24px",
    margin: "0 0 16px",
    color: "#4b5160",
  },
  button: {
    backgroundColor: "#4338ca",
    borderRadius: "8px",
    color: "#ffffff",
    display: "block",
    fontFamily: "'Sora', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: "15px",
    fontWeight: 700,
    textAlign: "center" as const,
    textDecoration: "none",
    padding: "14px 24px",
  },
  secondaryButton: {
    backgroundColor: "#f1efe9",
    borderRadius: "8px",
    color: "#20242e",
    display: "block",
    fontFamily: "'Sora', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: "14px",
    fontWeight: 700,
    textAlign: "center" as const,
    textDecoration: "none",
    padding: "12px 24px",
  },
  hr: { borderColor: "#e8e5df", margin: "28px 0" },
  subheading: {
    fontFamily: "'Sora', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: "15px",
    fontWeight: 700,
    color: "#20242e",
    margin: "0 0 6px",
  },
  step: {
    fontSize: "14px",
    lineHeight: "22px",
    margin: "0 0 4px",
    color: "#4b5160",
  },
  footer: { fontSize: "12px", lineHeight: "18px", color: "#8a8f9c", margin: "0" },
} satisfies Record<string, React.CSSProperties>;

function PurchaseDeliveryEmail({ orderId }: PurchaseDeliveryProps) {
  const includedGuideUrl = `${SITE_URL}${productConfig.includedGuideUrl}`;
  const guideUrl = `${SITE_URL}${productConfig.freeGuideUrl}`;

  return (
    <Html lang="en">
      <Head />
      <Preview>Your ZeroHours access link and code are ready</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section>
            <Heading style={styles.heading}>You're in.</Heading>
            <Text style={styles.text}>
              Thanks for getting ZeroHours. Open the link below on any device
              to get started right in your browser.
            </Text>
            <Button href={productConfig.appAccessUrl} style={styles.button}>
              Open ZeroHours
            </Button>
            <Text style={styles.text}>
              Your access code: <strong>{productConfig.appAccessCode}</strong>
            </Text>
            <Text style={styles.text}>
              Enter the code once to unlock ZeroHours permanently on that
              device. No file to download, no install, and no need to enter the
              code again each time.
            </Text>
            <Hr style={styles.hr} />
            <Section>
              <Heading
                as="h2"
                style={{
                  fontFamily: "'Sora', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  margin: "0 0 12px",
                  color: "#20242e",
                }}
              >
                Put it on your home screen
              </Heading>
              <Text style={styles.text}>
                For a one-tap ZeroHours icon right next to your other apps, add
                it to your phone's home screen:
              </Text>
              <Text style={styles.subheading}>On iPhone (Safari)</Text>
              <Text style={styles.step}>
                1. Open {productConfig.appAccessUrl.replace(/^https?:\/\//, "")} in Safari and enter your access code.
              </Text>
              <Text style={styles.step}>
                2. Tap the <strong>Share</strong> button (the square with an
                arrow pointing up).
              </Text>
              <Text style={styles.step}>
                3. Scroll down and tap <strong>Add to Home Screen</strong>, then
                tap <strong>Add</strong>.
              </Text>
              <Text style={styles.subheading}>On Android (Chrome)</Text>
              <Text style={styles.step}>
                1. Open {productConfig.appAccessUrl.replace(/^https?:\/\//, "")} in Chrome and enter your access code.
              </Text>
              <Text style={styles.step}>
                2. Tap the <strong>three-dot menu</strong> at the top right.
              </Text>
              <Text style={styles.step}>
                3. Tap <strong>Add to Home screen</strong> (or <strong>Add to
                Home screen &gt; Install</strong>), then confirm.
              </Text>
              <Text style={styles.text}>
                You'll get a ZeroHours icon that opens the app instantly — no
                app store needed.
              </Text>
            </Section>
            <Hr style={styles.hr} />
            <Button href={includedGuideUrl} style={styles.secondaryButton}>
              Download the ZeroHours Guide
            </Button>
            <Hr style={styles.hr} />
            <Text style={styles.text}>
              You also have the free guide,{" "}
              <strong>ZeroHours — Just Start</strong>:
            </Text>
            <Button href={guideUrl} style={styles.secondaryButton}>
              Download the free guide
            </Button>
            <Hr style={styles.hr} />
            <Text style={styles.footer}>
              Order reference: {orderId ?? "n/a"}
            </Text>
            <Text style={styles.footer}>
              You paid once — there is no subscription and nothing further to
              pay. If you didn't make this purchase, you can ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const template = {
  component: PurchaseDeliveryEmail,
  subject: "Your ZeroHours access is ready",
  displayName: "Purchase delivery — ZeroHours access",
  previewData: { orderId: "txn_test_1234" },
} satisfies TemplateEntry;
