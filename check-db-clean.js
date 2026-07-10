const { query } = require('./db');

async function dbCheck() {
    try {
        const u = await query('SELECT COUNT(*) FROM users');
        const g = await query('SELECT COUNT(*) FROM gate_passes');
        const v = await query('SELECT COUNT(*) FROM visitor_passes');
        
        console.log(`USERS_COUNT: ${u.rows[0].count}`);
        console.log(`GATE_PASSES_COUNT: ${g.rows[0].count}`);
        console.log(`VISITOR_PASSES_COUNT: ${v.rows[0].count}`);
        
        const gData = await query('SELECT id, student_id, status FROM gate_passes');
        console.log('GATE_PASSES:', JSON.stringify(gData.rows));
        
        const uData = await query('SELECT id, username, role FROM users');
        console.log('USERS:', JSON.stringify(uData.rows));
    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        process.exit();
    }
}

dbCheck();
