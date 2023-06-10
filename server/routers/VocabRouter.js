const { VocabController } = require('../controllers');
const {
  routes: { VOCAB },
  urlParams: { userId },
} = require('../constants');

class VocabRouter {
  constructor(app) {
    this.app = app;

    this.configure = this.configure.bind(this);
  }

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
