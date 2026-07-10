const { query } = require('./db');

const init = async () => {
    try {
        await query(`
            -- Enums
            DO $$ BEGIN
                CREATE TYPE user_role AS ENUM ('student', 'teacher', 'watchman', 'admin');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;

            DO $$ BEGIN
                CREATE TYPE pass_status AS ENUM ('Pending', 'Approved', 'Rejected', 'Used');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;

            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(100) NOT NULL,
                role user_role NOT NULL,
                roll_number VARCHAR(50) UNIQUE,
                department VARCHAR(100),
                year VARCHAR(20),
                email VARCHAR(100) UNIQUE
            );

            CREATE TABLE IF NOT EXISTS gate_passes (
                id SERIAL PRIMARY KEY,
                student_id INTEGER REFERENCES users(id),
                reason TEXT NOT NULL,
                out_time TIME NOT NULL,
                status pass_status DEFAULT 'Pending',
                approved_by INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS visitor_passes (
                id SERIAL PRIMARY KEY,
                visitor_name VARCHAR(100) NOT NULL,
                phone_number VARCHAR(20) NOT NULL,
                purpose TEXT NOT NULL,
                date DATE NOT NULL,
                in_time TIME NOT NULL,
                out_time TIME NOT NULL,
                status pass_status DEFAULT 'Pending',
                approved_by INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Tables created successfully.");

        // Insert initial data if users table is empty
        const res = await query('SELECT COUNT(*) FROM users');
        if (parseInt(res.rows[0].count) === 0) {
            await query(`
                INSERT INTO users (username, password, name, role, roll_number, department, year) 
                VALUES ('arun', 'arun123', 'Arun Kumar', 'student', 'CSE101', 'Computer Science', '2nd Year');
                
                INSERT INTO users (username, password, name, role, roll_number, department, year) 
                VALUES ('priya', 'priya123', 'Priya Sharma', 'student', 'ECE205', 'Electronics', '3rd Year');
                
                INSERT INTO users (username, password, name, role, email, department) 
                VALUES ('rajesh', 'rajesh123', 'Mr. Rajesh', 'teacher', 'rajesh@college.com', 'Computer Science');
                
                INSERT INTO users (username, password, name, role) 
                VALUES ('security', 'security123', 'Security Kumar', 'watchman');
                
                INSERT INTO users (username, password, name, role) 
                VALUES ('admin', 'admin123', 'System Admin', 'admin');
            `);
            console.log("Initial test data inserted successfully.");
        }
    } catch (err) {
        console.error("Error formatting database:", err);
    } finally {
        process.exit();
    }
}
init();
