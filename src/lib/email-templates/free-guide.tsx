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

// Download links in email must be absolute.
const SITE_URL = "https://project--8bdcf2c0-cd83-44f5-956b-6e817c0f0074.lovable.app";

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
  hr: { borderColor: "#e8e5df", margin: "28px 0" },
  footer: { fontSize: "12px", lineHeight: "18px", color: "#8a8f9c", margin: "0" },
} satisfies Record<string, React.CSSProperties>;

function FreeGuideEmail() {
  const guideUrl = `${SITE_URL}${productConfig.freeGuideUrl}`;

  return (
    <Html lang="en">
      <Head />
      <Preview>Your free ZeroHours guide is ready to download</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section>
            <Heading style={styles.heading}>Here's your guide.</Heading>
            <Text style={styles.text}>
              Thanks for grabbing <strong>ZeroHours — Just Start</strong>. It
              walks through why starting feels so hard and how to make the first
              step small enough to actually take.
            </Text>
            <Button href={guideUrl} style={styles.button}>
              Download the free guide
            </Button>
            <Hr style={styles.hr} />
            <Text style={styles.text}>
              When you want the full system that walks you through starting —
              next action, 5-minute start, Lock-In Mode, and your whole academic
              workload in one place — ZeroHours is a one-time purchase.
            </Text>
            <Button href={SITE_URL} style={styles.button}>
              Get ZeroHours — {productConfig.price}
            </Button>
            <Hr style={styles.hr} />
            <Text style={styles.footer}>
              You received this because you requested the free guide at
              zerohours.store.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const template = {
  component: FreeGuideEmail,
  subject: "Your free ZeroHours guide",
  displayName: "Free guide delivery",
  previewData: {},
} satisfies TemplateEntry;
