import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';
import SidebarFilter from '../components/SidebarFilter.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import Pagination from '../components/Pagination.jsx';
import Loader from '../components/Loader.jsx';
import Toast from '../components/Toast.jsx';
import api from '../utils/api.js';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Get active query parameters
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const currentPage = Number(searchParams.get('page')) || 1;

  // Load static categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/api/categories');
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products reactively when query filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(
          `/api/products?keyword=${keyword}&category=${category}&sort=${sort}&page=${currentPage}&pageSize=6`
        );
        setProducts(data.products || []);
        setPage(data.page || 1);
        setPages(data.pages || 1);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, category, sort, currentPage]);

  const handleSearch = (searchKeyword) => {
    const params = new URLSearchParams(searchParams);
    if (searchKeyword) {
      params.set('keyword', searchKeyword);
    } else {
      params.delete('keyword');
    }
    params.set('page', '1'); // Reset to first page
    setSearchParams(params);
  };

  const handleSelectCategory = (catId) => {
    const params = new URLSearchParams(searchParams);
    if (catId) {
      params.set('category', catId);
    } else {
      params.delete('category');
    }
    params.set('page', '1'); // Reset to first page
    setSearchParams(params);
  };

  const handleSelectSort = (sortOption) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sortOption);
    params.set('page', '1'); // Reset to first page
    setSearchParams(params);
  };

  const handlePageChange = (pageNum) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNum.toString());
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchParams({}); // Wipes all filters
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  return (
    <div className="container">
      {/* Search Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
          Catalog
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Discover our premium collection of curated products
        </p>
        <SearchBar onSearch={handleSearch} initialValue={keyword} />
      </div>

      {/* Main Grid: Filters + Catalog */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '40px',
          alignItems: 'start',
        }}
        className="products-layout-grid"
      >
        {/* Left Side Filters */}
        <aside>
          <SidebarFilter
            categories={categories}
            selectedCategory={category}
            onSelectCategory={handleSelectCategory}
            selectedSort={sort}
            onSelectSort={handleSelectSort}
            onClearFilters={handleClearFilters}
          />
        </aside>

        {/* Right Side Products */}
        <main>
          {loading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '24px',
              }}
            >
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    borderRadius: 'var(--border-radius-md)',
                    border: '1px solid var(--border-color)',
                    padding: '20px',
                    height: '380px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div className="skeleton skeleton-image" style={{ height: '200px', width: '100%' }}></div>
                  <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                  <div className="skeleton skeleton-text" style={{ width: '90%', height: '24px' }}></div>
                  <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
                  <div className="skeleton skeleton-text" style={{ width: '30%', marginTop: 'auto' }}></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 24px',
                backgroundColor: 'var(--card-bg)',
                borderRadius: 'var(--border-radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No products found</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                Try relaxing your search terms or resetting filters.
              </p>
              <button onClick={handleClearFilters} className="btn btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <ProductGrid>
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} onShowToast={showToast} />
                ))}
              </ProductGrid>
              <Pagination pages={pages} page={page} onPageChange={handlePageChange} />
            </>
          )}
        </main>
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

export default Products;
