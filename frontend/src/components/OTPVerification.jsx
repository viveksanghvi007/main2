import React, { useState, useEffect } from 'react';
import { Input } from './Inputs';
import { authStyles as styles } from '../assets/dummystyle';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import toast from 'react-hot-toast';

const OTPVerification = ({ 
    email, 
    purpose = 'verification', 
    onSuccess, 
    onBack, 
    onResend 
}) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return; // Prevent multiple characters
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.querySelector(`input[data-index="${index + 1}"]`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.querySelector(`input[data-index="${index - 1}"]`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        
        if (otpString.length !== 6) {
            toast.error('Please enter the complete 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            let response;
            if (purpose === 'verification') {
                response = await axiosInstance.post(API_PATHS.AUTH.VERIFY_EMAIL, {
                    email,
                    otp: otpString
                });
            } else {
                response = await axiosInstance.post(API_PATHS.AUTH.LOGIN_WITH_OTP, {
                    email,
                    otp: otpString
                });
            }

            if (response.data.success) {
                console.log('🔐 OTP verification successful:', response.data);
                console.log('🔐 Full response structure:', {
                    success: response.data.success,
                    hasToken: !!response.data.token,
                    hasUser: !!response.data.user,
                    tokenLength: response.data.token?.length || 0,
                    message: response.data.message
                });
                
                if (purpose === 'verification') {
                    toast.success('Email verified successfully!');
                } else {
                    toast.success('Login successful!');
                }
                
                console.log('🔐 Calling onSuccess with:', response.data);
                onSuccess(response.data);
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            console.error('Error response:', error.response?.data);
            
            let errorMessage = 'Verification failed. Please try again.';
            
            if (error.response?.status === 400) {
                // Handle validation errors
                if (error.response.data?.errors) {
                    const validationErrors = error.response.data.errors.map(err => err.message).join(', ');
                    errorMessage = `Validation Error: ${validationErrors}`;
                } else {
                    errorMessage = error.response.data?.message || 'Invalid OTP. Please check and try again.';
                }
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (countdown > 0) return;
        
        setLoading(true);
        setError('');

        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.RESEND_OTP, {
                email,
                purpose
            });

            if (response.data.success) {
                toast.success('OTP resent successfully!');
                setCountdown(60); // 60 seconds countdown
                onResend && onResend();
            }
        } catch (error) {
            console.error('OTP resend error:', error);
            console.error('Error response:', error.response?.data);
            
            let errorMessage = 'Failed to resend OTP. Please try again.';
            
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

    return (
        <div className={styles.container}>
            <div className={styles.headerWrapper}>
                <h3 className={styles.title}>
                    {purpose === 'verification' ? 'Verify Your Email' : 'Enter Login OTP'}
                </h3>
                <p className={styles.subtitle}>
                    {purpose === 'verification' 
                        ? 'We\'ve sent a verification code to your email'
                        : 'Enter the 6-digit code sent to your email'
                    }
                </p>
                <p className={styles.emailText}>{email}</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            data-index={index}
                            className={styles.otpInput}
                            placeholder="0"
                        />
                    ))}
                </div>

                <button 
                    type="submit" 
                    className={styles.submitButton}
                    disabled={loading || otp.join('').length !== 6}
                >
                    {loading ? 'Verifying...' : purpose === 'verification' ? 'Verify Email' : 'Login'}
                </button>

                <div className={styles.otpActions}>
                    <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={countdown > 0 || loading}
                        className={styles.resendButton}
                    >
                        {countdown > 0 
                            ? `Resend in ${countdown}s` 
                            : 'Resend OTP'
                        }
                    </button>
                    
                    <button
                        type="button"
                        onClick={onBack}
                        className={styles.backButton}
                        disabled={loading}
                    >
                        Back
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OTPVerification;
