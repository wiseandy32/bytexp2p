
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

interface VerificationEmailProps {
  verificationCode: string;
}


export const VerificationEmail: React.FC<Readonly<VerificationEmailProps>> = ({
    verificationCode,
}) => (
  <Html>
    <Head />
    <Preview>Your Bytexp2p2 Verification Code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={content}>
          <Heading style={h1}>Verify Your Email Address</Heading>
          <Text style={text}>
            Thank you for registering with Bytexp2p2. To complete your account
            setup, please use the following verification code:
          </Text>
          <Section style={codeContainer}>
            <Text style={codeText}>{verificationCode}</Text>
          </Section>
          <Text style={text}>
            This code will expire in 10 minutes. If you did not request this
            verification, please ignore this email.
          </Text>
          <Text style={text}>
            Best regards,
            <br />
            The Bytexp2p2 Team
          </Text>
        </Section>
        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>
            © {new Date().getFullYear()} Bytexp2p2. All rights reserved.
          </Text>
          <Link href="https://bytexp2p2.com" style={footerLink}>
            Bytexp2p2.com
          </Link>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  border: "1px solid #f0f0f0",
  borderRadius: "4px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const content = {
  padding: "0 20px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "40px",
  margin: "0 0 20px",
  textAlign: "center" as const,
};

const text = {
  color: "#333333",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 20px",
};

const codeContainer = {
  backgroundColor: "#f0f0f0",
  padding: "10px",
  borderRadius: "4px",
  margin: "20px 0",
  textAlign: "center" as const,
};

const codeText = {
  color: "#1a1a1a",
  fontSize: "28px",
  fontWeight: "700",
  letterSpacing: "10px",
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
