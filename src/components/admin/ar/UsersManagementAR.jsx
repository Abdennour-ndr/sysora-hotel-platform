import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Building
} from 'lucide-react';

const UsersManagementAR = ({ users = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Mock data if no users provided
  const mockUsers = users.length > 0 ? users : [
    {
      _id: '1',
      fullName: 'أحمد محمد',
      email: 'ahmed@example.com',
      phone: '+966123456789',
      role: 'hotel_owner',
      status: 'active',
      hotelName: 'فندق الكبير',
      location: 'الرياض',
      joinDate: '2024-01-15',
      lastLogin: '2024-03-15'
    },
    {
      _id: '2',
      fullName: 'فاطمة علي',
      email: 'fatima@example.com',
      phone: '+966123456790',
      role: 'manager',
      status: 'active',
      hotelName: 'منتجع المدينة',
      location: 'جدة',
      joinDate: '2024-02-10',
      lastLogin: '2024-03-14'
    },
    {
      _id: '3',
      fullName: 'محمد سالم',
      email: 'mohammed@example.com',
      phone: '+966123456791',
      role: 'staff',
      status: 'inactive',
      hotelName: 'فندق الشاطئ',
      location: 'الدمام',
      joinDate: '2024-01-20',
      lastLogin: '2024-03-10'
    }
  ];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.hotelName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'نشط' },
      inactive: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'غير نشط' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'في الانتظار' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 ml-1" />
        {config.text}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      hotel_owner: { color: 'bg-purple-100 text-purple-800', text: 'مالك فندق' },
      manager: { color: 'bg-blue-100 text-blue-800', text: 'مدير' },
      staff: { color: 'bg-gray-100 text-gray-800', text: 'موظف' },
      admin: { color: 'bg-red-100 text-red-800', text: 'مشرف' }
    };

    const config = roleConfig[role] || roleConfig.staff;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Shield className="w-3 h-3 ml-1" />
        {config.text}
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
    <div className="space-y-4 sm:space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-sysora-midnight">إدارة المستخدمين</h2>
          <p className="text-sm sm:text-base text-gray-600">إدارة مستخدمي المنصة</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 space-x-reverse">
          <button className="bg-sysora-mint hover:bg-sysora-mint/90 text-sysora-midnight px-4 py-2 rounded-2xl font-medium transition-colors flex items-center justify-center space-x-2 space-x-reverse">
            <Download className="w-4 h-4" />
            <span className="text-sm sm:text-base">تصدير</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-2xl font-medium transition-colors flex items-center justify-center space-x-2 space-x-reverse">
            <Plus className="w-4 h-4" />
            <span className="text-sm sm:text-base">إضافة مستخدم</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-full lg:max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="البحث في المستخدمين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-9 sm:pr-10 pl-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint text-right"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 space-x-reverse">
            <div className="relative">
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="pr-9 pl-8 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint bg-white min-w-[140px] text-right"
              >
                <option value="all">جميع الأدوار</option>
                <option value="hotel_owner">مالك فندق</option>
                <option value="manager">مدير</option>
                <option value="staff">موظف</option>
                <option value="admin">مشرف</option>
              </select>
            </div>

            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pr-4 pl-8 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint bg-white min-w-[120px] text-right"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="pending">في الانتظار</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-lg sm:text-2xl font-bold text-sysora-midnight">{mockUsers.length}</p>
            <p className="text-xs sm:text-sm text-gray-600">إجمالي المستخدمين</p>
          </div>
          <div className="text-center">
            <p className="text-lg sm:text-2xl font-bold text-green-600">{mockUsers.filter(u => u.status === 'active').length}</p>
            <p className="text-xs sm:text-sm text-gray-600">نشط</p>
          </div>
          <div className="text-center">
            <p className="text-lg sm:text-2xl font-bold text-yellow-600">{mockUsers.filter(u => u.status === 'pending').length}</p>
            <p className="text-xs sm:text-sm text-gray-600">في الانتظار</p>
          </div>
          <div className="text-center">
            <p className="text-lg sm:text-2xl font-bold text-red-600">{mockUsers.filter(u => u.status === 'inactive').length}</p>
            <p className="text-xs sm:text-sm text-gray-600">غير نشط</p>
          </div>
        </div>
      </div>

      {/* Users Table/Cards */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المستخدم
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الدور
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الفندق
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ الانضمام
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-sysora-mint/10 rounded-2xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-sysora-mint" />
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="w-4 h-4 ml-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.hotelName}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <MapPin className="w-4 h-4 ml-1" />
                      {user.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(user.joinDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2 space-x-reverse">
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

        {/* Mobile/Tablet Cards */}
        <div className="lg:hidden p-4 space-y-4">
          {filteredUsers.map((user) => (
            <div key={user._id} className="bg-gray-50 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-12 h-12 bg-sysora-mint/10 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-sysora-mint" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{user.fullName}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(user.status)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">الدور</p>
                  <div className="mt-1">{getRoleBadge(user.role)}</div>
                </div>
                <div>
                  <p className="text-gray-500">الفندق</p>
                  <p className="font-medium text-gray-900">{user.hotelName}</p>
                </div>
                <div>
                  <p className="text-gray-500">الموقع</p>
                  <p className="text-gray-900">{user.location}</p>
                </div>
                <div>
                  <p className="text-gray-500">تاريخ الانضمام</p>
                  <p className="text-gray-900">{formatDate(user.joinDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-2 space-x-reverse pt-2 border-t border-gray-200">
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
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <Users className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-gray-500">لا يوجد مستخدمون يطابقون معايير البحث</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagementAR;
