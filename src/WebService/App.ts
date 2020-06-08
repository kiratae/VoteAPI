import express = require('express');
import { UserService, IUserRepository, IUserService, UserFilter } from '../Model/model';
import { container } from 'tsyringe';
import { UserRepository } from '../Entity.Postgresql/Entity';

container.register<IUserRepository>("IUserRepository", {useClass: UserRepository});

container.register<IUserService>("IUserService", {useClass: UserService});

class App {
  public app: express.Application;

  constructor () {
    this.app = express();
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router();

    router.get('/', (req, res) => {
      res.json({
        message: 'Hello World!'
      })
    });

    router.get('/users', (req, res) => {
      const service = container.resolve<IUserService>("IUserService");
      let users = service.GetList(new UserFilter());
      res.json(users);
    });

    this.app.use('/', router)
  }
}

export default new App().app