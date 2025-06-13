import React, { useState } from 'react';
import { CreditCard, Download, Eye, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

const BillingSettings = ({ onSettingsChange }) => {
  const [currentPlan, setCurrentPlan] = useState({
    name: 'Standard',
    price: 99,
    currency: 'USD',
    billing: 'monthly',
    features: ['إدارة الغرف', 'نظام الحجوزات', 'التقارير الأساسية', 'دعم فني'],
    nextBilling: '2024-02-15'
  });

  const [paymentMethod, setPaymentMethod] = useState({
    type: 'card',
    last4: '4242',
    expiry: '12/26',
    brand: 'Visa'
  });

  const [invoices] = useState([
    { id: 'INV-001', date: '2024-01-15', amount: 99, status: 'paid' },
    { id: 'INV-002', date: '2023-12-15', amount: 99, status: 'paid' },
    { id: 'INV-003', date: '2023-11-15', amount: 99, status: 'paid' }
  ]);

  const plans = [
    {
      name: 'Basic',
      price: 49,
      features: ['حتى 20 غرفة', 'حجوزات أساسية', 'دعم بريد إلكتروني']
    },
    {
      name: 'Standard',
      price: 99,
      features: ['حتى 100 غرفة', 'جميع الميزات', 'دعم هاتفي', 'تقارير متقدمة']
    },
    {
      name: 'Premium',
      price: 199,
      features: ['غرف غير محدودة', 'ميزات متقدمة', 'دعم أولوية', 'تخصيص كامل']
    }
  ];

  const handleSave = () => {
    toast.success('تم حفظ إعدادات الفواتير');
    if (onSettingsChange) onSettingsChange();
  };

  const downloadInvoice = (invoiceId) => {
    toast.success(`تم تحميل الفاتورة ${invoiceId}`);
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-5 h-5 text-sysora-primary" />
          <h3 className="text-lg font-semibold text-gray-900">الخطة الحالية</h3>
        </div>

        <div className="bg-gradient-to-r from-sysora-primary to-sysora-mint rounded-lg p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-bold">{currentPlan.name}</h4>
              <p className="text-white/80">الخطة النشطة حالياً</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${currentPlan.price}</div>
              <div className="text-white/80">شهرياً</div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-white/80">التجديد التالي: {currentPlan.nextBilling}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">الميزات المتاحة:</h5>
            <ul className="space-y-1">
              {currentPlan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-sysora-primary rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-center">
            <button className="px-6 py-2 bg-sysora-primary text-white rounded-lg hover:bg-sysora-primary/90 transition-colors">
              ترقية الخطة
            </button>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">الخطط المتاحة</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`border-2 rounded-lg p-6 transition-colors ${
                plan.name === currentPlan.name 
                  ? 'border-sysora-primary bg-sysora-primary/5' 
                  : 'border-gray-200 hover:border-sysora-primary/50'
              }`}
            >
              <div className="text-center mb-4">
                <h4 className="text-xl font-bold text-gray-900">{plan.name}</h4>
                <div className="text-3xl font-bold text-sysora-primary mt-2">${plan.price}</div>
                <div className="text-gray-600">شهرياً</div>
              </div>
              
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button 
                className={`w-full py-2 rounded-lg transition-colors ${
                  plan.name === currentPlan.name
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-sysora-primary text-white hover:bg-sysora-primary/90'
                }`}
                disabled={plan.name === currentPlan.name}
              >
                {plan.name === currentPlan.name ? 'الخطة الحالية' : 'اختيار الخطة'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">طريقة الدفع</h3>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
              {paymentMethod.brand}
            </div>
            <div>
              <div className="font-medium">•••• •••• •••• {paymentMethod.last4}</div>
              <div className="text-sm text-gray-600">انتهاء الصلاحية {paymentMethod.expiry}</div>
            </div>
          </div>
          <button className="px-4 py-2 text-sysora-primary border border-sysora-primary rounded-lg hover:bg-sysora-primary/5 transition-colors">
            تحديث
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">سجل الفواتير</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-medium text-gray-900">رقم الفاتورة</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">التاريخ</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">المبلغ</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">الحالة</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">{invoice.id}</td>
                  <td className="py-3 px-4">{invoice.date}</td>
                  <td className="py-3 px-4">${invoice.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      invoice.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status === 'paid' ? 'مدفوع' : 'معلق'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => downloadInvoice(invoice.id)}
                        className="p-1 text-gray-600 hover:text-sysora-primary transition-colors"
                        title="تحميل"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1 text-gray-600 hover:text-sysora-primary transition-colors"
                        title="عرض"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-sysora-primary text-white rounded-lg hover:bg-sysora-primary/90 transition-colors"
        >
          <Save className="w-4 h-4" />
          حفظ الإعدادات
        </button>
      </div>
    </div>
  );
};

export default BillingSettings;
