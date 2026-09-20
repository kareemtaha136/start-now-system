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

// The stable production URL for this project — download links in the email
// must be absolute, so they point here (works once the site is published).
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
  footer: { fontSize: "12px", lineHeight: "18px", color: "#8a8f9c", margin: "0" },
} satisfies Record<string, React.CSSProperties>;

function PurchaseDeliveryEmail({ orderId }: PurchaseDeliveryProps) {
  const appUrl = `${SITE_URL}${productConfig.appDownloadUrl}`;
  const includedGuideUrl = `${SITE_URL}${productConfig.includedGuideUrl}`;
  const guideUrl = `${SITE_URL}${productConfig.freeGuideUrl}`;

  return (
    <Html lang="en">
      <Head />
      <Preview>Your ZeroHours download is ready</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section>
            <Heading style={styles.heading}>You're in.</Heading>
            <Text style={styles.text}>
              Thanks for getting ZeroHours. Your download is ready — tap the
              button below to save it to your device.
            </Text>
            <Button href={appUrl} style={styles.button}>
              Download ZeroHours
            </Button>
            <Text style={styles.text}>
              Open the file in any browser — it works offline and keeps your
              data on your own device. Save the file somewhere you'll find it
              again.
            </Text>
            <Hr style={styles.hr} />
            <Text style={styles.text}>
              Your purchase also includes <strong>The ZeroHours Guide</strong>{" "}
              (PDF):
            </Text>
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
  subject: "Your ZeroHours download is ready",
  displayName: "Purchase delivery — ZeroHours download",
  previewData: { orderId: "txn_test_1234" },
} satisfies TemplateEntry;
