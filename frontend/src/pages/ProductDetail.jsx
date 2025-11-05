import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/api/products/${id}`);
      setProduct(res.data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/products" className="text-primary-600 hover:underline">
          Back to products
        </Link>
      </div>
    );
  }

  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/600x400?text=Chicken';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm mb-6">
        <Link to="/" className="text-primary-600 hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="text-primary-600 hover:underline">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div>
          <span className={`inline-block px-3 py-1 text-sm rounded mb-4 ${
            product.category === 'chick' ? 'bg-yellow-100 text-yellow-800' :
            product.category === 'layer' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {product.category}
          </span>
          
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-primary-600 mb-6">
            Ksh {product.price.toLocaleString()}
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-semibold">{product.age}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Breed</p>
                <p className="font-semibold">{product.breed}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-semibold capitalize">{product.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">In Stock</p>
                <p className="font-semibold">{product.quantity} available</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {product.features && product.features.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <FiCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t pt-6">
            <div className="flex items-center space-x-4 mb-6">
              <label className="font-semibold">Quantity:</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border rounded hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-16 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  className="w-10 h-10 border rounded hover:bg-gray-100"
                  disabled={quantity >= product.quantity}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => addToCart(product, quantity)}
              disabled={product.quantity === 0}
              className={`w-full flex items-center justify-center space-x-2 py-4 rounded-lg font-semibold ${
                product.quantity === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-primary-500 hover:bg-primary-600 text-white'
              }`}
            >
              <FiShoppingCart size={20} />
              <span>{product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
