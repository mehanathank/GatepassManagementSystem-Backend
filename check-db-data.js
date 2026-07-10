const { query } = require('./db');

async function dbCheck() {
    try {
        const usersCount = await query('SELECT COUNT(*) FROM users');
        const passesCount = await query('SELECT COUNT(*) FROM gate_passes');
        console.log('--- DB Status ---');
        console.log('Users in DB:', usersCount.rows[0].count);
        console.log('Gate Passes in DB:', passesCount.rows[0].count);
        
        if (usersCount.rows[0].count > 0) {
            const users = await query('SELECT id, username, role FROM users');
            console.log('Users:', users.rows);
        }
        
        if (passesCount.rows[0].count > 0) {
            const passes = await query('SELECT * FROM gate_passes LIMIT 5');
            console.log('Sample Gate Passes:', passes.rows);
        } else {
            console.log('No gate passes found in DB.');
        }
    } catch (err) {
        console.error('DB Error:', err.message);
    } finally {
        process.exit();
    }
}

dbCheck();
