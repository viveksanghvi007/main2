// Test script to verify all imports are working
console.log('🧪 Testing imports...\n');

try {
    console.log('1. Testing authMiddleware import...');
    const { authenticateToken } = await import('./middlewares/authMiddleware.js');
    console.log('   ✅ authenticateToken imported successfully');
    
    console.log('\n2. Testing authRoutes import...');
    const authRoutes = await import('./routes/authRoutes.js');
    console.log('   ✅ authRoutes imported successfully');
    
    console.log('\n3. Testing resumeRoutes import...');
    const resumeRoutes = await import('./routes/resumeRoutes.js');
    console.log('   ✅ resumeRoutes imported successfully');
    
    console.log('\n4. Testing authController import...');
    const { loginUser, getUserProfile } = await import('./controllers/authController.js');
    console.log('   ✅ authController functions imported successfully');
    
    console.log('\n🎉 All imports working correctly!');
    
} catch (error) {
    console.error('❌ Import error:', error.message);
    console.error('Stack:', error.stack);
}
