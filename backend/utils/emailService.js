import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create a single reusable transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || 'viveksanghvi007@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password-here'
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email transporter verification failed:', process.env.EMAIL_USER);
    console.log('❌ Email transporter verification failed:', process.env.EMAIL_PASSWORD);
    console.error('❌ Email transporter verification failed:', error);
  } else {
    console.log('✅ Email transporter is ready to send emails');
    console.log('📧 Email configuration:', {
      user: process.env.EMAIL_USER || '',
      service: 'gmail'
    });
  }
});

// Generate OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (email, otp, purpose = 'login') => {
  try {
    console.log(`\n🔐 ===== OTP GENERATED =====`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔢 OTP Code: ${otp}`);
    console.log(`📝 Purpose: ${purpose}`);
    console.log(`⏰ Expires in: 10 minutes`);
    console.log(`=============================\n`);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log(`⚠️  Email service not configured. OTP logged above.`);
      return { success: true, messageId: 'dev-mode' };
    }

    const subject =
      purpose === 'login'
        ? 'Your Login OTP - ResumeXpert'
        : 'Your Verification OTP - ResumeXpert';

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">ResumeXpert</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #333;">${purpose === 'login' ? 'Login Verification' : 'Email Verification'}</h2>
          <p style="color: #666; font-size: 16px;">
            Your verification code is:
            <span style="font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 5px; background: white; padding: 10px 15px; border-radius: 5px; display: inline-block; margin: 10px 0;">
              ${otp}
            </span>
          </p>
          <p style="color: #666; font-size: 14px;">
            This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
          </p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #999; font-size: 12px;">
              Best regards,<br>
              The ResumeXpert Team
            </p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log(`\n📧 Welcome email would be sent to ${email} for ${name}\n`);
      return { success: true, messageId: 'dev-mode' };
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">ResumeXpert</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #333;">Welcome to ResumeXpert!</h2>
          <p style="color: #666; font-size: 16px;">
            Hi ${name},<br><br>
            Thank you for joining ResumeXpert! We're excited to help you create professional resumes that stand out.
          </p>
          <p style="color: #666; font-size: 16px;">
            Get started by creating your first resume with our easy-to-use templates and professional designs.
          </p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
              Start Building Your Resume
            </a>
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #999; font-size: 12px;">
              Best regards,<br>
              The ResumeXpert Team
            </p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to ResumeXpert!',
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Welcome email sending error:', error);
    return { success: false, error: error.message };
  }
};
