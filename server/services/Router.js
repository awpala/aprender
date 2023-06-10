const {
  AuthRouter,
  VocabRouter,
  ProfileRouter,
} = require('../routers');

class Router {
  constructor(app) {
    this.app = app;

    this.configure = this.configure.bind(this);
  }

  configure() {
    const { app } = this;

    const authRouter = new AuthRouter();
    const vocabRouter = new VocabRouter();
    const profileRouter = new ProfileRouter();

    authRouter.configure(app);
    vocabRouter.configure(app);
    profileRouter.configure(app);
  }
}

module.exports = Router;
