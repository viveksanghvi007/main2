// Comprehensive OTP Send Test Script
import axios from 'axios';

const BASE_URL = 'http://localhost:4001';

async function testOTPSend() {
    console.log('🔍 Testing OTP Send Functionality...\n');
    
    try {
        // Test 1: Check if server is running
        console.log('1️⃣ Testing server connectivity...');
        const serverResponse = await axios.get(`${BASE_URL}/`);
        console.log('   ✅ Server is running:', serverResponse.data.message);
        
        // Test 2: Test OTP request endpoint
        console.log('\n2️⃣ Testing OTP request endpoint...');
        const otpRequestResponse = await axios.post(`${BASE_URL}/api/auth/request-login-otp`, {
            email: 'test@example.com'
        });
        
        console.log('   📊 OTP Request Response:');
        console.log('   Status:', otpRequestResponse.status);
        console.log('   Success:', otpRequestResponse.data.success);
        console.log('   Message:', otpRequestResponse.data.message);
        
        if (otpRequestResponse.data.success) {
            console.log('   ✅ OTP request successful!');
        } else {
            console.log('   ❌ OTP request failed!');
        }
        
        // Test 3: Test with different email
        console.log('\n3️⃣ Testing OTP request with different email...');
        const otpRequestResponse2 = await axios.post(`${BASE_URL}/api/auth/request-login-otp`, {
            email: 'user@example.com'
        });
        
        console.log('   📊 Second OTP Request Response:');
        console.log('   Status:', otpRequestResponse2.status);
        console.log('   Success:', otpRequestResponse2.data.success);
        console.log('   Message:', otpRequestResponse2.data.message);
        
        // Test 4: Test OTP login with 123456
        console.log('\n4️⃣ Testing OTP login with 123456...');
        const otpLoginResponse = await axios.post(`${BASE_URL}/api/auth/login-with-otp`, {
            email: 'test@example.com',
            otp: '123456'
        });
        
        console.log('   📊 OTP Login Response:');
        console.log('   Status:', otpLoginResponse.status);
        console.log('   Success:', otpLoginResponse.data.success);
        console.log('   Message:', otpLoginResponse.data.message);
        console.log('   Has Token:', !!otpLoginResponse.data.token);
        
        if (otpLoginResponse.data.success && otpLoginResponse.data.token) {
            console.log('   ✅ OTP login successful!');
        } else {
            console.log('   ❌ OTP login failed!');
        }
        
    } catch (error) {
        console.log('   ❌ Error:', error.message);
        if (error.response) {
            console.log('   📊 Status:', error.response.status);
            console.log('   📊 Data:', JSON.stringify(error.response.data, null, 2));
        } else if (error.code === 'ECONNREFUSED') {
            console.log('   ❌ Server not running! Please start backend server first.');
            console.log('   💡 Run: cd backend && npm start');
        }
    }
    
    console.log('\n🎯 OTP Send Test Complete!');
    console.log('\n📝 Expected Behavior:');
    console.log('   - OTP request should return success: true');
    console.log('   - Message should indicate OTP sent (Mock Mode)');
    console.log('   - Backend console should show OTP: 123456');
    console.log('   - OTP login with 123456 should work');
}

testOTPSend();
