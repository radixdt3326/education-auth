import dotenv from 'dotenv';
import { Pool } from 'pg';  // Directly import Pool from 'pg'

dotenv.config();

// Define types for environment variables (optional but good for type safety)
interface EnvConfig {
    DB_USER: string;
    DB_HOST: string;
    DB_DATABASE: string;
    DB_PASSWORD: string;
    DB_PORT: string;
}

// Cast `process.env` to your custom interface to ensure strong typing
const envConfig = process.env as unknown as EnvConfig;


// Database connection configuration
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5433", 10),
});

// Verify the connection
(async () => {
    try {
        const client = await pool.connect();
        console.log('Connected to PostgreSQL successfully!');
        client.release(); // Release the connection back to the pool
    } catch (err) {
        console.error('Unable to connect to PostgreSQL:', (err as Error).message);
    }
})();

// Export pool for use in other modules
export default pool;
