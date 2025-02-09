
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
  Row,
  Column,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface InvoiceEmailProps {
  invoiceNumber: string;
  customerName: string;
  amount: string;
  dueDate: string;
  pdfUrl?: string;
}

export const InvoiceEmail = ({
  invoiceNumber,
  customerName,
  amount,
  dueDate,
  pdfUrl,
}: InvoiceEmailProps) => (
  <Html>
    <Head />
    <Preview>Invoice #{invoiceNumber} from Elloria Eco Products</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Invoice from Elloria Eco Products</Heading>
        <Text style={text}>Dear {customerName},</Text>
        <Text style={text}>
          Your invoice #{invoiceNumber} has been generated and is now available.
        </Text>
        
        <Section style={section}>
          <Row>
            <Column>
              <Text style={label}>Amount Due:</Text>
              <Text style={value}>{amount}</Text>
            </Column>
            <Column>
              <Text style={label}>Due Date:</Text>
              <Text style={value}>{dueDate}</Text>
            </Column>
          </Row>
        </Section>

        {pdfUrl && (
          <Link href={pdfUrl} style={button}>
            View Invoice PDF
          </Link>
        )}

        <Text style={footer}>
          If you have any questions, please don't hesitate to contact us.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InvoiceEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const section = {
  backgroundColor: '#f7f7f7',
  padding: '24px',
  margin: '24px 0',
  borderRadius: '4px',
}

const label = {
  color: '#666',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  margin: '0',
}

const value = {
  color: '#333',
  fontSize: '16px',
  margin: '4px 0 24px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  margin: '24px 0',
}

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '4px',
  color: '#fff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '24px 0',
  padding: '12px 24px',
  textDecoration: 'none',
  textAlign: 'center' as const,
}

const footer = {
  color: '#898989',
  fontSize: '14px',
  margin: '48px 0 24px',
}
