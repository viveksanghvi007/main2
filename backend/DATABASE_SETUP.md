# Database Setup Guide

## Current Status
- ✅ Backend API working
- ✅ Validation working
- ⚠️ Database connection not configured

## Quick Setup Options

### Option 1: Local MongoDB (Recommended for Development)

1. **Install MongoDB locally:**
   - Download from: https://www.mongodb.com/try/download/community
   - Install and start MongoDB service

2. **Or use MongoDB Docker:**
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

3. **Start backend:**
   ```bash
   cd backend
   npm start
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create free account:** https://www.mongodb.com/cloud/atlas
2. **Create cluster** (free tier)
3. **Get connection string**
4. **Create .env file:**
   ```env
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/resumexpert
   ```

### Option 3: Development Mode (Current)
- Backend runs without database
- Some features may not work
- Good for testing API endpoints

## Testing
1. Start backend: `npm start`
2. Try signup/login
3. Check console for database status

## Troubleshooting
- Check if MongoDB is running
- Verify connection string
- Check firewall settings
- Restart backend after changes

