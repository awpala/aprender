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

const httpStatusCodes = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
};

module.exports = {
  BUILD_DIR,
  DB,
  routes,
  urlParams,
  httpStatusCodes,
};
