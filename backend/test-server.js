// Simple test script to check server connectivity
import axios from 'axios';

const BASE_URL = 'http://localhost:4001';

async function testServer() {
    console.log('🧪 Testing server connectivity...\n');
    
    try {
        // Test root endpoint
        console.log('1. Testing root endpoint...');
        const rootResponse = await axios.get(`${BASE_URL}/`);
        console.log('   ✅ Root endpoint working:', rootResponse.data);
        
        // Test auth endpoint
        console.log('\n2. Testing auth endpoint...');
        const authResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: 'test@example.com',
            password: 'testpassword'
        });
        console.log('   ✅ Auth endpoint working:', authResponse.data);
        
    } catch (error) {
        console.log('   ❌ Error:', error.message);
        if (error.response) {
            console.log('   Status:', error.response.status);
            console.log('   Data:', error.response.data);
        }
    }
    
    console.log('\n🎉 Server test completed!');
}

testServer();
