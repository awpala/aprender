const {
  AuthRouter,
  VocabRouter,
  ProfileRouter,
} = require('../routers');

class Router {
  constructor() {
    this.configure = this.configure.bind(this);
  }

  configure(app) {
    const authRouter = new AuthRouter();
    const vocabRouter = new VocabRouter();
    const profileRouter = new ProfileRouter();

    authRouter.configure(app);
    vocabRouter.configure(app);
    profileRouter.configure(app);
  }
}

module.exports = Router;
