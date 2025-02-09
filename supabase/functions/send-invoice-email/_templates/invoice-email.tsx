
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.12'
import * as React from 'npm:react@18.3.1'

interface InvoiceEmailProps {
  invoiceNumber: string;
  customerName: string;
  dueDate: string;
  totalAmount: number;
  currency: string;
  downloadUrl: string;
  customerPortalUrl?: string;
}

const companyInfo = {
  name: 'Elloria Eco Products LTD.',
  address: '229 Dowling Ave W, Winnipeg, MB R3B 2B9',
  phone: '(204) 930-2019',
  email: 'sales@elloria.ca',
  logo: 'https://euexcsqvsbkxiwdieepu.supabase.co/storage/v1/object/public/media/logo.png'
};

export const InvoiceEmail = ({
  invoiceNumber,
  customerName,
  dueDate,
  totalAmount,
  currency,
  downloadUrl,
  customerPortalUrl,
}: InvoiceEmailProps) => (
  <Html>
    <Head />
    <Preview>Invoice {invoiceNumber} from {companyInfo.name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src={companyInfo.logo}
            width="200"
            height="50"
            alt={companyInfo.name}
            style={logo}
          />
        </Section>

        <Heading style={h1}>Invoice {invoiceNumber}</Heading>
        
        <Text style={text}>Dear {customerName},</Text>
        
        <Text style={text}>
          Please find attached your invoice {invoiceNumber} for {currency} {totalAmount.toFixed(2)},
          due on {dueDate}.
        </Text>

        <Section style={buttonContainer}>
          <Link href={downloadUrl} style={button}>
            View Invoice
          </Link>
        </Section>

        {customerPortalUrl && (
          <Section style={buttonContainer}>
            <Link href={customerPortalUrl} style={secondaryButton}>
              Customer Portal
            </Link>
          </Section>
        )}

        <Text style={text}>
          If you have any questions, please don't hesitate to contact us at{' '}
          <Link href={`mailto:${companyInfo.email}`} style={link}>
            {companyInfo.email}
          </Link>
          .
        </Text>

        <Section style={footer}>
          <Text style={footerText}>
            {companyInfo.name}<br />
            {companyInfo.address}<br />
            Phone: {companyInfo.phone}<br />
            Email: {companyInfo.email}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default InvoiceEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
};

const logoContainer = {
  padding: '20px 0',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  padding: '0',
  margin: '40px 0 20px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '24px 0',
};

const buttonContainer = {
  padding: '27px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#0284c7',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 30px',
  margin: '0 auto',
};

const secondaryButton = {
  ...button,
  backgroundColor: '#4b5563',
};

const link = {
  color: '#2754C5',
  textDecoration: 'underline',
};

const footer = {
  borderTop: '1px solid #ddd',
  marginTop: '40px',
  padding: '20px 0',
};

const footerText = {
  fontSize: '12px',
  color: '#666',
  lineHeight: '20px',
  margin: 0,
  textAlign: 'center' as const,
};
