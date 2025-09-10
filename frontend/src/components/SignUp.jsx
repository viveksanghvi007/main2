import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from './Inputs';
import { validateEmail } from '../utils/helper';
import { API_PATHS } from '../utils/apiPaths';
import axiosInstance from '../utils/axiosInstance';
import { UserContext } from '../context/userContext';
import { authStyles as styles } from '../assets/dummystyle';
import OTPVerification from './OTPVerification';
import toast from 'react-hot-toast';

const SignUp = ({ setCurrentPage }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [nameError, setNameError] = useState('');
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const validateName = (name) => {
    if (!name.trim()) {
      setNameError('');
      return true;
    }
    if (!/^[a-zA-Z]/.test(name.trim())) {
      setNameError('Name must start with a letter');
      toast.error('Name must start with a letter');
      return false;
    }
    if (!/^[a-zA-Z][a-zA-Z\s]*$/.test(name.trim())) {
      setNameError('Name can only contain letters and spaces');
      toast.error('Name can only contain letters and spaces');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setFullName(value);
    validateName(value);
  };

  const validateForm = () => {
    if (!fullName.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    if (fullName.trim().length < 2) {
      toast.error('Full name must be at least 2 characters long');
      return false;
    }
    if (nameError) {
      toast.error(nameError);
      return false;
    }
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
      toast.error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName.trim(),
        email: email.trim(),
        password,
      });

      if (response.data.success) {
        toast.success('Registration successful! Please check your email for verification code.');
        setRegistrationData(response.data);
        setShowOTP(true);
      }
    } catch (error) {
      console.error('Signup error:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error.response?.status === 400) {
        // Handle validation errors
        if (error.response.data?.errors) {
          const validationErrors = error.response.data.errors.map(err => {
            const field = err.field === 'name' ? 'Full Name' : 
                         err.field === 'email' ? 'Email' : 
                         err.field === 'password' ? 'Password' : err.field;
            return `${field}: ${err.message}`;
          }).join('\n');
          errorMessage = `Please fix the following errors:\n${validationErrors}`;
        } else {
          errorMessage = error.response.data?.message || 'Invalid request data. Please check your input.';
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSuccess = (data) => {
    // Email verified successfully, user can now login
    toast.success('Email verified successfully! You can now login.');
    setShowOTP(false);
    setCurrentPage('login');
  };

  const handleBack = () => {
    setShowOTP(false);
    setError('');
  };

  if (showOTP) {
    return (
      <OTPVerification
        email={email}
        purpose="verification"
        onSuccess={handleOTPSuccess}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className={styles.signupContainer}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.signupTitle}>Create Account</h3>
        <p className={styles.signupSubtitle}>Join thousands of professionals today</p>
      </div>
      <form onSubmit={handleSignUp} className={styles.signupForm}>
        <Input
          value={fullName}
          onChange={handleNameChange}
          label="Full Name"
          placeholder="John Doe"
          type="text"
          required
        />
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email"
          placeholder="email@example.com"
          type="email"
          required
        />
        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Min 8 characters with uppercase, lowercase, number & special char"
          type="password"
          required
        />
        <Input
          value={confirmPassword}
          onChange={({ target }) => setConfirmPassword(target.value)}
          label="Confirm Password"
          placeholder="Confirm your password"
          type="password"
          required
        />
        <button 
          type="submit" 
          className={styles.signupSubmit}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
        <p className={styles.switchText}>
          Already have an account?{' '}
          <button type="button" className={styles.signupSwitchButton} onClick={() => setCurrentPage('login')}>
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;