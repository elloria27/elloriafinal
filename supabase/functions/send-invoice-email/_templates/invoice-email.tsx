
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Button,
  Hr,
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
        <Section style={logoContainer}>
          <Heading style={h1}>Elloria Eco Products</Heading>
        </Section>
        
        <Section style={section}>
          <Text style={greeting}>Dear {customerName},</Text>
          <Text style={text}>
            Please find attached your invoice #{invoiceNumber} for {amount}, due on {dueDate}.
          </Text>
          
          <Text style={text}>
            This invoice has been attached to this email as a PDF file for your records.
          </Text>
        </Section>
        
        <Hr style={hr} />
        
        <Section style={footer}>
          <Text style={footerText}>
            Elloria Eco Products LTD.<br />
            229 Dowling Ave W, Winnipeg, MB R3B 2B9<br />
            (204) 930-2019<br />
            sales@elloria.ca
          </Text>
          <Text style={footerText}>
            GST Number: 742031420RT0001
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default InvoiceEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '40px 0',
  width: '560px',
}

const logoContainer = {
  padding: '25px',
  backgroundColor: '#ffffff',
  borderRadius: '5px 5px 0 0',
  borderBottom: '1px solid #e6ebf1',
}

const section = {
  backgroundColor: '#ffffff',
  padding: '25px',
}

const h1 = {
  color: '#484848',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.4',
  margin: '0',
  textAlign: 'center' as const,
}

const greeting = {
  color: '#484848',
  fontSize: '18px',
  lineHeight: '1.6',
  margin: '16px 0',
}

const text = {
  color: '#484848',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '0',
}

const footer = {
  backgroundColor: '#ffffff',
  borderRadius: '0 0 5px 5px',
  padding: '25px',
}

const footerText = {
  color: '#777',
  fontSize: '14px',
  lineHeight: '1.5',
  textAlign: 'center' as const,
  margin: '8px 0',
}
