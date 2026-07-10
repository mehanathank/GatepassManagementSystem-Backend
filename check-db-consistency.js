const { query } = require('./db');

async function dbCheck() {
    try {
        const gData = await query('SELECT * FROM gate_passes');
        console.log('GATE_PASSES:', JSON.stringify(gData.rows, null, 2));
        
        const uIds = gData.rows.map(r => r.student_id);
        if (uIds.length > 0) {
            const uData = await query('SELECT id, name, role FROM users WHERE id = ANY($1)', [uIds]);
            console.log('MATCHING_USERS:', JSON.stringify(uData.rows, null, 2));
        }
    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        process.exit();
    }
}

dbCheck();
