const { AuthController } = require('../controllers');

class AuthRouter {
  constructor() {
    this.configure = this.configure.bind(this);
  }

  configure(app) {
    const authController = new AuthController();
    app.post('/register', authController.register);
    app.post('/login', authController.login);
    app.post('/guest', authController.loginGuest);
    app.get('/session', authController.getSession);
    app.post('/logout', authController.logout);
  }
}

module.exports = AuthRouter;
