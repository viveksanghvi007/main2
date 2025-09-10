// Comprehensive debug script for token undefined issue
import axios from 'axios';

const BASE_URL = 'http://localhost:4001';

async function debugTokenIssue() {
    console.log('🔍 Debugging Token Undefined Issue...\n');
    
    try {
        // Test 1: Password Login
        console.log('1️⃣ Testing Password Login...');
        const passwordLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: 'test@example.com',
            password: 'Test123!'
        });
        
        console.log('   📊 Response Status:', passwordLoginResponse.status);
        console.log('   📊 Response Data:', JSON.stringify(passwordLoginResponse.data, null, 2));
        console.log('   🔑 Has Token:', !!passwordLoginResponse.data.token);
        console.log('   🔑 Token Length:', passwordLoginResponse.data.token?.length || 0);
        console.log('   ✅ Success Flag:', passwordLoginResponse.data.success);
        console.log('   👤 Has User:', !!passwordLoginResponse.data.user);
        
        // Test 2: OTP Request
        console.log('\n2️⃣ Testing OTP Request...');
        const otpRequestResponse = await axios.post(`${BASE_URL}/api/auth/request-login-otp`, {
            email: 'test@example.com'
        });
        
        console.log('   📊 OTP Request Response:', JSON.stringify(otpRequestResponse.data, null, 2));
        
        // Test 3: OTP Login with 123456
        console.log('\n3️⃣ Testing OTP Login...');
        const otpLoginResponse = await axios.post(`${BASE_URL}/api/auth/login-with-otp`, {
            email: 'test@example.com',
            otp: '123456'
        });
        
        console.log('   📊 OTP Login Response:', JSON.stringify(otpLoginResponse.data, null, 2));
        console.log('   🔑 Has Token:', !!otpLoginResponse.data.token);
        console.log('   🔑 Token Length:', otpLoginResponse.data.token?.length || 0);
        console.log('   ✅ Success Flag:', otpLoginResponse.data.success);
        console.log('   👤 Has User:', !!otpLoginResponse.data.user);
        
        // Test 4: Profile with token
        if (otpLoginResponse.data.token) {
            console.log('\n4️⃣ Testing Profile with Token...');
            const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
                headers: {
                    'Authorization': `Bearer ${otpLoginResponse.data.token}`
                }
            });
            
            console.log('   📊 Profile Response:', JSON.stringify(profileResponse.data, null, 2));
        }
        
    } catch (error) {
        console.log('   ❌ Error:', error.message);
        if (error.response) {
            console.log('   📊 Status:', error.response.status);
            console.log('   📊 Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
    
    console.log('\n🎯 Debug Complete! Check the responses above for token issues.');
}

debugTokenIssue();
