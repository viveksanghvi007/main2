# 🔧 Environment Setup for ResumeXpert

## 📧 Email Configuration

### **For Development (OTP in Console):**
1. Backend start karein: `npm start`
2. Console mein OTP show hoga automatically
3. Koi email setup ki zarurat nahi

### **For Production (Real Email):**
1. `.env` file create karein backend folder mein:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
```

2. Gmail App Password generate karein:
   - Gmail → Settings → Security → 2-Step Verification
   - App Passwords → Generate new app password
   - Use this password in EMAIL_PASSWORD

## 🧪 Testing OTP

### **Test OTP Generation:**
```bash
cd backend
node test-auth.js
```

### **Expected Console Output:**
```
🔐 ===== OTP GENERATED =====
📧 Email: test@example.com
🔢 OTP Code: 123456
📝 Purpose: login
⏰ Expires in: 10 minutes
=============================
```

## 🚨 Important Notes

- **Development Mode**: OTP automatically console mein show hoga
- **Mock Mode**: OTP `123456` always work karega
- **Real Email**: Only when .env file properly configured
- **Console Logs**: Always check backend console for OTP

## 🆘 Troubleshooting

### **OTP Not Showing:**
1. Backend server running hai?
2. Console mein koi error aa raha hai?
3. Email service properly imported hai?

### **Email Not Working:**
1. .env file properly created hai?
2. Gmail credentials correct hain?
3. App password generated kiya hai?

---

## 🤖 ATS/OpenAI Setup

ATS Analyzer ko enable karne ke liye backend mein yeh packages install karein:

```bash
cd backend
npm install openai pdf-parse mammoth
```

`.env` file mein OpenAI API key add karein:

```env
OPENAI_API_KEY=sk-your-openai-api-key
```

Server restart karein. Ab endpoints ready hain:
- `POST /api/resume/analyze` — Body: `{ resumeText, jobDescription? }`
- `POST /api/resume/analyze-upload` — Form-Data: `file` (PDF/DOCX), Query or Body: `jobDescription?`

Agar packages install na hon to API `501` status ke saath instruction dega ki kaun sa package missing hai.