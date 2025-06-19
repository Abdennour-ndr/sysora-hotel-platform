import React, { useState } from 'react';
import {
  LayoutDashboard,
  Bed,
  UserCheck,
  Users,
  ClipboardList,
  Calendar,
  FileText,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react';
import { cn } from '../../utils/cn';

const ModernSidebar = ({ activeTab, onTabChange, collapsed, onToggleCollapse }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigationItems = [
    {
      id: 'overview',
      name: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & metrics'
    },
    {
      id: 'rooms',
      name: 'Rooms',
      icon: Bed,
      description: 'Room status & management'
    },
    {
      id: 'checkin-checkout',
      name: 'Check-In/Out',
      icon: UserCheck,
      description: 'Guest arrivals & departures'
    },
    {
      id: 'guests',
      name: 'Guests',
      icon: Users,
      description: 'Guest profiles & lookup'
    },
    {
      id: 'housekeeping',
      name: 'Housekeeping',
      icon: ClipboardList,
      description: 'Tasks & assignments'
    },
    {
      id: 'reservations',
      name: 'Reservations',
      icon: Calendar,
      description: 'Booking management'
    },
    {
      id: 'shift-report',
      name: 'Reports',
      icon: FileText,
      description: 'Shift summaries'
    }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={cn(
        "flex items-center px-6 py-5 border-b border-gray-200",
        collapsed ? "justify-center px-4" : "justify-between"
      )}>
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Sysora</h1>
              <p className="text-xs text-gray-500">Hotel Management</p>
            </div>
          </div>
        )}
        
        {/* Desktop collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className={cn(
            "w-4 h-4 text-gray-600 transition-transform",
            collapsed && "rotate-180"
          )} />
        </button>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setMobileOpen(false);
              }}
              className={cn(
                "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
                collapsed ? "justify-center" : "justify-start"
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={cn(
                "w-5 h-5 flex-shrink-0",
                isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700",
                !collapsed && "mr-3"
              )} />
              
              {!collapsed && (
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.name}</div>
                  <div className={cn(
                    "text-xs mt-0.5",
                    isActive ? "text-gray-300" : "text-gray-500"
                  )}>
                    {item.description}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={cn(
        "px-4 py-4 border-t border-gray-200",
        collapsed ? "text-center" : ""
      )}>
        {!collapsed ? (
          <div className="text-xs text-gray-500">
            <div className="font-medium text-gray-700 mb-1">Sysora PMS</div>
            <div>Professional Edition</div>
          </div>
        ) : (
          <div className="w-2 h-2 bg-emerald-500 rounded-full mx-auto" title="System Online" />
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div 
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex flex-col w-80 bg-white shadow-xl">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={cn(
        "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 transition-all duration-300",
        collapsed ? "lg:w-20" : "lg:w-80"
      )}>
        <SidebarContent />
      </div>
    </>
  );
};

export default ModernSidebar;
