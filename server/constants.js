const BUILD_DIR = '../build'; // relative to `/server`

const DB = 'db';

const routes = {
  AUTH: '/auth',
  PROFILE: '/api/profile',
  VOCAB: '/api/vocab',
};

const urlParams = {
  userId: ':userId',
};

module.exports = {
  BUILD_DIR,
  DB,
  routes,
  urlParams,
};
