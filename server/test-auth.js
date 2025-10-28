import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';

console.log('\n🧪 TESTING AUTHENTICATION ENDPOINTS\n');
console.log('═══════════════════════════════════════════\n');

// Test 1: Login with Designer
async function testDesignerLogin() {
  console.log('Test 1: Designer Login');
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'designer_creative',
        password: 'design2024'
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.accessToken) {
      console.log('   ✅ PASSED - Designer login successful');
      console.log(`   User: ${data.user.name} (${data.user.role})`);
      return data.accessToken;
    } else {
      console.log('   ❌ FAILED -', data.error);
      return null;
    }
  } catch (error) {
    console.log('   ❌ ERROR -', error.message);
    return null;
  }
}

// Test 2: Login with Business
async function testBusinessLogin() {
  console.log('\nTest 2: Business Login');
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'business_startup',
        password: 'startup2024'
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.accessToken) {
      console.log('   ✅ PASSED - Business login successful');
      console.log(`   User: ${data.user.name} (${data.user.role})`);
      return data.accessToken;
    } else {
      console.log('   ❌ FAILED -', data.error);
      return null;
    }
  } catch (error) {
    console.log('   ❌ ERROR -', error.message);
    return null;
  }
}

// Test 3: Login with Admin
async function testAdminLogin() {
  console.log('\nTest 3: Admin Login');
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin_master',
        password: 'admin2024'
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.accessToken) {
      console.log('   ✅ PASSED - Admin login successful');
      console.log(`   User: ${data.user.name} (${data.user.role})`);
      return data.accessToken;
    } else {
      console.log('   ❌ FAILED -', data.error);
      return null;
    }
  } catch (error) {
    console.log('   ❌ ERROR -', error.message);
    return null;
  }
}

// Test 4: Invalid credentials
async function testInvalidLogin() {
  console.log('\nTest 4: Invalid Credentials');
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'invalid_user',
        password: 'wrong_password'
      })
    });
    
    const data = await response.json();
    
    if (!response.ok && data.error) {
      console.log('   ✅ PASSED - Correctly rejected invalid credentials');
      console.log(`   Error: ${data.error}`);
    } else {
      console.log('   ❌ FAILED - Should have rejected invalid credentials');
    }
  } catch (error) {
    console.log('   ❌ ERROR -', error.message);
  }
}

// Test 5: Get current user with token
async function testGetCurrentUser(token) {
  console.log('\nTest 5: Get Current User (with token)');
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok && data.user) {
      console.log('   ✅ PASSED - Retrieved current user');
      console.log(`   User: ${data.user.name} (${data.user.username})`);
    } else {
      console.log('   ❌ FAILED -', data.error);
    }
  } catch (error) {
    console.log('   ❌ ERROR -', error.message);
  }
}

// Test 6: Get current user without token
async function testGetCurrentUserNoAuth() {
  console.log('\nTest 6: Get Current User (no token)');
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.log('   ✅ PASSED - Correctly rejected unauthenticated request');
      console.log(`   Error: ${data.error}`);
    } else {
      console.log('   ❌ FAILED - Should require authentication');
    }
  } catch (error) {
    console.log('   ❌ ERROR -', error.message);
  }
}

// Run all tests
async function runTests() {
  try {
    const designerToken = await testDesignerLogin();
    await testBusinessLogin();
    await testAdminLogin();
    await testInvalidLogin();
    
    if (designerToken) {
      await testGetCurrentUser(designerToken);
    }
    
    await testGetCurrentUserNoAuth();
    
    console.log('\n═══════════════════════════════════════════');
    console.log('\n✅ ALL TESTS COMPLETED\n');
    
  } catch (error) {
    console.log('\n❌ TEST SUITE ERROR:', error.message);
  }
}

// Wait a moment for server to be ready
setTimeout(runTests, 1000);
