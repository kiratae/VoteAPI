import { PostgreSqlConnectionString } from '../Config';

export class EntityConfigSection {

    public static readonly ConnectionString: string = process.env.DATABASE_URL || PostgreSqlConnectionString;
    
}
