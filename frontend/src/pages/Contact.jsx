import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import InputField from '../components/InputField.jsx';
import Button from '../components/Button.jsx';
import Toast from '../components/Toast.jsx';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setToast({ show: true, message: 'Please fill out all required fields', type: 'warning' });
      return;
    }

    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setToast({
        show: true,
        message: 'Inquiry submitted successfully! We will get back to you soon.',
        type: 'success',
      });
    }, 1200);
  };

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
          Contact Us
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Have any questions? We would love to hear from you.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '50px',
          alignItems: 'start',
          marginBottom: '50px',
        }}
        className="contact-layout-grid"
      >
        {/* Left Column: Contact details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-md)',
              padding: '30px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '20px' }}>
              Get in Touch
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
              Feel free to reach out to us. Our customer support team is available 24/7 to resolve any issues.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FaPhone size={16} />
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>PHONE</span>
                  <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>+1 (555) 123-4567</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FaEnvelope size={16} />
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>EMAIL</span>
                  <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>support@shopspheric.com</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FaMapMarkerAlt size={16} />
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>OFFICE</span>
                  <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>100 E-Commerce Way, Tech City, USA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact form */}
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius-md)',
            padding: '30px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '24px' }}>
            Send Message
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row-grid">
              <InputField
                label="Your Name"
                id="contact-name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <InputField
                label="Email Address"
                id="contact-email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <InputField
              label="Subject"
              id="contact-subject"
              placeholder="How can we help?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <div className="form-group">
              <label htmlFor="contact-msg" className="form-label">
                Message <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <textarea
                id="contact-msg"
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your inquiry..."
                className="form-control"
                required
                style={{ resize: 'vertical' }}
              ></textarea>
            </div>

            <Button type="submit" variant="primary" loading={loading} style={{ gap: '8px' }}>
              <FaPaperPlane size={14} />
              <span>Send Message</span>
            </Button>
          </form>
        </div>
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

export default Contact;
