
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

interface DepositApprovalEmailProps {
  name: string;
  amount: string;
  coin: string;
  transactionReference: string;
  date: string;
}

const baseUrl = "https://www.mitomcash.com/";

export const DepositApprovalEmail: React.FC<Readonly<DepositApprovalEmailProps>> = ({
  name,
  amount,
  coin,
  transactionReference,
  date,
}) => (
  <Html>
    <Head />
    <Preview>Deposit Approved!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <table align="center" border={0} cellPadding={0} cellSpacing={0}>
            <tbody>
              <tr>
                <td>
                  <Img
                    src={`${baseUrl}logo.png`}
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
          <Text style={text}>Hello {name},</Text>
          <Text style={text}>
            Your recent deposit has been approved and the funds are now available in your account. Below are the details of the transaction:
          </Text>
          <table style={table}>
            <tbody>
              <tr style={tableRow}>
                <td style={tableCellLabel}>Amount</td>
                <td style={tableCell}>{amount} {coin}</td>
              </tr>
              <tr style={tableRow}>
                <td style={tableCellLabel}>Transaction ID</td>
                <td style={tableCell}>{transactionReference}</td>
              </tr>
              <tr style={tableRow}>
                <td style={tableCellLabel}>Date of Deposit</td>
                <td style={tableCell}>{date}</td>
              </tr>
            </tbody>
          </table>
          <Text style={text}>
            Thank you for choosing Mitomcash.  If you have any questions or require further assistance, please do not hesitate to reach out to our support team.
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

export default DepositApprovalEmail;

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

const h2 = {
    color: "#1a1a1a",
    fontSize: "20px",
    fontWeight: "600",
    lineHeight: "30px",
    margin: "20px 0 10px",
}

const text = {
  color: "#333333",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 20px",
};

const table = {
  width: "100%",
  borderCollapse: "collapse" as const,
  marginBottom: "20px",
};

const tableRow = {
  borderBottom: "1px solid #e6ebf1",
};

const tableCell = {
  padding: "10px",
  textAlign: "left" as const,
  width: "50%",
};

const tableCellLabel = {
  ...tableCell,
  fontWeight: "bold",
  backgroundColor: "#f9f9f9",
  borderRight: "1px solid #e6ebf1",
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
