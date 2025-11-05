import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: user?.phone || '',
    deliveryAddress: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      county: user?.address?.county || '',
      postalCode: user?.address?.postalCode || ''
    },
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order
      const orderRes = await api.post('/api/orders', {
        items: cart.map(item => ({
          product: item._id,
          quantity: item.quantity
        })),
        deliveryAddress: formData.deliveryAddress,
        notes: formData.notes
      });

      const order = orderRes.data.order;

      // Initiate payment
      const paymentRes = await api.post('/api/payments/initiate', {
        orderId: order._id,
        phoneNumber: formData.phoneNumber
      });

      if (paymentRes.data.success) {
        toast.success('Payment request sent! Check your phone.');
        clearCart();
        navigate(`/dashboard`);
      } else {
        toast.error('Payment initiation failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div>
                <label className="block text-sm font-medium mb-2">
                  MPesa Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="input-field"
                  placeholder="254700123456"
                />
                <p className="text-xs text-gray-500 mt-1">Payment will be sent to this number</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.deliveryAddress.street}
                    onChange={(e) => setFormData({
                      ...formData,
                      deliveryAddress: { ...formData.deliveryAddress, street: e.target.value }
                    })}
                    className="input-field"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.deliveryAddress.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        deliveryAddress: { ...formData.deliveryAddress, city: e.target.value }
                      })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">County *</label>
                    <input
                      type="text"
                      required
                      value={formData.deliveryAddress.county}
                      onChange={(e) => setFormData({
                        ...formData,
                        deliveryAddress: { ...formData.deliveryAddress, county: e.target.value }
                      })}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Postal Code</label>
                  <input
                    type="text"
                    value={formData.deliveryAddress.postalCode}
                    onChange={(e) => setFormData({
                      ...formData,
                      deliveryAddress: { ...formData.deliveryAddress, postalCode: e.target.value }
                    })}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Additional Notes</h2>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="input-field"
                rows="4"
                placeholder="Any special instructions for delivery?"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Pay Ksh ${getCartTotal().toLocaleString()} via MPesa`}
            </button>
          </form>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>Ksh {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Ksh {getCartTotal().toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                💡 You will receive an MPesa prompt on your phone to complete the payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}