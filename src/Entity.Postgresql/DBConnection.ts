
import { PostgreSqlConnectionString } from '../Config';

import { Pool } from 'pg';

export class DBConnection {

    private static instance: DBConnection;
    private connection: Pool;
    get getConnection(): Pool {
        return this.connection;
    }

    private constructor(){
        this.connection = new Pool({
            connectionString: process.env.DATABASE_URL || PostgreSqlConnectionString,
            ssl: {
                rejectUnauthorized: false
            }
        });
    }

    static getInstance(): DBConnection {
        if (!DBConnection.instance) {
            DBConnection.instance = new DBConnection();
        }
    
        return DBConnection.instance;
      }

}