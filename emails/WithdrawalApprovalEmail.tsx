
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Hr,
  Link,
} from "@react-email/components";
import * as React from "react";

interface WithdrawalApprovalEmailProps {
  name?: string;
  amount?: string;
  asset?: string;
  transactionLink?: string;
  transactionId?: string;
}

export const WithdrawalApprovalEmail = ({
  name,
  amount,
  asset,
  transactionLink,
  transactionId,
}: WithdrawalApprovalEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Withdrawal has been Approved</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Withdrawal Approved</Heading>
        <Text style={text}>
          Hello {name},
        </Text>
        <Text style={text}>
          Your recent withdrawal has been approved. Here are the details:
        </Text>
        <Text style={text}>
          <strong>Transaction ID:</strong> {transactionId}
        </Text>
        <Text style={text}>
          <strong>Amount:</strong> {amount} {asset}
        </Text>
        <Text style={text}>
          You can view the transaction details by clicking the link below:
        </Text>
        <Link
          href={transactionLink}
          style={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Transaction
        </Link>
        <Text style={text}>
          If you have any questions, please contact our support team.
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

export default WithdrawalApprovalEmail;

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
