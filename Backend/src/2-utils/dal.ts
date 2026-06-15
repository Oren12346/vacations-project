// Data access helper used to run SQL queries through the shared MySQL pool.
import mysql from "mysql2/promise";
import appConfig from "./app-config";

type QueryParams = Array<string | number | boolean | Date | null>;

class Dal {

    // Create one shared MySQL connection pool for the whole backend.
    private readonly pool = mysql.createPool({
        host: appConfig.dbHost,
        port: appConfig.dbPort,
        user: appConfig.dbUser,
        password: appConfig.dbPassword,
        database: appConfig.dbName,
        connectionLimit: 10
    });

    // Execute a SQL query with optional parameters and return the result.
    public async execute(sql: string, params: QueryParams = []): Promise<unknown> {
        const [result] = await this.pool.execute(sql, params);
        return result;
    }
}

const dal = new Dal();

export default dal;
