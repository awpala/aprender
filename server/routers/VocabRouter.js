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
    const vocabController = new VocabController();
    app.get(`${VOCAB}/${userId}`, vocabController.getUserWord);
    app.put(`${VOCAB}/${userId}`, vocabController.updateWord);
  }
}

module.exports = VocabRouter;
