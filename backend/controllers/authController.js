// controllers/authController.js (ES6 module version)

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { generateOTP, sendOTPEmail, sendWelcomeEmail } from "../utils/emailService.js";

// Generate JWT token
const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET || 'fallback-secret-key-for-development-only';
    return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
};

// Check if account is locked
const isAccountLocked = (user) => {
    return user.lockUntil && user.lockUntil > Date.now();
};

// Lock account
const lockAccount = async (userId) => {
    const lockTime = Date.now() + 15 * 60 * 1000; // 15 minutes
    await User.findByIdAndUpdate(userId, {
        lockUntil: lockTime,
        loginAttempts: 0
    });
};

// Reset login attempts
const resetLoginAttempts = async (userId) => {
    await User.findByIdAndUpdate(userId, {
        loginAttempts: 0,
        lockUntil: null
    });
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if database is connected
        if (!mongoose.connection.readyState) {
            console.log('⚠️  Database not connected, using mock registration for development');
            // Mock registration for development
            const mockUser = {
                _id: 'mock-user-id-' + Date.now(),
                name: name,
                email: email,
                isEmailVerified: false
            };
            
            return res.status(201).json({
                success: true,
                message: "Registration successful! (Mock Mode) - Please check console for OTP",
                user: mockUser
            });
        }
        console.log('👤 Registration request received:', { name, email, password: password ? '***' : 'undefined' });

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ 
                success: false, 
                message: "User with this email already exists" 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP for email verification
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            otp: {
                code: otp,
                expiresAt: otpExpiry
            }
        });

        // Send OTP email
        const emailResult = await sendOTPEmail(email, otp, 'verification');
        if (!emailResult.success) {
            console.error('Failed to send OTP email:', emailResult.error);
            // In development mode, don't fail if email is not configured
            if (process.env.NODE_ENV === 'development' && (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD)) {
                console.log('⚠️  Email not configured, but OTP generated successfully');
            }
        }

        // Return user data (without OTP)
        res.status(201).json({
            success: true,
            message: "Registration successful! Please check your email for verification code.",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Server error during registration", 
            error: error.message 
        });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        // Check if database is connected
        if (!mongoose.connection.readyState) {
            console.log('⚠️  Database not connected, using mock verification for development');
            // Mock verification for development
            if (otp === '123456') {
                return res.json({
                    success: true,
                    message: "Email verified successfully! (Mock Mode)",
                    user: {
                        _id: 'mock-user-id',
                        name: 'Test User',
                        email: email,
                        isEmailVerified: true
                    }
                });
            } else {
                return res.status(400).json({ 
                    success: false, 
                    message: "Invalid OTP (Use 123456 for mock mode)" 
                });
            }
        }
        console.log('✅ Email verification request received:', { email, otp, body: req.body });

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ 
                success: false, 
                message: "Email is already verified" 
            });
        }

        if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
            return res.status(400).json({ 
                success: false, 
                message: "No OTP found or OTP expired" 
            });
        }

        if (user.otp.expiresAt < Date.now()) {
            return res.status(400).json({ 
                success: false, 
                message: "OTP has expired" 
            });
        }

        if (user.otp.code !== otp) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid OTP code" 
            });
        }

        // Verify email and clear OTP
        user.isEmailVerified = true;
        user.otp = undefined;
        await user.save();

        // Send welcome email
        await sendWelcomeEmail(email, user.name);

        res.json({
            success: true,
            message: "Email verified successfully! You can now login.",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Server error during email verification", 
            error: error.message 
        });
    }
};

export const requestLoginOTP = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if database is connected
        if (!mongoose.connection.readyState) {
            console.log('⚠️  Database not connected, using mock OTP for development');
            // Mock OTP for development
            const mockOTP = '123456';
            console.log(`📧 Mock OTP for ${email}: ${mockOTP}`);
            
            return res.json({
                success: true,
                message: "OTP sent to your email successfully (Mock Mode - Check console)"
            });
        }
        console.log('📧 OTP Request received:', { email, body: req.body });

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        if (!user.isEmailVerified) {
            return res.status(400).json({ 
                success: false, 
                message: "Please verify your email first" 
            });
        }

        // Check if account is locked
        if (isAccountLocked(user)) {
            const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
            return res.status(423).json({ 
                success: false, 
                message: `Account is temporarily locked. Please try again in ${remainingTime} minutes.` 
            });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.otp = {
            code: otp,
            expiresAt: otpExpiry
        };
        await user.save();

        // Send OTP email
        const emailResult = await sendOTPEmail(email, otp, 'login');
        if (!emailResult.success) {
            console.error('Email sending failed:', emailResult.error);
            // In development mode, don't fail if email is not configured
            if (process.env.NODE_ENV === 'development' && (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD)) {
                console.log('⚠️  Email not configured, but OTP generated successfully');
            } else {
                return res.status(500).json({ 
                    success: false, 
                    message: "Failed to send OTP email" 
                });
            }
        }

        res.json({
            success: true,
            message: "OTP sent to your email successfully"
        });
    } catch (error) {
        console.error('OTP request error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Server error while sending OTP", 
            error: error.message 
        });
    }
};

