import { BaseRepository } from "./BaseRepository";
import { IUserRepository, UserFilter, User } from "../../Model/Model";
import { Logger, LoggerFactory } from "../../Library/Library";
import { Pool, Client } from "pg";
import { EntityConfigSection } from "../EntityConfigSection";

export class UserRepository extends BaseRepository implements IUserRepository {

    private readonly _logger: Logger = LoggerFactory.GetLogger(typeof (UserRepository));

    constructor() {
        super();
    }

    GetList(filter: UserFilter): Array<User> {
        const func = "GetList";
        try {
            const sqlSelect: string = "SELECT * FROM vt_users;";

            const client = new Client({
                connectionString: EntityConfigSection.ConnectionString,
                // ssl: { rejectUnauthorized: false }
            });
            client.connect();

            client.query(sqlSelect, (err, res) => {
                console.log(res);
                // Object.assign(e, {});
                client.end();
            });

            return new Array<User>();
        } catch (ex) {
            this._logger.Info(`${func}: Exception caught.`, ex);
            throw ex;
        }
    }

    GetData(id: Number): User {
        throw new Error("Method not implemented.");
    }
    SaveData(user: User): User {
        throw new Error("Method not implemented.");
    }
    DeleteData(id: Number): Boolean {
        throw new Error("Method not implemented.");
    }

}
