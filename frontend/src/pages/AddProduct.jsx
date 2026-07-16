import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaChevronLeft, FaSave } from 'react-icons/fa';
import InputField from '../components/InputField.jsx';
import Button from '../components/Button.jsx';
import Toast from '../components/Toast.jsx';
import api from '../utils/api.js';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [categories, setCategories] = useState([]);
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/api/categories');
        setCategories(data);
        if (data.length > 0) {
          setCategory(data[0]._id); // Select first category by default
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const validate = () => {
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = 'Product name is required';
    if (!description.trim()) tempErrors.description = 'Product description is required';
    
    if (!price || isNaN(price) || Number(price) <= 0) {
      tempErrors.price = 'Please enter a valid price greater than 0';
    }
    
    if (!image.trim()) {
      tempErrors.image = 'Product image URL is required';
    } else if (!/^https?:\/\/.+/.test(image)) {
      tempErrors.image = 'Please enter a valid HTTP/HTTPS URL';
    }

    if (!category) tempErrors.category = 'Please select a category';

    if (!countInStock || isNaN(countInStock) || Number(countInStock) < 0) {
      tempErrors.countInStock = 'Please enter a valid stock number (0 or higher)';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setToast({ show: true, message: 'Please fix all form validation errors.', type: 'warning' });
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/products', {
        name,
        description,
        price: Number(price),
        image,
        category,
        countInStock: Number(countInStock),
      });

      setLoading(false);
      setToast({ show: true, message: 'Product created successfully!', type: 'success' });
      setTimeout(() => {
        navigate('/admin/products');
      }, 1000);
    } catch (err) {
      setLoading(false);
      setToast({
        show: true,
        message: err.response?.data?.message || 'Failed to create product.',
        type: 'danger',
      });
    }
  };

  return (
    <div className="container" style={{ maxWidth: '700px' }}>
      {/* Back button */}
      <Link
        to="/admin/products"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '30px',
          color: 'var(--text-muted)',
          fontWeight: 500,
        }}
      >
        <FaChevronLeft size={10} /> Back to Products List
      </Link>

      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius-md)',
          padding: '40px 30px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            marginBottom: '8px',
            color: 'var(--text-main)',
          }}
        >
          Add New Product
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '0.9rem' }}>
          Create an entry in the catalog store database
        </p>

        <form onSubmit={handleSubmit}>
          <InputField
            label="Product Name"
            id="prod-name"
            placeholder="e.g. Wireless Headset"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            error={errors.name}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row-grid">
            <InputField
              label="Price ($)"
              id="prod-price"
              type="number"
              step="0.01"
              placeholder="e.g. 99.99"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              error={errors.price}
            />

            <InputField
              label="Inventory Stock Count"
              id="prod-stock"
              type="number"
              placeholder="e.g. 10"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              required
              error={errors.countInStock}
            />
          </div>

          <div className="form-group">
            <label htmlFor="prod-cat" className="form-label">
              Product Category <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <select
              id="prod-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-control"
              style={{ borderColor: errors.category ? 'var(--danger)' : 'var(--border-color)' }}
              required
            >
              <option value="" disabled>Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <span style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: '4px', display: 'block' }}>
                {errors.category}
              </span>
            )}
          </div>

          <InputField
            label="Product Image URL"
            id="prod-img"
            type="url"
            placeholder="e.g. https://images.unsplash.com/photo-..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            error={errors.image}
            helpText="Provide a valid direct web link to the image"
          />

          {image && !errors.image && (
            <div style={{ marginBottom: '20px' }}>
              <span className="form-label">Image Preview</span>
              <img
                src={image}
                alt="Product preview"
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: 'var(--border-radius-sm)',
                  border: '1px solid var(--border-color)',
                  marginTop: '8px',
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  setErrors({ ...errors, image: 'Failed to load preview. Please check image URL.' });
                }}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="prod-desc" className="form-label">
              Product Description <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <textarea
              id="prod-desc"
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe specifications, key features, and warranty details..."
              className="form-control"
              required
              style={{
                resize: 'vertical',
                borderColor: errors.description ? 'var(--danger)' : 'var(--border-color)',
              }}
            ></textarea>
            {errors.description && (
              <span style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: '4px', display: 'block' }}>
                {errors.description}
              </span>
            )}
          </div>

          <Button type="submit" variant="primary" loading={loading} style={{ gap: '8px', marginTop: '10px' }}>
            <FaSave size={14} />
            <span>Create Product</span>
          </Button>
        </form>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default AddProduct;
