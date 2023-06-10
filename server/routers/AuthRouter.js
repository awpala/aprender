const { AuthController } = require('../controllers');
const {
  routes: { AUTH },
} = require('../constants');

class AuthRouter {
  constructor(app) {
    this.app = app;

    this.configure = this.configure.bind(this);
  }

  configure() {
    const { app } = this;

    const {
      register,
      login,
      loginGuest,
      getSession,
      logout,
    } = new AuthController();

    app.post(`${AUTH}/register`, register);
    app.post(`${AUTH}/login`, login);
    app.post(`${AUTH}/guest`, loginGuest);
    app.get(`${AUTH}/session`, getSession);
    app.post(`${AUTH}/logout`, logout);
  }
}

module.exports = AuthRouter;
