
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
  customerName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  pdfUrl?: string;
}

export const InvoiceEmail = ({
  customerName,
  invoiceNumber,
  amount,
  dueDate,
  pdfUrl,
}: InvoiceEmailProps) => (
  <Html>
    <Head />
    <Preview>Invoice #{invoiceNumber} from Elloria Eco Products</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Invoice #{invoiceNumber}</Heading>
        <Text style={text}>Dear {customerName},</Text>
        <Text style={text}>
          Please find attached your invoice #{invoiceNumber} for CAD ${amount.toFixed(2)}, due on {dueDate}.
        </Text>
        {pdfUrl && (
          <Link href={pdfUrl} target="_blank" style={link}>
            View Invoice PDF
          </Link>
        )}
        <Text style={text}>
          If you have any questions, please don't hesitate to contact us.
        </Text>
        <Text style={footer}>
          Best regards,<br />
          Elloria Eco Products Team
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
  lineHeight: '1.3',
  margin: '16px 0',
}

const text = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const link = {
  color: '#2754C5',
  fontSize: '16px',
  textDecoration: 'underline',
  margin: '16px 0',
  display: 'block',
}

const footer = {
  color: '#898989',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '32px 0',
}
