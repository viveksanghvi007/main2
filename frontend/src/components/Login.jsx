import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from './Inputs';
import { validateEmail } from '../utils/helper';
import { UserContext } from '../context/userContext';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { authStyles as styles } from '../assets/dummystyle';
import OTPVerification from './OTPVerification';
import toast from 'react-hot-toast';

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const validateForm = () => {
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return false;
    }
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (loginMethod === 'password' && !password.trim()) {
      toast.error('Please enter your password');
      return false;
    }
    return true;
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
      console.log('🔐 Login response:', response.data);
      
      if (response.data.success && response.data.token) {
        console.log('✅ Token received:', response.data.token);
        console.log('✅ User data received:', response.data.user);
        
        toast.success('Login successful!');
        localStorage.setItem('token', response.data.token);
        
        // Verify token was stored
        const storedToken = localStorage.getItem('token');
        console.log('✅ Token stored in localStorage:', storedToken);
        
        updateUser(response.data.user);
        // Get the intended destination or default to dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        console.error('❌ Login failed - missing token or success flag');
        console.error('Response data:', response.data);
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOTP = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REQUEST_LOGIN_OTP, { email });
      if (response.data.success) {
        toast.success('OTP sent to your email successfully!');
        setShowOTP(true);
      }
    } catch (error) {
      console.error('OTP request error:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Failed to send OTP. Please try again.';
      
      // Check if it's a network error
      if (!error.response) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (error.response.status === 400) {
        // Handle validation errors
        if (error.response.data?.errors) {
          const validationErrors = error.response.data.errors.map(err => err.message).join(', ');
          errorMessage = `Validation Error: ${validationErrors}`;
        } else {
          errorMessage = error.response.data?.message || 'Invalid request data. Please check your input.';
        }
      } else {
        errorMessage = error.response.data?.message || errorMessage;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSuccess = (data) => {
    console.log('🔐 OTP Login success data:', data);
    console.log('🔐 Data type:', typeof data);
    console.log('🔐 Data keys:', Object.keys(data || {}));
    console.log('🔐 Full data structure:', JSON.stringify(data, null, 2));
    
    if (data && data.token) {
      console.log('✅ OTP Token received:', data.token);
      console.log('✅ OTP User data received:', data.user);
      
      toast.success('Login successful!');
      localStorage.setItem('token', data.token);
      
      // Verify token was stored
      const storedToken = localStorage.getItem('token');
      console.log('✅ OTP Token stored in localStorage:', storedToken);
      
      updateUser(data.user);
      // Get the intended destination or default to dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } else {
      console.error('❌ OTP Login failed - missing token');
      console.error('Data received:', data);
      console.error('Data type:', typeof data);
      console.error('Data keys:', Object.keys(data || {}));
      toast.error('Login failed. Missing authentication token.');
    }
  };

  const handleBack = () => {
    setShowOTP(false);
    setError('');
  };

  if (showOTP) {
    return (
      <OTPVerification
        email={email}
        purpose="login"
        onSuccess={handleOTPSuccess}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.title}>Welcome Back</h3>
        <p className={styles.subtitle}>Sign in to continue building amazing resumes</p>
      </div>

      <div className={styles.loginMethodToggle}>
        <button
          type="button"
          className={`${styles.toggleButton} ${loginMethod === 'password' ? styles.active : ''}`}
          onClick={() => setLoginMethod('password')}
        >
          Password
        </button>
        <button
          type="button"
          className={`${styles.toggleButton} ${loginMethod === 'otp' ? styles.active : ''}`}
          onClick={() => setLoginMethod('otp')}
        >
          OTP
        </button>
      </div>

      {loginMethod === 'password' ? (
        <form onSubmit={handlePasswordLogin} className={styles.form}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="hexagonsservices@gmail.com"
            type="email"
            required
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Enter your password"
            type="password"
            required
          />
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      ) : (
        <div className={styles.form}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="hexagonsservices@gmail.com"
            type="email"
            required
          />
          <button 
            type="button"
            onClick={handleRequestOTP}
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </div>
      )}

      <p className={styles.switchText}>
        Don't have an account?{' '}
        <button type="button" className={styles.switchButton} onClick={() => setCurrentPage('signup')}>
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;
