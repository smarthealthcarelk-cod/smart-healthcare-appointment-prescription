import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../api/api';

function PatientProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    nic: '',
    profileImage: '',
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwShow, setPwShow] = useState({ current: false, new: false, confirm: false });
  const [pwError, setPwError] = useState(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwSubmitting, setPwSubmitting] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [imageSuccess, setImageSuccess] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    usersApi.me()
      .then((u) => setForm({
        name: u.name || '', email: u.email || '', phone: u.phone || '', address: u.address || '', nic: u.nic || '',
        profileImage: u.profile_image || '',
      }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = { name: form.name, email: form.email, phone: form.phone, address: form.address, nic: form.nic };
      if (user?.role === 'doctor') payload.profileImage = form.profileImage || null;
      await usersApi.updateMe(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImageError(null);
    setImageSuccess(false);
    if (!file) {
      setImageFile(null);
      setImagePreview('');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setImageError('Please select an image file.');
      setImageFile(null);
      setImagePreview('');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setImageError('Image must be smaller than 2 MB.');
      setImageFile(null);
      setImagePreview('');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      setImageError('Please choose an image to upload.');
      return;
    }
    setImageError(null);
    setImageSuccess(false);
    setImageUploading(true);
    try {
      const { profileImage } = await usersApi.uploadProfileImage(imageFile);
      setForm((prev) => ({ ...prev, profileImage: profileImage || '' }));
      setImageSuccess(true);
      setImageFile(null);
      setTimeout(() => setImageSuccess(false), 3000);
    } catch (err) {
      setImageError(err.message);
    } finally {
      setImageUploading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(false);
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New password and confirm password do not match');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwError('New password must be at least 6 characters');
      return;
    }
    setPwSubmitting(true);
    try {
      await usersApi.changePassword(pwForm.currentPassword, pwForm.newPassword);
      setPwSuccess(true);
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-header-title">My Profile</h2>
        <p className="page-header-subtitle">
          {user?.role === 'patient' && 'Keep your contact details up to date for appointment reminders.'}
          {user?.role === 'doctor' && 'Manage your profile and contact information.'}
          {user?.role === 'admin' && 'Manage your profile and account settings.'}
        </p>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm card-hover">
            <div className="card-header bg-light fw-medium">Personal Information</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Full Name</label>
                    <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Email</label>
                    <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">NIC </label>
                    <input type="text" name="nic" className="form-control" value={form.nic} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Phone</label>
                    <input type="tel" name="phone" className="form-control" placeholder="e.g. 0771234567" value={form.phone} onChange={handleChange} />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-medium">Address</label>
                    <input type="text" name="address" className="form-control" value={form.address} onChange={handleChange} />
                  </div>
                  {user?.role === 'doctor' && (
                    <div className="col-12">
                      <label className="form-label fw-medium">Profile Image</label>
                      <div className="d-flex align-items-center gap-3 flex-wrap">
                        <div className="d-flex align-items-center gap-2">
                          <div className="rounded-circle overflow-hidden bg-light" style={{ width: 56, height: 56 }}>
                            <img
                              src={imagePreview || form.profileImage || 'https://i.pravatar.cc/100?u=doctor'}
                              alt="Profile"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control form-control-sm mb-2"
                            onChange={handleImageChange}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={handleImageUpload}
                            disabled={imageUploading}
                          >
                            {imageUploading ? 'Uploading...' : 'Upload Image'}
                          </button>
                          <p className="small text-muted mb-0 mt-1">
                            JPG/PNG, max 2 MB. This image appears on the landing page and your profile.
                          </p>
                          {imageError && <div className="text-danger small mt-1">{imageError}</div>}
                          {imageSuccess && <div className="text-success small mt-1">Profile image updated.</div>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button type="submit" className="btn btn-primary mt-3" disabled={submitting}>{submitting ? 'Saving...' : 'Update Profile'}</button>
                {saved && <span className="ms-3 text-success">Profile updated successfully.</span>}
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm card-hover">
            <div className="card-header bg-light fw-medium">Change Password</div>
            <div className="card-body">
              {pwError && <div className="alert alert-danger py-2 mb-3">{pwError}</div>}
              {pwSuccess && <div className="alert alert-success py-2 mb-3">Password updated successfully.</div>}
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-2">
                  <label className="form-label small fw-medium">Current Password</label>
                  <div className="input-group input-group-sm">
                    <input
                      type={pwShow.current ? 'text' : 'password'}
                      className="form-control"
                      value={pwForm.currentPassword}
                      onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                      required
                      autoComplete="current-password"
                    />
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setPwShow({ ...pwShow, current: !pwShow.current })}>
                      {pwShow.current ? '🙈' : '👁'}
                    </button>
                  </div>
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-medium">New Password</label>
                  <div className="input-group input-group-sm">
                    <input
                      type={pwShow.new ? 'text' : 'password'}
                      className="form-control"
                      value={pwForm.newPassword}
                      onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setPwShow({ ...pwShow, new: !pwShow.new })}>
                      {pwShow.new ? '🙈' : '👁'}
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-medium">Confirm New Password</label>
                  <div className="input-group input-group-sm">
                    <input
                      type={pwShow.confirm ? 'text' : 'password'}
                      className="form-control"
                      value={pwForm.confirmPassword}
                      onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setPwShow({ ...pwShow, confirm: !pwShow.confirm })}>
                      {pwShow.confirm ? '🙈' : '👁'}
                    </button>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-sm" disabled={pwSubmitting}>
                  {pwSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientProfile;
