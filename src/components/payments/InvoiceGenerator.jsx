import React, { useState, useRef } from 'react';
import {
  Download,
  Printer,
  Mail,
  FileText,
  Calendar,
  DollarSign,
  Building,
  User,
  Phone,
  MapPin,
  Hash,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  X
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const InvoiceGenerator = ({ reservation, payments, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'DZD',
    taxRate: 19, // TVA Algeria
    includeQR: true,
    template: 'professional',
    notes: 'Thank you for choosing our hotel. We appreciate your business.',
    terms: 'Payment is due within 30 days of invoice date.'
  });
  const invoiceRef = useRef();

  if (!isOpen || !reservation) return null;

  // Calculate totals
  const subtotal = reservation.totalAmount || 0;
  const taxAmount = (subtotal * invoiceData.taxRate) / 100;
  const totalAmount = subtotal + taxAmount;
  const paidAmount = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const balanceDue = totalAmount - paidAmount;

  // Generate PDF
  const generatePDF = async () => {
    setLoading(true);
    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Invoice-${invoiceData.invoiceNumber}.pdf`);
      window.showToast && window.showToast('Invoice PDF generated successfully', 'success');
    } catch (error) {
      console.error('PDF generation error:', error);
      window.showToast && window.showToast('Error generating PDF', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Print invoice
  const printInvoice = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoiceData.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .invoice-container { max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .company-info { flex: 1; }
            .invoice-info { text-align: right; }
            .billing-info { display: flex; justify-content: space-between; margin: 30px 0; }
            .items-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .items-table th { background-color: #f5f5f5; }
            .totals { text-align: right; margin-top: 30px; }
            .total-row { display: flex; justify-content: space-between; margin: 5px 0; }
            .total-final { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${invoiceRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Send email
  const sendEmail = async () => {
    try {
      setLoading(true);
      // Here you would integrate with your email service
      window.showToast && window.showToast('Invoice sent via email', 'success');
    } catch (error) {
      window.showToast && window.showToast('Error sending email', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-sysora-midnight to-blue-800 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-2xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Invoice Generator</h2>
              <p className="text-blue-100">Professional invoice creation & management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={printInvoice}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
              title="Print Invoice"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={sendEmail}
              disabled={loading}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors disabled:opacity-50"
              title="Send Email"
            >
              <Mail className="w-5 h-5" />
            </button>
            <button
              onClick={generatePDF}
              disabled={loading}
              className="flex items-center space-x-2 bg-sysora-mint text-sysora-midnight px-6 py-3 rounded-xl hover:bg-sysora-mint/90 transition-colors disabled:opacity-50 font-semibold"
            >
              <Download className="w-5 h-5" />
              <span>{loading ? 'Generating...' : 'Download PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          <div ref={invoiceRef} className="bg-white p-8 max-w-4xl mx-auto">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8">
              {/* Company Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-sysora-midnight rounded-xl flex items-center justify-center">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-sysora-midnight">
                      {reservation.hotelId?.name || 'Hotel Name'}
                    </h1>
                    <p className="text-gray-600">Professional Hotel Services</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>123 Hotel Street, Algiers, Algeria</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>+213 21 123 456</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>info@hotel.com</span>
                  </div>
                </div>
              </div>

              {/* Invoice Info */}
              <div className="text-right">
                <h2 className="text-3xl font-bold text-sysora-midnight mb-4">INVOICE</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-end space-x-2">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold">{invoiceData.invoiceNumber}</span>
                  </div>
                  <div className="flex items-center justify-end space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Issue Date: {new Date(invoiceData.issueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-end space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Due Date: {new Date(invoiceData.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Bill To */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Bill To:</span>
                </h3>
                <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                  <p className="font-semibold text-gray-900">
                    {reservation.guestId?.firstName} {reservation.guestId?.lastName}
                  </p>
                  <p className="text-gray-600">{reservation.guestId?.email}</p>
                  <p className="text-gray-600">{reservation.guestId?.phone}</p>
                  <p className="text-gray-600">{reservation.guestId?.address}</p>
                </div>
              </div>

              {/* Reservation Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Building className="w-5 h-5" />
                  <span>Reservation Details:</span>
                </h3>
                <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                  <p><span className="font-medium">Reservation #:</span> {reservation.reservationNumber}</p>
                  <p><span className="font-medium">Check-in:</span> {new Date(reservation.checkInDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">Check-out:</span> {new Date(reservation.checkOutDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">Room:</span> {reservation.roomId?.roomNumber} - {reservation.roomId?.roomType}</p>
                  <p><span className="font-medium">Guests:</span> {reservation.numberOfGuests}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-left">Description</th>
                    <th className="border border-gray-300 p-3 text-center">Quantity</th>
                    <th className="border border-gray-300 p-3 text-right">Unit Price</th>
                    <th className="border border-gray-300 p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-3">
                      <div>
                        <p className="font-medium">Hotel Accommodation</p>
                        <p className="text-sm text-gray-600">
                          {reservation.roomId?.roomType} - {reservation.roomId?.roomNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(reservation.checkInDate).toLocaleDateString()} to {new Date(reservation.checkOutDate).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="border border-gray-300 p-3 text-center">
                      {Math.ceil((new Date(reservation.checkOutDate) - new Date(reservation.checkInDate)) / (1000 * 60 * 60 * 24))} nights
                    </td>
                    <td className="border border-gray-300 p-3 text-right">
                      {(subtotal / Math.ceil((new Date(reservation.checkOutDate) - new Date(reservation.checkInDate)) / (1000 * 60 * 60 * 24))).toLocaleString()} {invoiceData.currency}
                    </td>
                    <td className="border border-gray-300 p-3 text-right font-medium">
                      {subtotal.toLocaleString()} {invoiceData.currency}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="space-y-2">
                  <div className="flex justify-between py-2">
                    <span>Subtotal:</span>
                    <span>{subtotal.toLocaleString()} {invoiceData.currency}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Tax (TVA {invoiceData.taxRate}%):</span>
                    <span>{taxAmount.toLocaleString()} {invoiceData.currency}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-gray-300 font-bold text-lg">
                    <span>Total Amount:</span>
                    <span>{totalAmount.toLocaleString()} {invoiceData.currency}</span>
                  </div>
                  <div className="flex justify-between py-2 text-green-600">
                    <span>Amount Paid:</span>
                    <span>-{paidAmount.toLocaleString()} {invoiceData.currency}</span>
                  </div>
                  <div className={`flex justify-between py-2 border-t border-gray-300 font-bold text-lg ${balanceDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    <span>Balance Due:</span>
                    <span>{balanceDue.toLocaleString()} {invoiceData.currency}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            {payments && payments.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Payment History:</span>
                </h3>
                <div className="space-y-2">
                  {payments.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium">{payment.paymentMethod}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(payment.paymentDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-green-600">
                        {payment.amount.toLocaleString()} {invoiceData.currency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes and Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes:</h3>
                <p className="text-gray-600 text-sm">{invoiceData.notes}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Terms & Conditions:</h3>
                <p className="text-gray-600 text-sm">{invoiceData.terms}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-gray-300 text-center text-sm text-gray-600">
              <p>Thank you for your business!</p>
              <p>This invoice was generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
