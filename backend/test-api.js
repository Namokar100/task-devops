const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    console.log('Testing TaskBoard API...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✓ Health check:', health.data.status);

    // Test signup
    console.log('\n2. Testing signup...');
    const signup = await axios.post(`${BASE_URL}/auth/signup`, {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✓ Signup successful:', signup.data.message);

    // Test login
    console.log('\n3. Testing login...');
    const login = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    }, {
      withCredentials: true
    });
    
    const cookies = login.headers['set-cookie'];
    console.log('✓ Login successful:', login.data.message);

    // Test get boards
    console.log('\n4. Testing get boards...');
    const boards = await axios.get(`${BASE_URL}/boards`, {
      headers: {
        Cookie: cookies
      }
    });
    console.log('✓ Boards retrieved:', boards.data.length, 'boards');

    // Test create board
    console.log('\n5. Testing create board...');
    const newBoard = await axios.post(`${BASE_URL}/boards`, {
      title: 'Test Board',
      description: 'API Test Board'
    }, {
      headers: {
        Cookie: cookies
      }
    });
    console.log('✓ Board created:', newBoard.data.title);

    console.log('\n✅ All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAPI();