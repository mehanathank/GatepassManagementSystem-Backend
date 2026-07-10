const http = require('http');

function testEndpoint(path) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                console.log(`Endpoint: ${path}`);
                console.log(`Status: ${res.statusCode}`);
                console.log(`Data: ${data}`);
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error(`Error at ${path}: ${e.message}`);
            resolve();
        });

        req.end();
    });
}

async function runTests() {
    await testEndpoint('/api/gatepass');
    await testEndpoint('/api/visitor');
    process.exit();
}

runTests();
