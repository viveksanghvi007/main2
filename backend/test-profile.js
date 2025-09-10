// Test script for profile endpoint
import axios from 'axios';

const BASE_URL = 'http://localhost:4001';

async function testProfile() {
    console.log('🧪 Testing profile endpoint...\n');
    
    try {
        // First, get a token by logging in
        console.log('1. Getting token via login...');
        const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: 'test@example.com',
            password: 'Test123!'
        });
        
        if (loginResponse.data.success && loginResponse.data.token) {
            const token = loginResponse.data.token;
            console.log('   ✅ Token received:', token.substring(0, 20) + '...');
            
            // Now test the profile endpoint
            console.log('\n2. Testing profile endpoint with token...');
            const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('   ✅ Profile endpoint working:', {
                success: profileResponse.data.success,
                hasUser: !!profileResponse.data.user,
                userData: profileResponse.data.user
            });
            
        } else {
            console.log('   ❌ Login failed:', loginResponse.data);
        }
        
    } catch (error) {
        console.log('   ❌ Error:', error.message);
        if (error.response) {
            console.log('   Status:', error.response.status);
            console.log('   Data:', error.response.data);
        }
    }
    
    console.log('\n🎉 Profile test completed!');
}

testProfile();
