
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

interface TradeCreationParticipantEmailProps {
  roomId: string;
  traderRole: string;
  sellerAmount: string;
  sellersToken: string;
  buyerAmount: string;
  buyersToken: string;
  tradeLink: string;
}

export const TradeCreationParticipantEmail = ({
  roomId,
  traderRole,
  sellerAmount,
  sellersToken,
  buyerAmount,
  buyersToken,
  tradeLink,
}: TradeCreationParticipantEmailProps) => (
  <Html>
    <Head />
    <Preview>You Have Been Invited to a New Trade</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Trade Room Invitation</Heading>
        <Text style={text}>
          Hello, a new trade has been created and you have been invited to
          participate. Here are the details of the trade:
        </Text>
        <Text style={text}>
          <strong>Room ID:</strong> {roomId}
        </Text>
        <Text style={text}>
          <strong>Your Role:</strong> {traderRole}
        </Text>
        <Text style={text}>
          <strong>Seller Gives:</strong> {sellerAmount} {sellersToken}
        </Text>
        <Text style={text}>
          <strong>Buyer Gives:</strong> {buyerAmount} {buyersToken}
        </Text>
        <Text style={text}>
          You can access the trade room and manage your trade by clicking the
          link below:
        </Text>
        <Link
          href={tradeLink}
          style={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to Trade Room
        </Link>
        <Text style={text}>
          If you were not expecting this invitation, please ignore this email.
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

export default TradeCreationParticipantEmail;

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
  width: "200px",
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

const footerLink = {
  color: "#1a1a1a",
  textDecoration: "underline",
};
