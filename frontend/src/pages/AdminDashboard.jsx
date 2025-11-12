import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { FiPackage, FiDollarSign, FiUsers, FiCalendar } from 'react-icons/fi';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminVisits from './AdminVisits';

function AdminHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/admin/dashboard');
      setStats(res.data.statistics);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-3xl font-bold">{stats?.totalOrders || 0}</p>
            </div>
            <FiPackage className="text-4xl text-amber-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Revenue</p>
              <p className="text-3xl font-bold">Ksh {(stats?.totalRevenue || 0).toLocaleString()}</p>
            </div>
            <FiDollarSign className="text-4xl text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
            </div>
            <FiUsers className="text-4xl text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Visits</p>
              <p className="text-3xl font-bold">{stats?.pendingVisits || 0}</p>
            </div>
            <FiCalendar className="text-4xl text-yellow-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-amber-600">Admin Panel</h2>
        </div>
        <nav className="space-y-1">
          <Link
            to="/admin"
            className={`block px-6 py-3 ${
              location.pathname === '/admin' 
                ? 'bg-amber-50 text-amber-600 border-r-4 border-amber-600' 
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/products"
            className={`block px-6 py-3 ${
              location.pathname.includes('/admin/products') 
                ? 'bg-amber-50 text-amber-600 border-r-4 border-amber-600' 
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            Products
          </Link>
          <Link
            to="/admin/orders"
            className={`block px-6 py-3 ${
              location.pathname.includes('/admin/orders') 
                ? 'bg-amber-50 text-amber-600 border-r-4 border-amber-600' 
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            Orders
          </Link>
          <Link
            to="/admin/visits"
            className={`block px-6 py-3 ${
              location.pathname.includes('/admin/visits') 
                ? 'bg-amber-50 text-amber-600 border-r-4 border-amber-600' 
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            Farm Visits
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Routes>
          <Route index element={<AdminHome />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="visits" element={<AdminVisits />} />
        </Routes>
      </div>
    </div>
  );
}