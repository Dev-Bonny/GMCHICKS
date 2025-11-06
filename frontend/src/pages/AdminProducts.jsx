import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiUpload } from 'react-icons/fi';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'chick',
    age: '',
    ageInDays: '',
    price: '',
    quantity: '',
    breed: '',
    weight: '',
    features: '',
    images: [{ url: '', alt: '' }]
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products?limit=100');
      setProducts(res.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (index, field, value) => {
    const newImages = [...formData.images];
    newImages[index][field] = value;
    setFormData({ ...formData, images: newImages });
  };

  // NEW: Compress and resize image
  const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize if image is too large
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with compression
          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // NEW: Handle file upload
  const handleFileUpload = async (index, file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (10MB max for original)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    setUploadingImages(true);

    try {
      // Compress the image
      const compressedBlob = await compressImage(file);
      
      // Create FormData for file upload
      const formDataUpload = new FormData();
      formDataUpload.append('image', compressedBlob, file.name);

      // Upload to your backend
      // Adjust the endpoint to match your backend API
      const response = await api.post('/api/upload/image', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update the image URL in the form
      const newImages = [...formData.images];
      newImages[index].url = response.data.url; // Adjust based on your API response
      newImages[index].alt = file.name.split('.')[0]; // Use filename as default alt text
      
      setFormData({ ...formData, images: newImages });
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // Check if it's a file upload endpoint issue
      if (error.response?.status === 404) {
        toast.error('Upload endpoint not configured. Using URL input instead.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to upload image. Try using an image URL instead.');
      }
      
      // Fallback: Convert to compressed base64 for preview
      try {
        const compressedBlob = await compressImage(file, 800, 0.7);
        const reader = new FileReader();
        reader.onloadend = () => {
          const newImages = [...formData.images];
          newImages[index].url = reader.result;
          newImages[index].alt = file.name.split('.')[0];
          setFormData({ ...formData, images: newImages });
          toast.info('Image compressed and added (consider using image URL for better performance)');
        };
        reader.readAsDataURL(compressedBlob);
      } catch (compressError) {
        console.error('Compression failed:', compressError);
      }
    } finally {
      setUploadingImages(false);
    }
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, { url: '', alt: '' }]
    });
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: 'chick',
      age: '',
      ageInDays: '',
      price: '',
      quantity: '',
      breed: '',
      weight: '',
      features: '',
      images: [{ url: '', alt: '' }]
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      age: product.age,
      ageInDays: product.ageInDays,
      price: product.price,
      quantity: product.quantity,
      breed: product.breed,
      weight: product.weight || '',
      features: product.features?.join('\n') || '',
      images: product.images?.length > 0 ? product.images : [{ url: '', alt: '' }]
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data
    const productData = {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      ageInDays: Number(formData.ageInDays),
      features: formData.features.split('\n').filter(f => f.trim()),
      images: formData.images.filter(img => img.url.trim())
    };

    try {
      if (editingProduct) {
        await api.put(`/api/products/${editingProduct._id}`, productData);
        toast.success('Product updated successfully!');
      } else {
        await api.post('/api/products', productData);
        toast.success('Product created successfully!');
      }
      
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await api.delete(`/api/products/${productId}`);
      toast.success('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products Management</h2>
        <button
          onClick={openAddModal}
          className="btn-primary flex items-center space-x-2"
        >
          <FiPlus />
          <span>Add Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Age</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Stock</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <img
                    src={product.images?.[0]?.url || 'https://via.placeholder.com/50'}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded ${
                    product.category === 'chick' ? 'bg-yellow-100 text-yellow-800' :
                    product.category === 'layer' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4">{product.age}</td>
                <td className="px-6 py-4">Ksh {product.price}</td>
                <td className="px-6 py-4">
                  <span className={product.quantity < 10 ? 'text-red-600 font-semibold' : ''}>
                    {product.quantity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full my-8">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="input-field"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="chick">Chick</option>
                    <option value="layer">Layer</option>
                    <option value="broiler">Broiler</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Breed *</label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Kenbro, ISA Brown"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Age *</label>
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., 1 week, 16-18 weeks"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Age in Days *</label>
                  <input
                    type="number"
                    name="ageInDays"
                    value={formData.ageInDays}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price (Ksh) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Quantity in Stock *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Weight (for mature chickens)</label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., 1.5-1.8kg"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Features (one per line)</label>
                  <textarea
                    name="features"
                    value={formData.features}
                    onChange={handleInputChange}
                    className="input-field"
                    rows="4"
                    placeholder="Fully vaccinated&#10;High egg production&#10;Disease resistant"
                  />
                </div>

                {/* IMPROVED IMAGE UPLOAD SECTION */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Product Images</label>
                  {formData.images.map((image, index) => (
                    <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-start space-x-3">
                        {/* Image Preview */}
                        {image.url && (
                          <div className="flex-shrink-0">
                            <img 
                              src={image.url} 
                              alt={image.alt || 'Preview'} 
                              className="w-20 h-20 object-cover rounded border"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/80?text=Invalid+URL';
                              }}
                            />
                          </div>
                        )}
                        
                        <div className="flex-1 space-y-2">
                          {/* File Upload Button */}
                          <div>
                            <label className="flex items-center justify-center w-full px-4 py-2 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition">
                              <FiUpload className="mr-2" />
                              <span className="text-sm">
                                {uploadingImages ? 'Uploading...' : 'Upload Image'}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(index, e.target.files[0])}
                                className="hidden"
                                disabled={uploadingImages}
                              />
                            </label>
                          </div>

                          {/* OR divider */}
                          <div className="text-center text-xs text-gray-500">OR paste URL</div>

                          {/* URL Input */}
                          <input
                            type="url"
                            value={image.url}
                            onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                            className="input-field w-full"
                            placeholder="https://example.com/image.jpg"
                          />

                          {/* Alt Text */}
                          <input
                            type="text"
                            value={image.alt}
                            onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                            className="input-field w-full"
                            placeholder="Alt text (for accessibility)"
                          />
                        </div>

                        {/* Remove Button */}
                        {formData.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageField(index)}
                            className="text-red-600 hover:text-red-800 flex-shrink-0"
                          >
                            <FiX size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addImageField}
                    className="text-primary-600 text-sm hover:underline flex items-center"
                  >
                    <FiPlus className="mr-1" size={16} />
                    Add another image
                  </button>
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <button 
                  type="submit" 
                  className="btn-primary flex-1"
                  disabled={uploadingImages}
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}