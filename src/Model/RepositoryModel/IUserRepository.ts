import { UserFilter, User } from "../Model";

export interface IUserRepository {

    GetList(filter: UserFilter): Array<User>;

    GetData(id: Number): User;

    SaveData(user: User): User;

    DeleteData(id: Number): Boolean;

}
