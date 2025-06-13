import React from 'react';
import { 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Info
} from 'lucide-react';

const PaymentDetailsCard = ({ 
  totalAmount, 
  paidAmount, 
  currency = 'DZD',
  showPercentage = true,
  showIcons = true,
  size = 'default' // 'small', 'default', 'large'
}) => {
  const remainingAmount = totalAmount - paidAmount;
  const isOverpaid = paidAmount > totalAmount;
  const isFullyPaid = paidAmount === totalAmount;
  const isPartiallyPaid = paidAmount > 0 && paidAmount < totalAmount;
  const isUnpaid = paidAmount === 0;

  const getPaymentStatus = () => {
    if (isOverpaid) return 'overpaid';
    if (isFullyPaid) return 'paid';
    if (isPartiallyPaid) return 'partial';
    return 'unpaid';
  };

  const getStatusConfig = () => {
    const status = getPaymentStatus();
    
    const configs = {
      overpaid: {
        color: 'emerald',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        textColor: 'text-emerald-800',
        icon: TrendingUp,
        label: 'Overpaid',
        description: 'Additional amount paid'
      },
      paid: {
        color: 'green',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        icon: CheckCircle,
        label: 'Fully Paid',
        description: 'Payment completed'
      },
      partial: {
        color: 'yellow',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800',
        icon: Clock,
        label: 'Partially Paid',
        description: 'Partial payment'
      },
      unpaid: {
        color: 'red',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        icon: AlertTriangle,
        label: 'Unpaid',
        description: 'No payment made'
      }
    };

    return configs[status];
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ar-DZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(Math.abs(amount));
  };

  const getPercentage = () => {
    if (totalAmount === 0) return 0;
    return Math.round((paidAmount / totalAmount) * 100);
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;
  const percentage = getPercentage();

  const sizeClasses = {
    small: {
      container: 'p-3',
      title: 'text-sm',
      amount: 'text-lg',
      icon: 'w-4 h-4',
      badge: 'px-2 py-1 text-xs'
    },
    default: {
      container: 'p-4',
      title: 'text-base',
      amount: 'text-xl',
      icon: 'w-5 h-5',
      badge: 'px-3 py-1 text-sm'
    },
    large: {
      container: 'p-6',
      title: 'text-lg',
      amount: 'text-2xl',
      icon: 'w-6 h-6',
      badge: 'px-4 py-2 text-base'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${classes.container} space-y-4`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showIcons && (
            <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg p-2`}>
              <StatusIcon className={`${classes.icon} ${statusConfig.textColor}`} />
            </div>
          )}
          <div>
            <h3 className={`font-semibold text-gray-900 ${classes.title}`}>Payment Details</h3>
            <p className="text-sm text-gray-500">{statusConfig.description}</p>
          </div>
        </div>
        
        <div className={`${statusConfig.bgColor} ${statusConfig.textColor} ${classes.badge} rounded-full font-medium`}>
          {statusConfig.label}
          {showPercentage && percentage !== 100 && (
            <span className="ml-1">({percentage}%)</span>
          )}
        </div>
      </div>

      {/* Payment Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Amount */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Amount</p>
              <p className={`font-bold text-blue-800 ${classes.amount}`}>
                {formatAmount(totalAmount)} {currency}
              </p>
            </div>
            <DollarSign className={`${classes.icon} text-blue-500`} />
          </div>
        </div>

        {/* Paid Amount */}
        <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg p-3`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${statusConfig.textColor}`}>Amount Paid</p>
              <p className={`font-bold ${statusConfig.textColor} ${classes.amount}`}>
                {formatAmount(paidAmount)} {currency}
              </p>
            </div>
            <CreditCard className={`${classes.icon} ${statusConfig.textColor}`} />
          </div>
        </div>

        {/* Remaining/Excess Amount */}
        <div className={`rounded-lg p-3 ${
          isOverpaid 
            ? 'bg-emerald-50 border border-emerald-200' 
            : isFullyPaid
              ? 'bg-gray-50 border border-gray-200'
              : 'bg-orange-50 border border-orange-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isOverpaid 
                  ? 'text-emerald-600' 
                  : isFullyPaid
                    ? 'text-gray-600'
                    : 'text-orange-600'
              }`}>
                {isOverpaid ? 'Overpaid Amount' : isFullyPaid ? 'Completed' : 'Remaining Amount'}
              </p>
              <p className={`font-bold ${classes.amount} ${
                isOverpaid 
                  ? 'text-emerald-800' 
                  : isFullyPaid
                    ? 'text-gray-800'
                    : 'text-orange-800'
              }`}>
                {isFullyPaid ? (
                  '0 ' + currency
                ) : isOverpaid ? (
                  `+${formatAmount(Math.abs(remainingAmount))} ${currency}`
                ) : (
                  `${formatAmount(remainingAmount)} ${currency}`
                )}
              </p>
            </div>
            {isOverpaid ? (
              <Plus className={`${classes.icon} text-emerald-500`} />
            ) : isFullyPaid ? (
              <CheckCircle className={`${classes.icon} text-gray-500`} />
            ) : (
              <Minus className={`${classes.icon} text-orange-500`} />
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {!isFullyPaid && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Payment Progress</span>
            <span className={`font-medium ${
              isOverpaid ? 'text-emerald-600' : 'text-gray-900'
            }`}>
              {percentage}%
              {isOverpaid && ` (+${percentage - 100}%)`}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                isOverpaid 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : isPartiallyPaid
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    : 'bg-gray-300'
              }`}
              style={{ 
                width: `${Math.min(percentage, 100)}%` 
              }}
            />
          </div>
          {isOverpaid && (
            <div className="w-full bg-emerald-200 rounded-full h-1 -mt-1">
              <div
                className="h-1 rounded-full bg-emerald-500 transition-all duration-500"
                style={{ 
                  width: `${Math.min(percentage - 100, 100)}%` 
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Additional Info */}
      {isOverpaid && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-emerald-800">
              <p className="font-medium">Additional amount paid</p>
              <p className="text-emerald-700 mt-1">
                The overpaid amount can be considered as an advance payment for future reservations or can be refunded to the customer according to hotel policy.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDetailsCard;
