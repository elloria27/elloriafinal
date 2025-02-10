
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
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
          <Heading style={h1}>Elloria Eco Products</Heading>
        </Section>
        
        <Section style={section}>
          <Text style={text}>Dear {customerName},</Text>
          <Text style={text}>
            Please find attached your invoice #{invoiceNumber} for {amount}, due on {dueDate}.
          </Text>
        </Section>

        <Section style={section}>
          <Text style={text}>
            Your invoice has been attached to this email as a PDF document. Please review it and ensure payment is made by the due date.
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={section}>
          <Text style={text}>
            If you have any questions about this invoice, please don't hesitate to contact us.
          </Text>
        </Section>

        <Text style={footer}>
          Thank you for your business!<br />
          Elloria Eco Products LTD.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InvoiceEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 0',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}

const logo = {
  padding: '0 40px',
  marginBottom: '30px',
}

const h1 = {
  color: '#484848',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.4',
  margin: '16px 0',
  textAlign: 'center' as const,
}

const section = {
  padding: '0 40px',
}

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '22px',
  textAlign: 'center' as const,
  margin: '48px 0 24px',
}
