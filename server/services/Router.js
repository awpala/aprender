const {
  AuthRouter,
  VocabRouter,
  ProfileRouter,
} = require('../routers');

/**
 * `Router` service
 */
class Router {
  constructor(app) {
    this.app = app;

    this.configure = this.configure.bind(this);
  }

  /**
   * Configure routers for all routes
   */
  configure() {
    const { app } = this;

    const authRouter = new AuthRouter(app);
    const vocabRouter = new VocabRouter(app);
    const profileRouter = new ProfileRouter(app);

    authRouter.configure();
    vocabRouter.configure();
    profileRouter.configure();
  }
}

module.exports = Router;
