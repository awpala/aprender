const { VocabController } = require('../controllers');
const {
  routes: { VOCAB },
  urlParams: { userId },
} = require('../constants');

class VocabRouter {
  constructor() {
    this.configure = this.configure.bind(this);
  }

  configure(app) {
    const {
      getUserWord,
      updateWord,
    } = new VocabController();

    app.get(`${VOCAB}/${userId}`, getUserWord);
    app.put(`${VOCAB}/${userId}`, updateWord);
  }
}

module.exports = VocabRouter;
