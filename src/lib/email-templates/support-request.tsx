import * as React from "react";
import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface Props {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
}

const text = { fontSize: "15px", lineHeight: "24px", color: "#20242e", margin: "0 0 12px" };

function SupportRequestEmail({ name, email, topic, message }: Props) {
  return (
    <Html lang="en">
      <Head />
      <Preview>New ZeroHours support request: {topic ?? ""}</Preview>
      <Body style={{ backgroundColor: "#ffffff", fontFamily: "Helvetica, Arial, sans-serif", padding: "24px 0" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "32px", border: "1px solid #e8e5df", borderRadius: "12px" }}>
          <Heading style={{ fontSize: "22px", margin: "0 0 16px", color: "#20242e" }}>New support request</Heading>
          <Text style={text}><strong>Topic:</strong> {topic}</Text>
          <Text style={text}><strong>Name:</strong> {name || "—"}</Text>
          <Text style={text}><strong>Email:</strong> {email}</Text>
          <Text style={{ ...text, whiteSpace: "pre-wrap", borderTop: "1px solid #e8e5df", paddingTop: "16px" }}>{message}</Text>
          <Text style={{ fontSize: "12px", color: "#8a8f9c" }}>Reply to this email to respond to the customer directly.</Text>
        </Container>
      </Body>
    </Html>
  );
}

export const template = {
  component: SupportRequestEmail,
  subject: (d: Record<string, any>) => `ZeroHours support: ${d.topic ?? "New request"}`,
  displayName: "Support request (owner)",
  to: "kareemthenigget@gmail.com",
  previewData: { name: "Jane", email: "jane@example.com", topic: "Can't unlock the app", message: "Hi, my email isn't working." },
} satisfies TemplateEntry;
