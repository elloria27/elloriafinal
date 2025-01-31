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
  Row,
  Column,
} from 'npm:@react-email/components@0.0.12'
import * as React from 'npm:react@18.3.1'

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    address: string;
    region: string;
    country: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  discount?: {
    code: string;
    amount: number;
  };
  taxes: {
    gst: number;
    amount: number;
  };
  shipping: {
    method: string;
    cost: number;
  };
  total: number;
}

const companyInfo = {
  name: 'Elloria Eco Products LTD.',
  address: '229 Dowling Ave W, Winnipeg, MB R3B 2B9',
  phone: '(204) 930-2019',
  email: 'sales@elloria.ca',
  gst: '742031420RT0001',
  logo: 'https://euexcsqvsbkxiwdieepu.supabase.co/storage/v1/object/public/media/logo.png'
};

export const OrderConfirmationEmail = ({
  orderNumber,
  customerName,
  customerEmail,
  customerPhone,
  shippingAddress,
  items,
  subtotal,
  discount,
  taxes,
  shipping,
  total,
}: OrderConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Thank you for your order #{orderNumber}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Logo and Header */}
        <Section style={logoContainer}>
          <Img
            src={companyInfo.logo}
            width="200"
            height="50"
            alt={companyInfo.name}
            style={logo}
          />
        </Section>

        <Heading style={h1}>Order Confirmation #{orderNumber}</Heading>
        
        {/* Company Info */}
        <Section style={section}>
          <Text style={text}>
            {companyInfo.name}<br />
            {companyInfo.address}<br />
            Phone: {companyInfo.phone}<br />
            Email: {companyInfo.email}<br />
            GST Number: {companyInfo.gst}
          </Text>
        </Section>

        {/* Customer Info */}
        <Section style={section}>
          <Heading style={h2}>Shipping Information</Heading>
          <Text style={text}>
            {customerName}<br />
            {shippingAddress.address}<br />
            {shippingAddress.region}, {shippingAddress.country}<br />
            Email: {customerEmail}<br />
            Phone: {customerPhone}
          </Text>
        </Section>

        {/* Order Items */}
        <Section style={section}>
          <Heading style={h2}>Order Details</Heading>
          {items.map((item, index) => (
            <Row key={index} style={itemRow}>
              <Column>
                <Text style={text}>{item.name}</Text>
              </Column>
              <Column>
                <Text style={text}>Qty: {item.quantity}</Text>
              </Column>
              <Column>
                <Text style={text}>${(item.price * item.quantity).toFixed(2)}</Text>
              </Column>
            </Row>
          ))}
        </Section>

        {/* Order Summary */}
        <Section style={section}>
          <Heading style={h2}>Order Summary</Heading>
          <Row style={summaryRow}>
            <Column>
              <Text style={text}>Subtotal:</Text>
            </Column>
            <Column>
              <Text style={text}>${subtotal.toFixed(2)}</Text>
            </Column>
          </Row>

          {discount && (
            <Row style={summaryRow}>
              <Column>
                <Text style={text}>Discount ({discount.code}):</Text>
              </Column>
              <Column>
                <Text style={text}>-${discount.amount.toFixed(2)}</Text>
              </Column>
            </Row>
          )}

          <Row style={summaryRow}>
            <Column>
              <Text style={text}>GST ({taxes.gst}%):</Text>
            </Column>
            <Column>
              <Text style={text}>${taxes.amount.toFixed(2)}</Text>
            </Column>
          </Row>

          <Row style={summaryRow}>
            <Column>
              <Text style={text}>Shipping ({shipping.method}):</Text>
            </Column>
            <Column>
              <Text style={text}>${shipping.cost.toFixed(2)}</Text>
            </Column>
          </Row>

          <Row style={summaryRow}>
            <Column>
              <Text style={totalText}>Total:</Text>
            </Column>
            <Column>
              <Text style={totalText}>${total.toFixed(2)}</Text>
            </Column>
          </Row>
        </Section>

        <Section style={section}>
          <Text style={thankYouText}>
            Thank you for choosing Elloria Eco Products! We appreciate your business.
          </Text>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            If you have any questions about your order, please contact us at{' '}
            <Link href={`mailto:${companyInfo.email}`} style={link}>
              {companyInfo.email}
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

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

const section = {
  padding: '20px 0',
  borderBottom: '1px solid #E5E5E5',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  padding: '0',
  margin: '0 0 20px',
};

const h2 = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  padding: '0',
  margin: '0 0 10px',
};

const text = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0',
};

const itemRow = {
  padding: '8px 0',
};

const summaryRow = {
  padding: '4px 0',
};

const totalText = {
  ...text,
  fontWeight: 'bold',
  fontSize: '16px',
};

const thankYouText = {
  ...text,
  fontSize: '16px',
  textAlign: 'center' as const,
  color: '#0094F4',
};

const footer = {
  padding: '20px 0',
  textAlign: 'center' as const,
};

const footerText = {
  ...text,
  fontSize: '12px',
  color: '#666',
};

const link = {
  color: '#0094F4',
  textDecoration: 'underline',
};

export default OrderConfirmationEmail;