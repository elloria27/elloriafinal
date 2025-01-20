import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Printer, ShoppingBag, UserCircle } from "lucide-react";

interface OrderDetails {
  orderId?: string;
  items: any[];
  subtotal: number;
  taxes: { gst: number; pst: number; hst: number; };
  shipping: { name: string; price: number; };
  total: number;
  currency: string;
  customerDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    country: string;
    region: string;
  };
}

const STORE_DETAILS = {
  name: "Elloria Store",
  address: "123 Fashion Avenue",
  city: "New York, NY 10001",
  country: "United States",
  phone: "+1 (555) 123-4567",
  email: "support@elloria.com",
  taxId: "TAX-123456789"
};

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [orderStatus] = useState("Processing");

  useEffect(() => {
    const storedOrder = localStorage.getItem('lastOrder');
    if (storedOrder) {
      const parsedOrder = JSON.parse(storedOrder);
      if (!parsedOrder.orderId) {
        const orderId = generateOrderId();
        const orderWithId = { ...parsedOrder, orderId };
        localStorage.setItem('lastOrder', JSON.stringify(orderWithId));
        setOrderDetails(orderWithId);
      } else {
        setOrderDetails(parsedOrder);
      }
    }
  }, []);

  const generateOrderId = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !orderDetails) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Invoice - ${orderDetails.orderId}</title>
          <style>
            @page {
              size: A4;
              margin: 2cm;
            }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 2rem;
              padding-bottom: 1rem;
              border-bottom: 2px solid #eee;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 2rem;
              margin-bottom: 2rem;
            }
            .info-section h3 {
              margin-bottom: 0.5rem;
              color: #666;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 2rem;
            }
            .items-table th, .items-table td {
              padding: 0.5rem;
              text-align: left;
              border-bottom: 1px solid #eee;
            }
            .totals {
              margin-left: auto;
              width: 300px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 0.5rem 0;
            }
            .final-total {
              font-weight: bold;
              border-top: 2px solid #eee;
              padding-top: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <h1>Order Invoice</h1>
              <p>Order #${orderDetails.orderId}</p>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="info-grid">
              <div class="info-section">
                <h3>Store Information</h3>
                <p>${STORE_DETAILS.name}</p>
                <p>${STORE_DETAILS.address}</p>
                <p>${STORE_DETAILS.city}</p>
                <p>${STORE_DETAILS.country}</p>
                <p>Phone: ${STORE_DETAILS.phone}</p>
                <p>Email: ${STORE_DETAILS.email}</p>
                <p>Tax ID: ${STORE_DETAILS.taxId}</p>
              </div>
              
              <div class="info-section">
                <h3>Customer Information</h3>
                <p>${orderDetails.customerDetails?.firstName} ${orderDetails.customerDetails?.lastName}</p>
                <p>${orderDetails.customerDetails?.address}</p>
                <p>${orderDetails.customerDetails?.region}</p>
                <p>${orderDetails.customerDetails?.country}</p>
                <p>Phone: ${orderDetails.customerDetails?.phone}</p>
                <p>Email: ${orderDetails.customerDetails?.email}</p>
              </div>
            </div>

            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderDetails.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${orderDetails.currency} ${item.price.toFixed(2)}</td>
                    <td>${orderDetails.currency} ${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="totals">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>${orderDetails.currency} ${orderDetails.subtotal.toFixed(2)}</span>
              </div>
              ${orderDetails.taxes.gst > 0 ? `
                <div class="total-row">
                  <span>GST (${orderDetails.taxes.gst}%):</span>
                  <span>${orderDetails.currency} ${(orderDetails.subtotal * orderDetails.taxes.gst / 100).toFixed(2)}</span>
                </div>
              ` : ''}
              ${orderDetails.taxes.pst > 0 ? `
                <div class="total-row">
                  <span>PST (${orderDetails.taxes.pst}%):</span>
                  <span>${orderDetails.currency} ${(orderDetails.subtotal * orderDetails.taxes.pst / 100).toFixed(2)}</span>
                </div>
              ` : ''}
              ${orderDetails.taxes.hst > 0 ? `
                <div class="total-row">
                  <span>HST (${orderDetails.taxes.hst}%):</span>
                  <span>${orderDetails.currency} ${(orderDetails.subtotal * orderDetails.taxes.hst / 100).toFixed(2)}</span>
                </div>
              ` : ''}
              <div class="total-row">
                <span>Shipping (${orderDetails.shipping.name}):</span>
                <span>${orderDetails.currency} ${orderDetails.shipping.price.toFixed(2)}</span>
              </div>
              <div class="total-row final-total">
                <span>Total:</span>
                <span>${orderDetails.currency} ${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-lg shadow-lg"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">Order Confirmation</h1>
          <div className="text-lg text-gray-600">
            <p>Order #{orderDetails?.orderId}</p>
            <p className="mt-2">Status: <span className="font-semibold text-orange-500">{orderStatus}</span></p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-2">Store Information</h3>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{STORE_DETAILS.name}</p>
              <p>{STORE_DETAILS.address}</p>
              <p>{STORE_DETAILS.city}</p>
              <p>{STORE_DETAILS.country}</p>
              <p>Phone: {STORE_DETAILS.phone}</p>
              <p>Email: {STORE_DETAILS.email}</p>
              <p>Tax ID: {STORE_DETAILS.taxId}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Customer Information</h3>
            <div className="space-y-1 text-sm">
              <p>{orderDetails?.customerDetails?.firstName} {orderDetails?.customerDetails?.lastName}</p>
              <p>{orderDetails?.customerDetails?.address}</p>
              <p>{orderDetails?.customerDetails?.region}</p>
              <p>{orderDetails?.customerDetails?.country}</p>
              <p>Phone: {orderDetails?.customerDetails?.phone}</p>
              <p>Email: {orderDetails?.customerDetails?.email}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {orderDetails?.items.map((item, index) => (
            <div key={index} className="flex gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-contain rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-primary">
                  {orderDetails?.currency} {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{orderDetails?.currency} {orderDetails?.subtotal.toFixed(2)}</span>
          </div>

          {orderDetails?.taxes.gst > 0 && (
            <div className="flex justify-between text-sm">
              <span>GST ({orderDetails?.taxes.gst}%)</span>
              <span>{orderDetails?.currency} {(orderDetails?.subtotal * orderDetails?.taxes.gst / 100).toFixed(2)}</span>
            </div>
          )}

          {orderDetails?.taxes.pst > 0 && (
            <div className="flex justify-between text-sm">
              <span>PST ({orderDetails?.taxes.pst}%)</span>
              <span>{orderDetails?.currency} {(orderDetails?.subtotal * orderDetails?.taxes.pst / 100).toFixed(2)}</span>
            </div>
          )}

          {orderDetails?.taxes.hst > 0 && (
            <div className="flex justify-between text-sm">
              <span>HST ({orderDetails?.taxes.hst}%)</span>
              <span>{orderDetails?.currency} {(orderDetails?.subtotal * orderDetails?.taxes.hst / 100).toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span>Shipping ({orderDetails?.shipping.name})</span>
            <span>{orderDetails?.currency} {orderDetails?.shipping.price.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-medium pt-2 border-t">
            <span>Total</span>
            <span>{orderDetails?.currency} {orderDetails?.total.toFixed(2)}</span>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <Button onClick={handlePrint} variant="outline" className="gap-2">
          <Printer className="w-4 h-4" />
          Print Invoice
        </Button>
        <Button onClick={() => navigate("/login")} variant="default" className="gap-2">
          <UserCircle className="w-4 h-4" />
          Sign In
        </Button>
        <Button onClick={() => navigate("/")} variant="secondary" className="gap-2">
          <ShoppingBag className="w-4 h-4" />
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default OrderSuccess;
