import React from 'react';

const About = () => {
  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
          About ShopSpheric
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Discover our values, journey, and the tech stack powering this experience.
        </p>
      </div>

      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius-md)',
          padding: '40px 30px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
          lineHeight: '1.8',
        }}
      >
        <section>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)' }}>
            Our Mission
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            At ShopSpheric, our mission is to deliver handpicked tech gadgets, stylish apparel, educational books, and clean cosmetics at competitive pricing. We believe in providing a seamless shopping interface backed by robust, modern software practices.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)' }}>
            The Architecture & Tech Stack
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            This application is constructed using the popular **MERN Stack** (MongoDB, Express, React, Node.js), demonstrating professional full-stack conventions:
          </p>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)' }}>
            <li>
              <strong>Database (MongoDB):</strong> Document database utilizing Mongoose object modeling with schemas for Users, Products, Categories, Carts, Wishlists, and Orders.
            </li>
            <li>
              <strong>Backend (Node.js & Express):</strong> RESTful API server implementing JWT stateless authentication, bcrypt password hashing, CORS enablement, and robust error management.
            </li>
            <li>
              <strong>Frontend (React & Vite):</strong> Structured client-side SPA routing with React Router, API state bindings via Axios, and state synchronization using React Context.
            </li>
            <li>
              <strong>Styling (Vanilla CSS):</strong> Custom CSS custom properties, grid/flexbox responsive grids, light hover animations, and light/dark theme toggles.
            </li>
          </ul>
        </section>

        <section
          style={{
            backgroundColor: 'var(--light)',
            padding: '24px',
            borderRadius: 'var(--border-radius-sm)',
            borderLeft: '4px solid var(--primary)',
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>
            Mentor Note
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            This project has been deliberately designed to highlight clean folder structures, robust security principles, and dynamic responsive designs. It acts as an excellent template for final-year college projects or resume submissions for budding software engineering professionals.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
