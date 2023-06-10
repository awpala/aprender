const { AuthController } = require('../controllers');
const {
  routes: { AUTH },
} = require('../constants');

class AuthRouter {
  constructor() {
    this.configure = this.configure.bind(this);
  }

  configure(app) {
    const authController = new AuthController();
    app.post(`${AUTH}/register`, authController.register);
    app.post(`${AUTH}/login`, authController.login);
    app.post(`${AUTH}/guest`, authController.loginGuest);
    app.get(`${AUTH}/session`, authController.getSession);
    app.post(`${AUTH}/logout`, authController.logout);
  }
}

module.exports = AuthRouter;
