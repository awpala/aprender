const { AuthController } = require('../controllers');

class AuthRouter {
  constructor() {
    this.configure = this.configure.bind(this);
  }

  configure(app) {
    const authController = new AuthController();
    app.post('/auth/register', authController.register);
    app.post('/auth/login', authController.login);
    app.post('/auth/guest', authController.loginGuest);
    app.get('/auth/session', authController.getSession);
    app.post('/auth/logout', authController.logout);
  }
}

module.exports = AuthRouter;
