
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Img,
  Hr,
  Link,
} from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
}

const baseUrl = "https://www.mitomcash.com";

export const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({
  name,
}) => (
  <Html>
    <Head />
    <Preview>Welcome to Mitomcash</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <table align="center" border={0} cellPadding={0} cellSpacing={0}>
            <tbody>
              <tr>
                <td>
                  <Img
                    src={`${baseUrl}/logo.png`}
                    width="40"
                    height="40"
                    alt="Mitomcash Logo"
                  />
                </td>
                <td style={{ paddingLeft: "12px", verticalAlign: "middle" }}>
                  <Heading
                    as="h1"
                    style={{
                      ...h1,
                      color: "#1a1a1a",
                      fontWeight: "bold",
                      margin: 0,
                      fontSize: "24px",
                      lineHeight: "24px",
                    }}
                  >
                    Mitomcash
                  </Heading>
                </td>
              </tr>
            </tbody>
          </table>
        </Section>
        <Hr style={hr} />
        <Section style={content}>
          <Heading style={h1}>Welcome aboard, {name}.</Heading>
          <Text style={text}>
            We're excited to have you join Mitomcash. You're now part of a
            community of investors who are building a brighter financial future.
          </Text>
          <Text style={text}>
            You can now explore your dashboard, discover investment
            opportunities, and start your journey towards financial success.
          </Text>
          <Text style={text}>
            If you have any questions, feel free to visit our FAQ section or
            contact our support team at support@mitomcash.com.
          </Text>
          <Text style={text}>
            Best regards,
            <br />
            The Mitomcash Team
          </Text>
        </Section>
        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>
            © {new Date().getFullYear()} Mitomcash. All rights reserved.
          </Text>
          <Link href="https://mitomcash.com" style={footerLink}>
            mitomcash.com
          </Link>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

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

const header = {
  padding: "20px",
  textAlign: "center" as const,
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
};

const text = {
  color: "#333333",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 20px",
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