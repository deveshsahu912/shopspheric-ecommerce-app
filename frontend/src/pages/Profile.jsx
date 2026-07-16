import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import InputField from '../components/InputField.jsx';
import Button from '../components/Button.jsx';
import Toast from '../components/Toast.jsx';

const Profile = () => {
  const { user, updateProfile, changePassword } = useContext(AuthContext);

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setToast({ show: true, message: 'Name and Email are required', type: 'warning' });
      return;
    }

    setProfileLoading(true);
    const res = await updateProfile({ name, email, phone, address });
    setProfileLoading(false);

    if (res.success) {
      setToast({ show: true, message: 'Profile updated successfully!', type: 'success' });
    } else {
      setToast({ show: true, message: res.message, type: 'danger' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setToast({ show: true, message: 'Please enter all fields', type: 'warning' });
      return;
    }
    if (newPassword.length < 6) {
      setToast({ show: true, message: 'New password must be at least 6 characters', type: 'warning' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setToast({ show: true, message: 'Passwords do not match', type: 'warning' });
      return;
    }

    setPasswordLoading(true);
    const res = await changePassword(currentPassword, newPassword);
    setPasswordLoading(false);

    if (res.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setToast({ show: true, message: 'Password updated successfully!', type: 'success' });
    } else {
      setToast({ show: true, message: res.message, type: 'danger' });
    }
  };

  return (
    <div className="container">
      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '30px', color: 'var(--text-main)' }}>
        My Profile
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '40px',
          alignItems: 'start',
        }}
        className="profile-layout-grid"
      >
        {/* Left Column: Profile Info Form */}
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
            Account Details
          </h2>

          <form onSubmit={handleUpdateProfile}>
            <InputField
              label="Full Name"
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <InputField
              label="Email Address"
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <InputField
              label="Phone Number"
              id="profile-phone"
              type="tel"
              placeholder="e.g. +1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <div className="form-group">
              <label htmlFor="profile-address" className="form-label">
                Default Shipping Address
              </label>
              <textarea
                id="profile-address"
                rows="3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your street address details..."
                className="form-control"
                style={{ resize: 'vertical' }}
              ></textarea>
            </div>

            <Button type="submit" variant="primary" loading={profileLoading}>
              Save Changes
            </Button>
          </form>
        </div>

        {/* Right Column: Change Password */}
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
            Security Configuration
          </h2>

          <form onSubmit={handleChangePassword}>
            <InputField
              label="Current Password"
              id="curr-pwd"
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <InputField
              label="New Password"
              id="new-pwd"
              type="password"
              placeholder="Min 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <InputField
              label="Confirm New Password"
              id="conf-new-pwd"
              type="password"
              placeholder="Repeat new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" loading={passwordLoading}>
              Update Password
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

export default Profile;
