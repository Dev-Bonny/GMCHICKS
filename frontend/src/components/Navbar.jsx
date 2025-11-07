import { Link } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react'; // Add useRef and useEffect
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Add this
  const profileRef = useRef(null); // Add this
  
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartCount, clearCart } = useCart();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    clearCart();
    setIsProfileOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl">🐥</span>
              <span className="ml-2 text-xl font-bold text-primary-600">GM Chicks</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="hover:text-primary-600 transition">Products</Link>
            <Link to="/farm-visit" className="hover:text-primary-600 transition">Farm Visit</Link>
            <Link to="/vaccination" className="hover:text-primary-600 transition">Vaccination</Link>
            <Link to="/learn" className="hover:text-primary-600 transition">Learn</Link>
            <Link to="/contact" className="hover:text-primary-600 transition">Contact</Link>
            
            <Link to="/cart" className="relative hover:text-primary-600 transition">
              <FiShoppingCart size={24} />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 hover:text-primary-600 focus:outline-none"
                >
                  <FiUser size={24} />
                  <span>{user?.name}</span>
                  <FiChevronDown size={16} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link 
                      to="/dashboard" 
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="block px-4 py-2 hover:bg-gray-100 text-primary-600 font-semibold"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout} 
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary">Login</Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <Link to="/products" className="block px-4 py-2 hover:bg-gray-50">Products</Link>
          <Link to="/farm-visit" className="block px-4 py-2 hover:bg-gray-50">Farm Visit</Link>
          <Link to="/vaccination" className="block px-4 py-2 hover:bg-gray-50">Vaccination</Link>
          <Link to="/learn" className="block px-4 py-2 hover:bg-gray-50">Learn</Link>
          <Link to="/contact" className="block px-4 py-2 hover:bg-gray-50">Contact</Link>
          <Link to="/cart" className="block px-4 py-2 hover:bg-gray-50">Cart ({getCartCount()})</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-50">Dashboard</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="block px-4 py-2 hover:bg-gray-50 text-primary-600 font-semibold">Admin Panel</Link>
              )}
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600">Logout</button>
            </>
          ) : (
            <Link to="/login" className="block px-4 py-2 hover:bg-gray-50">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}