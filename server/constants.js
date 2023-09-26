const BUILD_DIR = '../build'; // relative to `/server`

const DB = 'db';

const httpStatusCodes = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
};

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
  httpStatusCodes,
  routes,
  urlParams,
};
