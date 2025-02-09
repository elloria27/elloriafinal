
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface InvoiceEmailProps {
  invoiceNumber: string;
  customerName: string;
  amount: string;
  dueDate: string;
  downloadUrl: string;
}

export const InvoiceEmail = ({
  invoiceNumber,
  customerName,
  amount,
  dueDate,
  downloadUrl,
}: InvoiceEmailProps) => (
  <Html>
    <Head />
    <Preview>Invoice #{invoiceNumber} from Elloria Eco Products</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Invoice #{invoiceNumber}</Heading>
        <Text style={text}>Dear {customerName},</Text>
        <Text style={text}>
          Please find attached your invoice #{invoiceNumber} for {amount}, due on {dueDate}.
        </Text>
        <Link
          href={downloadUrl}
          target="_blank"
          style={{
            ...link,
            display: 'block',
            marginBottom: '16px',
          }}
        >
          View Invoice
        </Link>
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
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.4',
  margin: '16px 0',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
}

const link = {
  color: '#2563eb',
  fontSize: '16px',
  textDecoration: 'underline',
}

const footer = {
  color: '#898989',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '48px 0 24px',
}
