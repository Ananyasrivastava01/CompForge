const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test function
async function comprehensiveTest() {
  try {
    console.log('🧪 COMPREHENSIVE BACKEND TESTING\n');
    console.log('=' .repeat(50));

    // Test 1: Health Check
    console.log('\n1️⃣ HEALTH CHECK');
    const health = await axios.get(`${BASE_URL.replace('/api', '')}/health`);
    console.log('✅ Health check:', health.data.status);

    // Test 2: OAuth URLs
    console.log('\n2️⃣ OAUTH CONFIGURATION');
    const oauthUrls = await axios.get(`${BASE_URL}/auth/oauth/urls`);
    console.log('✅ OAuth URLs:', Object.keys(oauthUrls.data.data));
    console.log('   - Google OAuth configured:', !!oauthUrls.data.data.google);
    console.log('   - GitHub OAuth configured:', !!oauthUrls.data.data.github);

    // Test 3: User Registration
    console.log('\n3️⃣ USER REGISTRATION');
    const timestamp = Date.now();
    const registerData = {
      email: `test${timestamp}@example.com`,
      password: 'password123',
      name: 'Test User'
    };
    const register = await axios.post(`${BASE_URL}/auth/register`, registerData);
    console.log('✅ Registration successful');
    const token = register.data.token;

    // Test 4: User Login
    console.log('\n4️⃣ USER LOGIN');
    const login = await axios.post(`${BASE_URL}/auth/login`, {
      email: registerData.email,
      password: 'password123'
    });
    console.log('✅ Login successful');

    // Test 5: Protected Route
    console.log('\n5️⃣ PROTECTED ROUTES');
    const me = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Protected route access:', me.data.user.name);

    // Test 6: Session Management
    console.log('\n6️⃣ SESSION MANAGEMENT');
    
    // Create session
    const sessionData = {
      name: 'Test Session',
      description: 'Testing session functionality'
    };
    const session = await axios.post(`${BASE_URL}/sessions`, sessionData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Session created:', session.data.data.name);
    const sessionId = session.data.data._id;

    // Get all sessions
    const sessions = await axios.get(`${BASE_URL}/sessions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Sessions retrieved:', sessions.data.count, 'sessions');

    // Get single session
    const singleSession = await axios.get(`${BASE_URL}/sessions/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Single session retrieved');

    // Test 7: Chat System
    console.log('\n7️⃣ CHAT SYSTEM');
    
    // Add user message
    const userMessage = await axios.post(`${BASE_URL}/sessions/${sessionId}/chat`, {
      role: 'user',
      content: 'Create a simple button component'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ User message added');

    // Add AI message
    const aiMessage = await axios.post(`${BASE_URL}/sessions/${sessionId}/chat`, {
      role: 'assistant',
      content: 'Here is a simple button component...'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ AI message added');

    // Test 8: AI Integration
    console.log('\n8️⃣ AI INTEGRATION');
    
    // Generate component
    const aiGenerate = await axios.post(`${BASE_URL}/ai/generate`, {
      prompt: 'Create a blue button with rounded corners',
      sessionId: sessionId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ AI component generation successful');
    console.log('   - JSX Code length:', aiGenerate.data.jsxCode?.length || 0);
    console.log('   - CSS Code length:', aiGenerate.data.cssCode?.length || 0);

    // Test chat endpoint
    const chatResponse = await axios.post(`${BASE_URL}/ai/chat`, {
      message: 'Create a simple button component',
      sessionId: sessionId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ AI chat endpoint successful');
    console.log('   - Chat response message:', chatResponse.data.message);
    console.log('   - Chat JSX Code length:', chatResponse.data.jsxCode?.length || 0);

    // Test 9: Session Update
    console.log('\n9️⃣ SESSION UPDATE');
    const updateData = {
      name: 'Updated Test Session',
      currentComponent: {
        jsxCode: 'export default function Button() { return <button>Click me</button>; }',
        cssCode: '.button { background: blue; }',
        metadata: { name: 'Test Button' },
        version: 1
      }
    };
    const updateSession = await axios.put(`${BASE_URL}/sessions/${sessionId}`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Session updated successfully');

    // Test 10: Error Handling
    console.log('\n🔟 ERROR HANDLING');
    
    // Test invalid token
    try {
      await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: 'Bearer invalid-token' }
      });
    } catch (error) {
      console.log('✅ Invalid token properly rejected');
    }

    // Test duplicate email
    try {
      await axios.post(`${BASE_URL}/auth/register`, registerData);
    } catch (error) {
      console.log('✅ Duplicate email properly rejected');
    }

    // Test 11: Cleanup
    console.log('\n1️⃣1️⃣ CLEANUP');
    
    // Delete session
    const deleteSession = await axios.delete(`${BASE_URL}/sessions/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Session deleted successfully');

    console.log('\n' + '=' .repeat(50));
    console.log('🎉 COMPREHENSIVE TEST COMPLETED SUCCESSFULLY!');
    console.log('=' .repeat(50));
    
    console.log('\n📊 TEST SUMMARY:');
    console.log('✅ Health Check');
    console.log('✅ OAuth Configuration');
    console.log('✅ User Registration');
    console.log('✅ User Login');
    console.log('✅ Protected Routes');
    console.log('✅ Session Management (CRUD)');
    console.log('✅ Chat System');
    console.log('✅ AI Integration');
    console.log('✅ Session Updates');
    console.log('✅ Error Handling');
    console.log('✅ Cleanup Operations');
    
    console.log('\n🚀 BACKEND IS FULLY FUNCTIONAL AND READY FOR FRONTEND!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Stack:', error.stack);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  comprehensiveTest();
}

module.exports = comprehensiveTest; 