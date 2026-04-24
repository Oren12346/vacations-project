// Data access helper used to run SQL queries through the shared MySQL pool.
import mysql from "mysql2/promise";
import appConfig from "./app-config";

// Create one shared MySQL connection pool for the whole backend.
const pool = mysql.createPool({
    host: appConfig.dbHost,
    port: appConfig.dbPort,
    user: appConfig.dbUser,
    password: appConfig.dbPassword,
    database: appConfig.dbName,
    connectionLimit: 10
});

type QueryParams = Array<string | number | boolean | Date | null>;

// Execute a SQL query with optional parameters and return the result.
async function execute(sql: string, params: QueryParams = []): Promise<unknown> {
    const [result] = await pool.execute(sql, params);
    return result;
}

export default {
    execute
};