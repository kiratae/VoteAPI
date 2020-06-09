import { UserFilter, User, IUserService } from "../Model";
import { LoggerFactory, Logger } from "../../Library/Library";
import { BaseService } from "./BaseService";
import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../RepositoryModel/IUserRepository";

@injectable()
export class UserService extends BaseService implements IUserService {

    private static readonly _logger: Logger = LoggerFactory.GetLogger(typeof (UserService));
    private _repository: IUserRepository;

    constructor(@inject("IUserRepository") private repository: IUserRepository) {
        super();
        this._repository = repository;
    }

    GetList(filter: UserFilter): Array<User> {
        const func = "GetList";
        try {
            return this._repository.GetList(filter);
        } catch (ex) {
            UserService._logger.Info(`${func}: Exception caught.`, ex);
            throw ex;
        }
    }

    GetData(id: Number): User {
        return new User();
    }

    SaveData(user: User): User {
        return new User();
    }

    DeleteData(id: Number): Boolean {
        return false;
    }

}