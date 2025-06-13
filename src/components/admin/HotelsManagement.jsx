import React, { useState } from 'react';
import {
  Building,
  Users,
  Calendar,
  Globe,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  MoreVertical,
  MapPin,
  Mail,
  Phone,
  Star,
  Clock
} from 'lucide-react';

const HotelsManagement = ({ hotels = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedHotels, setSelectedHotels] = useState([]);

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.subdomain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && hotel.isActive) ||
                         (filterStatus === 'inactive' && !hotel.isActive) ||
                         (filterStatus === 'trial' && hotel.subscription?.plan === 'trial');
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (hotel) => {
    if (!hotel.isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          غير نشط
        </span>
      );
    }
    
    if (hotel.subscription?.plan === 'trial') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          تجريبي
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        نشط
      </span>
    );
  };

  const getPlanBadge = (plan) => {
    const planColors = {
      trial: 'bg-gray-100 text-gray-800',
      basic: 'bg-blue-100 text-blue-800',
      standard: 'bg-purple-100 text-purple-800',
      premium: 'bg-yellow-100 text-yellow-800',
      enterprise: 'bg-green-100 text-green-800'
    };

    const planNames = {
      trial: 'تجريبي',
      basic: 'أساسي',
      standard: 'قياسي',
      premium: 'مميز',
      enterprise: 'مؤسسي'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${planColors[plan] || planColors.trial}`}>
        {planNames[plan] || plan}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-sysora-midnight">إدارة الفنادق</h2>
          <p className="text-gray-600">عرض وإدارة جميع الفنادق المسجلة في المنصة</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="bg-sysora-mint hover:bg-sysora-mint/90 text-sysora-midnight px-4 py-2 rounded-2xl font-medium transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>تصدير</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث في الفنادق..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint bg-white"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="trial">تجريبي</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-sysora-midnight">{hotels.length}</p>
            <p className="text-sm text-gray-600">إجمالي الفنادق</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{hotels.filter(h => h.isActive).length}</p>
            <p className="text-sm text-gray-600">نشط</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{hotels.filter(h => h.subscription?.plan === 'trial').length}</p>
            <p className="text-sm text-gray-600">تجريبي</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{hotels.filter(h => !h.isActive).length}</p>
            <p className="text-sm text-gray-600">غير نشط</p>
          </div>
        </div>
      </div>

      {/* Hotels Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الفندق
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الخطة
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ التسجيل
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHotels.map((hotel) => (
                <tr key={hotel._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-sysora-mint/10 rounded-2xl flex items-center justify-center">
                        <Building className="w-6 h-6 text-sysora-mint" />
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">{hotel.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Globe className="w-4 h-4 mr-1" />
                          {hotel.subdomain}.sysora.app
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {hotel.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(hotel)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPlanBadge(hotel.subscription?.plan)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(hotel.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-sysora-mint hover:text-sysora-mint/80 p-2 rounded-xl hover:bg-sysora-mint/10 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 p-2 rounded-xl hover:bg-blue-50 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHotels.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد فنادق تطابق معايير البحث</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelsManagement;
