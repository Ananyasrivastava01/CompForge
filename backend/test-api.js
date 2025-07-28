const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test function
async function testAPI() {
  try {
    console.log('🧪 Testing CompForge Backend API...\n');

    // Test health check
    console.log('1. Testing health check...');
    const health = await axios.get(`${BASE_URL.replace('/api', '')}/health`);
    console.log('✅ Health check:', health.data);

    // Test registration
    console.log('\n2. Testing user registration...');
    const timestamp = Date.now();
    const registerData = {
      email: `test${timestamp}@example.com`,
      password: 'password123',
      name: 'Test User'
    };
    
    const register = await axios.post(`${BASE_URL}/auth/register`, registerData);
    console.log('✅ Registration successful:', register.data.success);
    
    const token = register.data.token;

    // Test login
    console.log('\n3. Testing user login...');
    const loginData = {
      email: registerData.email,
      password: 'password123'
    };
    
    const login = await axios.post(`${BASE_URL}/auth/login`, loginData);
    console.log('✅ Login successful:', login.data.success);

    // Test protected route
    console.log('\n4. Testing protected route...');
    const me = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Protected route successful:', me.data.success);

    // Test session creation
    console.log('\n5. Testing session creation...');
    const sessionData = {
      name: 'Test Session',
      description: 'A test session for API testing'
    };
    
    const session = await axios.post(`${BASE_URL}/sessions`, sessionData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Session creation successful:', session.data.success);

    // Test AI generation
    console.log('\n6. Testing AI component generation...');
    const aiResponse = await axios.post(`${BASE_URL}/ai/generate`, {
      prompt: 'Create a simple button component with blue background'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ AI generation successful:', aiResponse.data.success);

    console.log('\n🎉 All tests passed! Backend is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI; 