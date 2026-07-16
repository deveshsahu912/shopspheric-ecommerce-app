import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [keyword, setKeyword] = useState(initialValue);

  // Debounced search logic (Bonus Feature)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(keyword);
    }, 500); // Wait 500ms after the user stops typing

    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto 30px',
      }}
    >
      <input
        type="text"
        placeholder="Search products..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="form-control"
        style={{
          paddingLeft: '45px',
          borderRadius: 'var(--border-radius-sm)',
        }}
      />
      <FaSearch
        style={{
          position: 'absolute',
          top: '50%',
          left: '16px',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)',
          pointerEvents: 'none',
        }}
        size={16}
      />
    </form>
  );
};

export default SearchBar;
