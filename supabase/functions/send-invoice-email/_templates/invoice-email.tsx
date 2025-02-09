
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
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface InvoiceEmailProps {
  invoiceNumber: string;
  customerName: string;
  amount: string;
  dueDate: string;
}

export const InvoiceEmail = ({
  invoiceNumber,
  customerName,
  amount,
  dueDate,
}: InvoiceEmailProps) => (
  <Html>
    <Head />
    <Preview>Invoice #{invoiceNumber} from Elloria Eco Products</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logo}>
          <Heading as="h1" style={header}>
            Elloria Eco Products
          </Heading>
        </Section>
        
        <Section style={content}>
          <Text style={greeting}>Dear {customerName},</Text>
          
          <Text style={paragraph}>
            Please find attached your invoice #{invoiceNumber} for {amount}, due on {dueDate}.
          </Text>
          
          <Text style={paragraph}>
            We appreciate your business and trust in Elloria Eco Products. If you have any questions about this invoice, please don't hesitate to contact us at <Link href="mailto:sales@elloria.ca" style={link}>sales@elloria.ca</Link>.
          </Text>

          <Text style={paragraph}>
            For your convenience, the invoice has been attached to this email as a PDF file.
          </Text>
        </Section>
        
        <Hr style={hr} />
        
        <Section style={footer}>
          <Text style={footerText}>
            Elloria Eco Products LTD.<br />
            229 Dowling Ave W<br />
            Winnipeg, MB R3B 2B9<br />
            (204) 930-2019
          </Text>
          <Text style={footerText}>
            GST Number: 742031420RT0001
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#f5f5f5',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 0',
  width: '560px',
};

const logo = {
  padding: '25px',
  backgroundColor: '#ffffff',
  borderRadius: '5px 5px 0 0',
  textAlign: 'center' as const,
};

const header = {
  color: '#333333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.4',
  margin: '0',
};

const content = {
  backgroundColor: '#ffffff',
  padding: '25px',
};

const greeting = {
  color: '#333333',
  fontSize: '18px',
  lineHeight: '1.6',
  margin: '16px 0',
};

const paragraph = {
  color: '#444444',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
};

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '0',
};

const footer = {
  backgroundColor: '#ffffff',
  borderRadius: '0 0 5px 5px',
  padding: '25px',
};

const footerText = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '1.5',
  textAlign: 'center' as const,
  margin: '8px 0',
};

export default InvoiceEmail;
