import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface TradeInviteUnregisteredEmailProps {
  roomId: string;
  participantRole: string;
  sellerAmount: string;
  sellersToken: string;
  buyerAmount: string;
  buyersToken: string;
  signupLink: string;
  expiresInHours: number;
}

export const TradeInviteUnregisteredEmail = ({
  roomId,
  participantRole,
  sellerAmount,
  sellersToken,
  buyerAmount,
  buyersToken,
  signupLink,
  expiresInHours,
}: TradeInviteUnregisteredEmailProps) => (
  <Html>
    <Head />
    <Preview>
      You have been invited to a crypto trade on Bytexp2p. Create a free
      account to join.
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>You have been invited to trade</Heading>
        <Text style={text}>
          Hello, you have received an invitation to a cryptocurrency trade on
          Bytexp2p, a secure escrow platform where crypto is held safely while
          both sides complete their exchange.
        </Text>
        <Text style={text}>
          If you were not expecting this invitation, please ignore this email.
          No account will be created and nothing further will happen.
        </Text>
        <Text style={text}>
          If you were expecting it, here are the details of the trade:
        </Text>
        <Text style={text}>
          <strong>Room ID:</strong> {roomId}
        </Text>
        <Text style={text}>
          <strong>Your Role:</strong> {participantRole}
        </Text>
        <Text style={text}>
          <strong>Seller Gives:</strong> {sellerAmount} {sellersToken}
        </Text>
        <Text style={text}>
          <strong>Buyer Gives:</strong> {buyerAmount} {buyersToken}
        </Text>
        <Text style={text}>
          You do not have a Bytexp2p account yet. Creating one is free. Just
          make sure to register with this exact email address, since this
          invitation was sent to it. After that, you will be taken straight to
          the trade room to review and join.
        </Text>
        <Link
          href={signupLink}
          style={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Create Free Account and Join
        </Link>
        <Text style={text}>
          This invitation is valid for the next {expiresInHours} hours. After
          that, you will need a new invitation to join.
        </Text>
        <Text style={text}>
          Only ever deposit inside the trade room on our website. Never send
          crypto to addresses shared over email or chat.
        </Text>
        <Text style={text}>
          If you have any questions, contact our support team at{" "}
          <Link href="mailto:support@bytexp2p.com">support@bytexp2p.com</Link>.
        </Text>
        <Text style={text}>
          Best regards,
          <br />
          The Bytexp2p Team
        </Text>
        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>
            © {new Date().getFullYear()} Bytexp2p. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default TradeInviteUnregisteredEmail;

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
  margin: "0 auto",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "16px",
  lineHeight: "24px",
};

const link = {
  backgroundColor: "#007bff",
  borderRadius: "5px",
  color: "#fff",
  display: "inline-block",
  fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "16px",
  fontWeight: "bold",
  lineHeight: "40px",
  margin: "20px 0",
  textAlign: "center" as const,
  textDecoration: "none",
  width: "240px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  padding: "0 20px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#666666",
  fontSize: "12px",
  lineHeight: "24px",
};
