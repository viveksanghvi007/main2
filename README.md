# ResumeXpert - Enhanced Authentication System

A professional resume builder application with robust authentication, email verification, and OTP-based login system.

## Features

### 🔐 Authentication & Security
- **User Registration** with email verification
- **Password-based Login** with account lockout protection
- **OTP-based Login** for enhanced security
- **Email Verification** required before login
- **Account Lockout** after 5 failed attempts (15-minute lock)
- **Strong Password Requirements** (uppercase, lowercase, number, special character)

### 📧 Email System
- **OTP Generation** for login and verification
- **Welcome Emails** for new users
- **Professional Email Templates** with branding
- **Gmail SMTP Integration**

### 🛡️ Input Validation
- **Server-side Validation** using express-validator
- **Client-side Validation** with real-time feedback
- **Sanitized Inputs** to prevent injection attacks
- **Comprehensive Error Messages**

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Gmail account with App Password

## Installation

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ResumeXpert/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/resumexpert
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Email Configuration (Gmail)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   
   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```

4. **Gmail Setup for OTP**
   - Enable 2-factor authentication on your Gmail account
   - Generate an App Password:
     1. Go to Google Account settings
     2. Security → 2-Step Verification → App passwords
     3. Generate a new app password for "Mail"
     4. Use this password in your `.env` file

5. **Start the server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration with email verification |
| POST | `/api/auth/verify-email` | Verify email with OTP |
| POST | `/api/auth/login` | Password-based login |
| POST | `/api/auth/request-login-otp` | Request OTP for login |
| POST | `/api/auth/login-with-otp` | Login with OTP |
| POST | `/api/auth/resend-otp` | Resend OTP |
| GET | `/api/auth/profile` | Get user profile (protected) |

## User Flow

### Registration Flow
1. User fills registration form
2. Validation checks on client and server
3. User account created with OTP sent to email
4. User enters OTP for email verification
5. Email verified, user can now login

### Login Flow
1. User chooses login method (Password or OTP)
2. **Password Login**: Direct authentication
3. **OTP Login**: 
   - Request OTP sent to email
   - User enters 6-digit OTP
   - Account unlocked after successful verification

## Security Features

- **Account Lockout**: Temporary lock after 5 failed attempts
- **OTP Expiration**: 10-minute validity for security codes
- **Password Hashing**: bcrypt with salt rounds 12
- **JWT Tokens**: 7-day expiration with secure signing
- **Input Sanitization**: Prevents XSS and injection attacks
- **Rate Limiting**: Built-in protection against brute force

## Validation Rules

### Registration
- **Name**: 2-50 characters, letters and spaces only
- **Email**: Valid email format, unique in database
- **Password**: Minimum 8 characters with complexity requirements

### Login
- **Email**: Valid email format
- **Password**: Required for password-based login
- **OTP**: 6-digit numeric code

## Error Handling

The system provides comprehensive error messages:
- **Validation Errors**: Field-specific error messages
- **Authentication Errors**: Clear feedback on login issues
- **Account Lockout**: Time remaining information
- **OTP Errors**: Expiration and invalid code messages

## Email Templates

Professional HTML email templates for:
- **OTP Verification**: Clean, branded design
- **Welcome Email**: Onboarding experience
- **Login OTP**: Secure access codes

## Development

### Running in Development
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### Environment Variables
- `NODE_ENV`: Set to 'development' for detailed error messages
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASSWORD`: Gmail App Password
- `JWT_SECRET`: Strong secret key for JWT signing

## Troubleshooting

### Common Issues

1. **Email not sending**
   - Check Gmail App Password configuration
   - Verify 2FA is enabled
   - Check firewall/network restrictions

2. **OTP not working**
   - Verify email configuration
   - Check MongoDB connection
   - Ensure OTP hasn't expired

3. **Validation errors**
   - Check input format requirements
   - Verify server validation middleware
   - Check client-side validation

### Debug Mode
Set `NODE_ENV=development` for detailed error messages and logging.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please open an issue in the repository.
