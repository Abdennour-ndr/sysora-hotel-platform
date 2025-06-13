import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Phone, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

const NotificationSettings = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState({
    emailNotifications: {
      newBooking: true,
      paymentReceived: true,
      checkIn: false,
      checkOut: false,
      cancellation: true
    },
    smsNotifications: {
      newBooking: false,
      paymentReceived: false,
      checkIn: true,
      checkOut: true,
      cancellation: false
    },
    pushNotifications: {
      newBooking: true,
      paymentReceived: true,
      checkIn: true,
      checkOut: true,
      cancellation: true
    }
  });

  const handleSave = () => {
    toast.success('تم حفظ إعدادات التنبيهات');
    if (onSettingsChange) onSettingsChange();
  };

  const updateSetting = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
    if (onSettingsChange) onSettingsChange();
  };

  const NotificationToggle = ({ category, setting, label, icon: Icon }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-gray-600" />
        <span className="font-medium text-gray-900">{label}</span>
      </div>
      <button
        onClick={() => updateSetting(category, setting, !settings[category][setting])}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          settings[category][setting] ? 'bg-sysora-primary' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            settings[category][setting] ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-5 h-5 text-sysora-primary" />
          <h3 className="text-lg font-semibold text-gray-900">تنبيهات البريد الإلكتروني</h3>
        </div>
        <div className="space-y-3">
          <NotificationToggle 
            category="emailNotifications" 
            setting="newBooking" 
            label="حجز جديد" 
            icon={Bell} 
          />
          <NotificationToggle 
            category="emailNotifications" 
            setting="paymentReceived" 
            label="دفعة مستلمة" 
            icon={Bell} 
          />
          <NotificationToggle 
            category="emailNotifications" 
            setting="checkIn" 
            label="تسجيل وصول" 
            icon={Bell} 
          />
          <NotificationToggle 
            category="emailNotifications" 
            setting="checkOut" 
            label="تسجيل مغادرة" 
            icon={Bell} 
          />
          <NotificationToggle 
            category="emailNotifications" 
            setting="cancellation" 
            label="إلغاء حجز" 
            icon={Bell} 
          />
        </div>
      </div>

      {/* SMS Notifications */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-5 h-5 text-sysora-primary" />
          <h3 className="text-lg font-semibold text-gray-900">تنبيهات الرسائل النصية</h3>
        </div>
        <div className="space-y-3">
          <NotificationToggle 
            category="smsNotifications" 
            setting="newBooking" 
            label="حجز جديد" 
            icon={Phone} 
          />
          <NotificationToggle 
            category="smsNotifications" 
            setting="paymentReceived" 
            label="دفعة مستلمة" 
            icon={Phone} 
          />
          <NotificationToggle 
            category="smsNotifications" 
            setting="checkIn" 
            label="تسجيل وصول" 
            icon={Phone} 
          />
          <NotificationToggle 
            category="smsNotifications" 
            setting="checkOut" 
            label="تسجيل مغادرة" 
            icon={Phone} 
          />
          <NotificationToggle 
            category="smsNotifications" 
            setting="cancellation" 
            label="إلغاء حجز" 
            icon={Phone} 
          />
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-sysora-primary" />
          <h3 className="text-lg font-semibold text-gray-900">التنبيهات الفورية</h3>
        </div>
        <div className="space-y-3">
          <NotificationToggle 
            category="pushNotifications" 
            setting="newBooking" 
            label="حجز جديد" 
            icon={Bell} 
          />
          <NotificationToggle 
            category="pushNotifications" 
            setting="paymentReceived" 
            label="دفعة مستلمة" 
            icon={Bell} 
          />
          <NotificationToggle 
            category="pushNotifications" 
            setting="checkIn" 
            label="تسجيل وصول" 
            icon={Bell} 
          />
          <NotificationToggle 
            category="pushNotifications" 
            setting="checkOut" 
            label="تسجيل مغادرة" 
            icon={Bell} 
          />
          <NotificationToggle 
            category="pushNotifications" 
            setting="cancellation" 
            label="إلغاء حجز" 
            icon={Bell} 
          />
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

export default NotificationSettings;
