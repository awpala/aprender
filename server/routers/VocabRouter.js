const { VocabController } = require('../controllers');

class VocabRouter {
  constructor() {
    this.configure = this.configure.bind(this);
  }

  configure(app) {
    const vocabController = new VocabController();
    app.get('/api/vocab/:userId', vocabController.getUserWord);
    app.put('/api/vocab/:userId', vocabController.updateWord);
  }
}

module.exports = VocabRouter;
