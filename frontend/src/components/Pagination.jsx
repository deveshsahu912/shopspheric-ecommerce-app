import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ pages, page, onPageChange }) => {
  if (pages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        marginTop: '30px',
        marginBottom: '50px',
      }}
    >
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="btn btn-outline"
        style={{
          width: '36px',
          height: '36px',
          padding: 0,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Previous Page"
      >
        <FaChevronLeft size={10} />
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          style={{
            width: '36px',
            height: '36px',
            padding: 0,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '1px solid transparent',
            fontWeight: '600',
            fontSize: '0.9rem',
            backgroundColor: num === page ? 'var(--primary)' : 'transparent',
            color: num === page ? '#ffffff' : 'var(--text-main)',
            borderColor: num === page ? 'var(--primary)' : 'var(--border-color)',
            transition: 'var(--transition-fast)',
          }}
          className={num !== page ? 'btn-outline-hover' : ''}
        >
          {num}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="btn btn-outline"
        style={{
          width: '36px',
          height: '36px',
          padding: 0,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Next Page"
      >
        <FaChevronRight size={10} />
      </button>
    </div>
  );
};

export default Pagination;
