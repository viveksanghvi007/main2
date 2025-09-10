# 🧪 Testing Instructions for ResumeXpert

## 🚀 Quick Start

### 1. Start the Backend Server
```bash
cd backend
npm start
```

The server will start on `http://localhost:4001`

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔐 Testing Authentication (Mock Mode)

Since MongoDB is not configured, the system will run in **Mock Mode** for development.

### 📝 Test Registration
1. Go to `/signup`
2. Fill in the form:
   - **Name**: Any name (must start with letter)
   - **Email**: Any valid email
   - **Password**: Must be 8+ chars with uppercase, lowercase, number, and special char
   - **Confirm Password**: Same as password
3. Submit the form
4. You'll see: "Registration successful! (Mock Mode) - Please check console for OTP"

### 🔢 Test OTP Verification
1. After registration, you'll be redirected to OTP verification
2. **Use OTP**: `123456` (this is the mock OTP)
3. Submit the OTP
4. You'll see: "Email verified successfully! (Mock Mode)"
5. You'll be redirected to login page

### 🔑 Test Login (Password Method)
1. Go to `/login`
2. Use these credentials:
   - **Email**: `test@example.com`
   - **Password**: `Test123!`
3. Submit the form
4. You'll see: "Login successful! (Mock Mode)"
5. You'll be redirected to dashboard

### 📱 Test Login (OTP Method)
1. Go to `/login`
2. Switch to **OTP** tab
3. Enter any email
4. Click "Send OTP"
5. You'll see: "OTP sent to your email successfully (Mock Mode - Check console)"
6. **Use OTP**: `123456`
7. Submit the OTP
8. You'll see: "Login successful! (Mock Mode)"
9. You'll be redirected to dashboard

## 🐛 Troubleshooting

### If you see "Token is undefined":
1. Check the browser console for error messages
2. Make sure the backend server is running on port 4001
3. Check if the frontend is connecting to the correct backend URL

### If OTP is not working:
1. Check the backend console for OTP generation logs
2. In mock mode, OTP `123456` should always work
3. Make sure you're using the correct OTP format (6 digits)

### If database connection fails:
1. The system will automatically switch to Mock Mode
2. You'll see warnings in the console about database connection
3. All authentication will work with mock data

## 🔧 Environment Setup (Optional)

To use real email and database:

### 1. Create `.env` file in backend folder:
```env
PORT=4001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/resumexpert
JWT_SECRET=your-super-secret-jwt-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
```

### 2. Start MongoDB locally or use MongoDB Atlas

### 3. Configure Gmail App Password for email functionality

## 🎯 Expected Behavior

- ✅ **Registration**: Should work with mock data
- ✅ **OTP Generation**: Should log to console in mock mode
- ✅ **Email Verification**: Should work with OTP `123456`
- ✅ **Password Login**: Should work with `test@example.com` / `Test123!`
- ✅ **OTP Login**: Should work with any email + OTP `123456`
- ✅ **Navigation**: Should redirect properly after successful auth
- ✅ **Toast Notifications**: Should show success/error messages
- ✅ **Protected Routes**: Should redirect to login if not authenticated

## 🚨 Important Notes

- **Mock Mode** is for development only
- **OTP `123456`** works for all scenarios in mock mode
- **Test credentials** are hardcoded for development
- **Real deployment** requires proper database and email configuration
- **Console logs** will show mock data and OTPs

## 🆘 Need Help?

Check the browser console and backend console for detailed error messages. The system includes comprehensive logging for debugging.
