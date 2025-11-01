import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Cloud,
  Handshake,
  Users,
  Server,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  FolderTree,
  FileText,
  TrendingUp,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Submissions', href: '/submissions', icon: FileText },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
    { name: 'Partners', href: '/partners', icon: Handshake },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Services', href: '/services', icon: Server },
    { name: 'Categories', href: '/categories', icon: FolderTree },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/users/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-600 to-purple-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-black bg-opacity-20">
          <div className="flex items-center">
            <Cloud className="h-8 w-8 text-white" />
            <span className="ml-2 text-xl font-bold text-white">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? 'bg-white bg-opacity-30 text-black shadow-lg'
                        : 'text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-black'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon
                    className={`
                      mr-3 h-5 w-5 transition-colors duration-200
                      ${isActive ? 'text-black' : 'text-black'}
                    `}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-blue-100 rounded-lg hover:bg-white hover:bg-opacity-10 hover:text-white transition-all duration-200"
          >
            <LogOut className="mr-3 h-5 w-5 text-black" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Welcome, Admin</span>
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
