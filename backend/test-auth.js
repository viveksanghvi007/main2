// Simple test script to test authentication endpoints
import axios from 'axios';

const BASE_URL = 'http://localhost:4001';

async function testAuth() {
    console.log('🧪 Testing authentication endpoints...\n');
    
    try {
        // Test password login
        console.log('1. Testing password login...');
        const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: 'test@example.com',
            password: 'Test123!'
        });
        console.log('   ✅ Password login working:', {
            success: loginResponse.data.success,
            hasToken: !!loginResponse.data.token,
            tokenLength: loginResponse.data.token?.length || 0,
            user: loginResponse.data.user
        });
        
        // Test OTP request
        console.log('\n2. Testing OTP request...');
        const otpResponse = await axios.post(`${BASE_URL}/api/auth/request-login-otp`, {
            email: 'test@example.com'
        });
        console.log('   ✅ OTP request working:', {
            success: otpResponse.data.success,
            message: otpResponse.data.message
        });
        
        // Test OTP login
        console.log('\n3. Testing OTP login...');
        const otpLoginResponse = await axios.post(`${BASE_URL}/api/auth/login-with-otp`, {
            email: 'test@example.com',
            otp: '123456'
        });
        console.log('   ✅ OTP login working:', {
            success: otpLoginResponse.data.success,
            hasToken: !!otpLoginResponse.data.token,
            tokenLength: otpLoginResponse.data.token?.length || 0,
            user: otpLoginResponse.data.user
        });
        
    } catch (error) {
        console.log('   ❌ Error:', error.message);
        if (error.response) {
            console.log('   Status:', error.response.status);
            console.log('   Data:', error.response.data);
        }
    }
    
    console.log('\n🎉 Authentication test completed!');
}

testAuth();
