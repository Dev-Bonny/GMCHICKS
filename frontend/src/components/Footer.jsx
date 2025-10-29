import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">🐥 GM Chicks</h3>
            <p className="text-gray-400">Quality poultry for your farm. From day-old chicks to mature birds.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-400 hover:text-white">Products</Link></li>
              <li><Link to="/farm-visit" className="text-gray-400 hover:text-white">Farm Visit</Link></li>
              <li><Link to="/vaccination" className="text-gray-400 hover:text-white">Vaccination Schedule</Link></li>
              <li><Link to="/learn" className="text-gray-400 hover:text-white">Learning Center</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white">My Orders</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white">FAQs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <FiPhone className="mr-2" />
                <span>+254 700 123 456</span>
              </li>
              <li className="flex items-center text-gray-400">
                <FiMail className="mr-2" />
                <span>info@gmchicks.com</span>
              </li>
              <li className="flex items-start text-gray-400">
                <FiMapPin className="mr-2 mt-1" />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 GM Chicks. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
