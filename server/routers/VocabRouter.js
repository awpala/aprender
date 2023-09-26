const { VocabController } = require('../controllers');
const {
  routes: { VOCAB },
  urlParams: { userId },
} = require('../constants');

/**
 * Router for entity `vocab`
 */
class VocabRouter {
  constructor(app) {
    this.app = app;

    this.configure = this.configure.bind(this);
  }

  /**
   * Configure routes for entity `vocab`
   */
  configure() {
    const { app } = this;

    const {
      getUserWord,
      updateWord,
    } = new VocabController();

    app.get(`${VOCAB}/${userId}`, getUserWord);
    app.put(`${VOCAB}/${userId}`, updateWord);
  }
}

module.exports = VocabRouter;
