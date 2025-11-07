import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function FarmVisit() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    visitDate: '',
    visitTime: '10:00',
    numberOfVisitors: 1,
    purpose: 'tour',
    notes: ''
  });
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkAvailability = async (date) => {
    if (!date) return;
    try {
      const res = await api.get(`/api/visits/availability/${date}`);
      setAvailability(res.data);
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setFormData({ ...formData, visitDate: date });
    checkAvailability(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.info('Please login to schedule a visit');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/visits', formData);
      toast.success('Visit scheduled successfully! We will send you a confirmation.');
      setFormData({
        visitDate: '',
        visitTime: '10:00',
        numberOfVisitors: 1,
        purpose: 'tour',
        notes: ''
      });
      setAvailability(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule visit');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">Visit Our Farm</h1>
          <p className="text-gray-600 mb-6">
            See our operations firsthand and learn about modern poultry farming. Our farm tours are educational and perfect for both beginners and experienced farmers.
          </p>

          <div className="bg-primary-50 p-6 rounded-lg mb-6">
            <h3 className="font-semibold mb-3">What to Expect</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>Guided tour of our facilities</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>See different breeds and age groups</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>Learn about feeding and vaccination</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>Q&A with our poultry experts</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>Opportunity to purchase on-site</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Farm Location</h3>
            <p className="text-gray-700 mb-4">
              📍 Nairobi, Kenya<br />
              ⏰ Open: Monday - Saturday, 9:00 AM - 5:00 PM<br />
              📞 Phone: +254 792 531 105
            </p>
            <div className="bg-gray-300 h-48 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">[Map Integration Here]</p>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Schedule Your Visit</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Visit Date *</label>
                <input
                  type="date"
                  required
                  min={minDateStr}
                  value={formData.visitDate}
                  onChange={handleDateChange}
                  className="input-field"
                />
                {availability && (
                  <p className={`text-sm mt-2 ${availability.available ? 'text-green-600' : 'text-red-600'}`}>
                    {availability.available
                      ? `✓ ${availability.spotsLeft} spots available`
                      : '✗ This date is fully booked'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Preferred Time *</label>
                <select
                  required
                  value={formData.visitTime}
                  onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
                  className="input-field"
                >
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Number of Visitors *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="10"
                  value={formData.numberOfVisitors}
                  onChange={(e) => setFormData({ ...formData, numberOfVisitors: parseInt(e.target.value) })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Purpose *</label>
                <select
                  required
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="input-field"
                >
                  <option value="tour">Farm Tour</option>
                  <option value="purchase">Purchase Visit</option>
                  <option value="consultation">Consultation</option>
                  <option value="inspection">Inspection</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Additional Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field"
                  rows="4"
                  placeholder="Any special requests or questions?"
                />
              </div>

              <button
                type="submit"
                disabled={loading || (availability && !availability.available)}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? 'Scheduling...' : 'Schedule Visit'}
              </button>

              {!isAuthenticated && (
                <p className="text-sm text-gray-600 text-center">
                  You'll need to login to complete the booking
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
