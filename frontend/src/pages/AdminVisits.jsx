import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiCalendar, FiClock, FiUsers, FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi';
import api from '../services/api';
// Mock API - replace with your actual API calls


export default function AdminVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/visits');
      setVisits(res.data.visits);
    } catch (error) {
      console.error('Error fetching visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateVisitStatus = async (visitId, newStatus) => {
    try {
      setUpdating(true);
      await api.put(`/api/admin/visits/${visitId}/status`, { status: newStatus });
      
      setVisits(visits.map(visit => 
        visit._id === visitId ? { ...visit, status: newStatus } : visit
      ));
      
      if (selectedVisit?._id === visitId) {
        setSelectedVisit({ ...selectedVisit, status: newStatus });
      }
      
      alert(`Visit ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating visit:', error);
      alert('Failed to update visit status');
    } finally {
      setUpdating(false);
    }
  };

  const filteredVisits = visits.filter(visit => {
    const matchesSearch = 
      visit.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.user.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || visit.status === statusFilter;
    
    const visitDate = new Date(visit.visitDate);
    const today = new Date();
    const matchesDate = 
      dateFilter === 'all' ||
      (dateFilter === 'upcoming' && visitDate >= today) ||
      (dateFilter === 'past' && visitDate < today) ||
      (dateFilter === 'today' && 
        visitDate.toDateString() === today.toDateString());
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPurposeIcon = (purpose) => {
    const icons = {
      tour: '🚶',
      purchase: '🛒',
      consultation: '💬',
      inspection: '🔍',
      other: '📋'
    };
    return icons[purpose] || '📋';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Farm Visits Management</h2>
        <button
          onClick={fetchVisits}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Visits</p>
          <p className="text-2xl font-bold">{visits.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {visits.filter(v => v.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Confirmed</p>
          <p className="text-2xl font-bold text-blue-600">
            {visits.filter(v => v.status === 'confirmed').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Today's Visitors</p>
          <p className="text-2xl font-bold text-green-600">
            {visits
              .filter(v => new Date(v.visitDate).toDateString() === new Date().toDateString())
              .reduce((sum, v) => sum + v.numberOfVisitors, 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVisits.map((visit) => (
          <div
            key={visit._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 space-y-4"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{visit.user.name}</h3>
                <p className="text-sm text-gray-500">{visit.user.email}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(visit.status)}`}>
                {visit.status}
              </span>
            </div>

            {/* Visit Details */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <FiCalendar className="text-gray-400" />
                <span>{new Date(visit.visitDate).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiClock className="text-gray-400" />
                <span>{visit.visitTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiUsers className="text-gray-400" />
                <span>{visit.numberOfVisitors} visitor{visit.numberOfVisitors > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-xl">{getPurposeIcon(visit.purpose)}</span>
                <span className="capitalize">{visit.purpose}</span>
              </div>
            </div>

            {/* Notes */}
            {visit.notes && (
              <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                <p className="font-medium text-xs text-gray-500 mb-1">Notes:</p>
                <p>{visit.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t">
              {visit.status === 'pending' && (
                <>
                  <button
                    onClick={() => updateVisitStatus(visit._id, 'confirmed')}
                    disabled={updating}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                  >
                    <FiCheckCircle /> Confirm
                  </button>
                  <button
                    onClick={() => updateVisitStatus(visit._id, 'cancelled')}
                    disabled={updating}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                  >
                    <FiXCircle /> Cancel
                  </button>
                </>
              )}
              {visit.status === 'confirmed' && (
                <button
                  onClick={() => updateVisitStatus(visit._id, 'completed')}
                  disabled={updating}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                >
                  <FiCheckCircle /> Mark Complete
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedVisit(visit);
                  setShowModal(true);
                }}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredVisits.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FiCalendar className="mx-auto text-5xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No visits found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
        </div>
      )}

      {/* Visit Detail Modal */}
      {showModal && selectedVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Visit Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex justify-center">
                <span className={`px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(selectedVisit.status)}`}>
                  {selectedVisit.status.toUpperCase()}
                </span>
              </div>

              {/* Visitor Info */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">Visitor Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{selectedVisit.user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedVisit.user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{selectedVisit.user.phone}</span>
                  </div>
                </div>
              </div>

              {/* Visit Details */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">Visit Details</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {new Date(selectedVisit.visitDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{selectedVisit.visitTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of Visitors:</span>
                    <span className="font-medium">{selectedVisit.numberOfVisitors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Purpose:</span>
                    <span className="font-medium capitalize">
                      {getPurposeIcon(selectedVisit.purpose)} {selectedVisit.purpose}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booked On:</span>
                    <span className="font-medium">
                      {new Date(selectedVisit.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedVisit.notes && (
                <div>
                  <h4 className="font-semibold mb-3 text-gray-700">Notes</h4>
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedVisit.notes}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">Update Status</h4>
                <div className="grid grid-cols-2 gap-3">
                  {['pending', 'confirmed', 'completed', 'cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => updateVisitStatus(selectedVisit._id, status)}
                      disabled={updating || selectedVisit.status === status}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedVisit.status === status
                          ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                          : 'bg-amber-500 text-white hover:bg-amber-600'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}