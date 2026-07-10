const fetch = require('node-fetch');

async function testRegister() {
    try {
        const response = await fetch('http://localhost:5000/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'testteacher' + Date.now(),
                password: 'password123',
                name: 'Test Teacher',
                role: 'teacher',
                email: 'test@example.com'
            })
        });
        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Data:', data);
    } catch (err) {
        console.error('Fetch error:', err.message);
    }
}

testRegister();
