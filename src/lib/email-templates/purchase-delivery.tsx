import * as React from "react";
import { Body, Button, Container, Head, Html, Preview, Section, Text } from "@react-email/components";
import type { TemplateEntry } from "./registry";
import { productConfig } from "@/lib/zerohours-config";

export interface PurchaseDeliveryProps {
  orderId?: string;
}

const styles = {
  body: {
    backgroundColor: "#ffffff",
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
  text: { fontSize: "15px", lineHeight: "24px", margin: "0 0 16px", color: "#4b5160" },
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
    margin: "0 0 20px",
  },
  footer: { fontSize: "12px", lineHeight: "18px", color: "#8a8f9c", margin: "16px 0 0" },
} satisfies Record<string, React.CSSProperties>;

function PurchaseDeliveryEmail({ orderId }: PurchaseDeliveryProps) {
  const url = productConfig.appAccessUrl;
  return (
    <Html lang="en">
      <Head />
      <Preview>Open ZeroHours and unlock it with this email</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section>
            <Text style={styles.text}>Hey — thanks for grabbing ZeroHours!</Text>
            <Text style={styles.text}>
              Open your app here: <a href={url} style={{ color: "#4338ca" }}>{url}</a>
            </Text>
            <Button href={url} style={styles.button}>Open ZeroHours</Button>
            <Text style={styles.text}>
              The first time you open it on a device, enter the email you used to buy ZeroHours (this one). That's it — no code, no account, no download. It remembers you after that.
            </Text>
            <Text style={styles.text}>Works on your phone and laptop (up to 7 devices).</Text>
            <Text style={styles.text}>
              Bookmark the link or add it to your home screen so it's always one tap away.
            </Text>
            <Text style={styles.text}>If anything doesn't work, just reply to this email.</Text>
            <Text style={styles.footer}>Order reference: {orderId ?? "n/a"}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const template = {
  component: PurchaseDeliveryEmail,
  subject: "You're in — here's ZeroHours 🔓",
  displayName: "Purchase delivery — ZeroHours access",
  previewData: { orderId: "txn_test_1234" },
} satisfies TemplateEntry;
