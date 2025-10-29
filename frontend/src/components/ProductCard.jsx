import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/300x200?text=Chicken';

  return (
    <div className="card hover:shadow-xl transition-shadow duration-300">
      <Link to={`/products/${product._id}`}>
        <img src={imageUrl} alt={product.name} className="w-full h-48 object-cover" />
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/products/${product._id}`}>
            <h3 className="font-semibold text-lg hover:text-primary-600">{product.name}</h3>
          </Link>
          <span className={`px-2 py-1 text-xs rounded ${
            product.category === 'chick' ? 'bg-yellow-100 text-yellow-800' :
            product.category === 'layer' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {product.category}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">{product.age}</p>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-primary-600">Ksh {product.price}</span>
          <button
            onClick={() => addToCart(product)}
            disabled={product.quantity === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              product.quantity === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600 text-white'
            }`}
          >
            <FiShoppingCart />
            <span>{product.quantity === 0 ? 'Out of Stock' : 'Add'}</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">In stock: {product.quantity}</p>
      </div>
    </div>
  );
}