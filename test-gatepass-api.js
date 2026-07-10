const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testApi() {
    try {
        const response = await fetch('http://localhost:5000/api/gatepass');
        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Data Length:', data.length);
        if (data.length > 0) {
            console.log('First Item:', JSON.stringify(data[0], null, 2));
        } else {
            console.log('Empty response array');
        }
    } catch (err) {
        console.error('Fetch error:', err.message);
    }
}

testApi();