export const loginWithOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        // Check if database is connected
        if (!mongoose.connection.readyState) {
            console.log('⚠️  Database not connected, using mock OTP login for development');
            // Mock OTP login for development
            if (otp === '123456') {
                const mockUser = {
                    _id: 'mock-user-id',
                    name: 'Test User',
                    email: email,
                    isEmailVerified: true
                };
                
                // Generate proper JWT token even in mock mode
                const mockToken = generateToken('mock-user-id');
                console.log('🔐 Mock Mode OTP Login JWT Token generated:', mockToken);
                
                return res.json({
                    success: true,
                    message: "Login successful! (Mock Mode)",
                    user: mockUser,
                    token: mockToken
                });
            } else {
                return res.status(400).json({ 
                    success: false, 
                    message: "Invalid OTP (Use 123456 for mock mode)" 
                });
            }
        }
        console.log('🔐 OTP Login request received:', { email, otp, body: req.body });

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        if (!user.isEmailVerified) {
            return res.status(400).json({ 
                success: false, 
                message: "Please verify your email first" 
            });
        }

        // Check if account is locked
        if (isAccountLocked(user)) {
            const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
            return res.status(423).json({ 
                success: false, 
                message: `Account is temporarily locked. Please try again in ${remainingTime} minutes.` 
            });
        }

        // Verify OTP
        if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
            return res.status(400).json({ 
                success: false, 
                message: "No OTP found or OTP expired" 
            });
        }

        if (user.otp.expiresAt < Date.now()) {
            return res.status(400).json({ 
                success: false, 
                message: "OTP has expired" 
            });
        }

        if (user.otp.code !== otp) {
            // Increment login attempts
            user.loginAttempts += 1;
            
            if (user.loginAttempts >= 5) {
                await lockAccount(user._id);
                return res.status(423).json({ 
                    success: false, 
                    message: "Too many failed attempts. Account locked for 15 minutes." 
                });
            }
            
            await user.save();
            return res.status(400).json({ 
                success: false, 
                message: `Invalid OTP. ${5 - user.loginAttempts} attempts remaining.` 
            });
        }

        // Reset login attempts and clear OTP
        await resetLoginAttempts(user._id);
        user.otp = undefined;
        await user.save();

        // Generate JWT token
        const token = generateToken(user._id);
        console.log('🔐 OTP Login JWT Token generated:', token);
        console.log('🔐 OTP Login User ID for token:', user._id);

        // Return user data with JWT
        res.json({
            success: true,
            message: "Login successful!",
            user: {
            _id: user._id,
            name: user.name,
            email: user.email,
                isEmailVerified: user.isEmailVerified
            },
            token: token
        });
    } catch (error) {
        console.error('OTP login error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Server error during login", 
            error: error.message 
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if database is connected
        if (!mongoose.connection.readyState) {
            console.log('⚠️  Database not connected, using mock auth for development');
            // Mock authentication for development
            if (email === 'test@example.com' && password === 'Test123!') {
                const mockUser = {
                    _id: 'mock-user-id',
                    name: 'Test User',
                    email: 'test@example.com',
                    isEmailVerified: true
                };
                
                // Generate proper JWT token even in mock mode
                const mockToken = generateToken('mock-user-id');
                console.log('🔐 Mock Mode Password Login JWT Token generated:', mockToken);
                
                return res.json({
                    success: true,
                    message: "Login successful! (Mock Mode)",
                    user: mockUser,
                    token: mockToken
                });
            } else {
                return res.status(400).json({ 
                    success: false, 
                    message: "Invalid email or password (Use test@example.com / Test123!)" 
                });
            }
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid email or password" 
            });
        }

        if (!user.isEmailVerified) {
            return res.status(400).json({ 
                success: false, 
                message: "Please verify your email first" 
            });
        }

        // Check if account is locked
        if (isAccountLocked(user)) {
            const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
            return res.status(423).json({ 
                success: false, 
                message: `Account is temporarily locked. Please try again in ${remainingTime} minutes.` 
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Increment login attempts
            user.loginAttempts += 1;
            
            if (user.loginAttempts >= 5) {
                await lockAccount(user._id);
                return res.status(423).json({ 
                    success: false, 
                    message: "Too many failed attempts. Account locked for 15 minutes." 
                });
            }
            
            await user.save();
            return res.status(400).json({ 
                success: false, 
                message: `Invalid email or password. ${5 - user.loginAttempts} attempts remaining.` 
            });
        }

        // Reset login attempts
        await resetLoginAttempts(user._id);

        // Generate JWT token
        const token = generateToken(user._id);
        console.log('🔐 Password Login JWT Token generated:', token);
        console.log('🔐 Password Login User ID for token:', user._id);

        // Return user data with JWT
        res.json({
            success: true,
            message: "Login successful!",
            user: {
            _id: user._id,
            name: user.name,
            email: user.email,
                isEmailVerified: user.isEmailVerified
            },
            token: token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Server error during login", 
            error: error.message 
        });
    }
};

export const resendOTP = async (req, res) => {
    try {
        const { email, purpose = 'login' } = req.body;
        console.log('🔄 OTP Resend request received:', { email, purpose, body: req.body });

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.otp = {
            code: otp,
            expiresAt: otpExpiry
        };
        await user.save();

        // Send OTP email
        const emailResult = await sendOTPEmail(email, otp, purpose);
        if (!emailResult.success) {
            console.error('Email sending failed:', emailResult.error);
            // In development mode, don't fail if email is not configured
            if (process.env.NODE_ENV === 'development' && (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD)) {
                console.log('⚠️  Email not configured, but OTP generated successfully');
            } else {
                return res.status(500).json({ 
                    success: false, 
                    message: "Failed to send OTP email" 
                });
            }
        }

        res.json({
            success: true,
            message: "OTP resent successfully"
        });
    } catch (error) {
        console.error('OTP resend error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Server error while resending OTP", 
            error: error.message 
        });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        // Check if database is connected
        if (!mongoose.connection.readyState) {
            console.log('⚠️  Database not connected, using mock profile for development');
            // Mock profile for development
            const mockUser = {
                _id: 'mock-user-id',
                name: 'Test User',
                email: 'test@example.com',
                isEmailVerified: true
            };
            
            return res.json({
                success: true,
                user: mockUser
            });
        }

        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Server error while fetching profile", 
            error: error.message 
        });
    }
};
