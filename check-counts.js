const { query } = require('./db');

async function dbCheck() {
    try {
        const u = await query('SELECT COUNT(*) FROM users');
        const g = await query('SELECT COUNT(*) FROM gate_passes');
        const v = await query('SELECT COUNT(*) FROM visitor_passes');
        
        console.log('--- COUNTS ---');
        console.log(`USERS: ${u.rows[0].count}`);
        console.log(`GATE_PASSES: ${g.rows[0].count}`);
        console.log(`VISITOR_PASSES: ${v.rows[0].count}`);
        console.log('--------------');
    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        process.exit();
    }
}

dbCheck();
