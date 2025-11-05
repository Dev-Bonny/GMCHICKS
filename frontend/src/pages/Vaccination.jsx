import { useState, useEffect } from 'react';
import api from '../services/api';
import { FiCalendar, FiInfo } from 'react-icons/fi';

export default function Vaccination() {
  const [schedule, setSchedule] = useState([]);
  const [tips, setTips] = useState([]);
  const [chickType, setChickType] = useState('layer');
  const [chickAge, setChickAge] = useState('');
  const [upcomingVaccinations, setUpcomingVaccinations] = useState([]);

  useEffect(() => {
    fetchSchedule();
    fetchTips();
  }, [chickType]);

  useEffect(() => {
    if (chickAge) {
      fetchUpcoming();
    }
  }, [chickAge, chickType]);

  const fetchSchedule = async () => {
    try {
      const res = await api.get(`/api/vaccinations/schedule?chickType=${chickType}`);
      setSchedule(res.data.schedule);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  const fetchTips = async () => {
    try {
      const res = await api.get('/api/vaccinations/tips');
      setTips(res.data.tips);
    } catch (error) {
      console.error('Error fetching tips:', error);
    }
  };

  const fetchUpcoming = async () => {
    try {
      const res = await api.get(`/api/vaccinations/upcoming?chickAge=${chickAge}&chickType=${chickType}`);
      setUpcomingVaccinations(res.data.upcomingVaccinations);
    } catch (error) {
      console.error('Error fetching upcoming:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-4">Vaccination Schedule</h1>
      <p className="text-gray-600 mb-8">
        Keep your chickens healthy with our comprehensive vaccination schedule
      </p>

      {/* Age Calculator */}
      <div className="bg-primary-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Check Upcoming Vaccinations</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Chicken Type</label>
            <select
              value={chickType}
              onChange={(e) => setChickType(e.target.value)}
              className="input-field"
            >
              <option value="layer">Layer</option>
              <option value="broiler">Broiler</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Current Age (days)</label>
            <input
              type="number"
              value={chickAge}
              onChange={(e) => setChickAge(e.target.value)}
              className="input-field"
              placeholder="e.g., 14"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchUpcoming}
              className="btn-primary w-full"
              disabled={!chickAge}
            >
              Check Schedule
            </button>
          </div>
        </div>

        {upcomingVaccinations.length > 0 && (
          <div className="mt-6 bg-white p-4 rounded-lg">
            <h3 className="font-semibold mb-3">📅 Your Next Vaccinations:</h3>
            <div className="space-y-2">
              {upcomingVaccinations.slice(0, 3).map((vacc, idx) => (
                <div key={idx} className="flex items-start p-3 bg-green-50 rounded">
                  <FiCalendar className="mt-1 mr-3 text-green-600" />
                  <div>
                    <p className="font-semibold">Day {vacc.day}: {vacc.vaccine}</p>
                    <p className="text-sm text-gray-600">{vacc.method}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full Schedule */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 bg-gray-50 border-b">
          <h2 className="text-2xl font-bold">Complete Vaccination Schedule</h2>
          <p className="text-gray-600 mt-2">For {chickType === 'layer' ? 'Layer' : 'Broiler'} Chickens</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Day</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Vaccine</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Method</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {schedule.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">Day {item.day}</td>
                  <td className="px-6 py-4">{item.vaccine}</td>
                  <td className="px-6 py-4 text-sm">{item.method}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Vaccination Tips & Best Practices</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {tips.map((tip, idx) => (
            <div key={idx} className="flex items-start p-4 bg-blue-50 rounded-lg">
              <FiInfo className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">{tip.title}</h3>
                <p className="text-sm text-gray-700">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
