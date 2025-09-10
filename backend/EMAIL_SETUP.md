# Email Configuration Guide

## Current Status
- ✅ OTP generation working
- ✅ Backend API working  
- ⚠️ Email delivery not configured (OTP logged to console)

## How to Configure Email Service

### Option 1: Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Copy the 16-character password

3. **Create .env file** in backend folder:
```env
# Database Configuration
MONGO_URL=mongodb://localhost:27017/resumexpert

# JWT Configuration  
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password

# Server Configuration
PORT=4001
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

4. **Restart backend server:**
```bash
cd backend
npm start
```

### Option 2: Development Mode (Current)
- OTP codes are logged to backend console
- Check terminal where backend is running
- Use the OTP code shown in console

## Testing
1. Start backend: `npm start`
2. Start frontend: `npm run dev`  
3. Try OTP login
4. Check backend console for OTP code

## Troubleshooting
- Make sure to use App Password, not regular Gmail password
- Check spam folder if emails are configured
- Verify .env file is in backend folder
- Restart server after changing .env

