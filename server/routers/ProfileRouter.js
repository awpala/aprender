const { ProfileController } = require('../controllers');

class ProfileRouter {
  constructor() {
    this.configure = this.configure.bind(this);
  }

  configure(app) {
    const profileController = new ProfileController();
    app.get('/api/profile/:userId', profileController.getUserProfile);
    app.post('/api/profile/:userId', profileController.resetUserProfile);
    app.delete('/api/profile/:userId', profileController.deleteUserProfile);
  }
}

module.exports = ProfileRouter
