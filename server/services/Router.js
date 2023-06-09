const AuthController = require('../controllers/AuthController');
const ProfileController = require('../controllers/ProfileController');
const VocabController = require('../controllers/VocabController');

class Router {
  constructor() {
    this.configureRoutes = this.configureRoutes.bind(this);
  }

  configureRoutes(app) {
    // auth endpoints
    const authController = new AuthController();
    app.post('/auth/register', authController.register);
    app.post('/auth/login', authController.login);
    app.post('/auth/guest', authController.loginGuest);
    app.get('/auth/session', authController.getSession);
    app.post('/auth/logout', authController.logout);

    // vocab endpoints
    const vocabController = new VocabController();
    app.get('/api/vocab/:userId', vocabController.getUserWord);
    app.put('/api/vocab/:userId', vocabController.updateWord);

    // profile endpoints
    const profileController = new ProfileController();
    app.get('/api/profile/:userId', profileController.getUserProfile);
    app.post('/api/profile/:userId', profileController.resetUserProfile);
    app.delete('/api/profile/:userId', profileController.deleteUserProfile);
  }
}

module.exports = Router;
