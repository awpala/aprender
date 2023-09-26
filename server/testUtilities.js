const { DB } = require('./constants');

const mockDB = {
  profile: {
    delete_user_profile: jest.fn(),
    get_user_profile: jest.fn(),
    reset_user_profile: jest.fn(),
  },
  vocab: {
    add_new_word: jest.fn(),
    check_profile: jest.fn(),
    get_user_encounters: jest.fn(),
    get_user_word_data: jest.fn(),
    get_user_word: jest.fn(),
    update_word: jest.fn(),
  },
  users: {
    check_user: jest.fn(),
    register_user: jest.fn(),
  },
};

/**
 * Mock Express's `req` object for the request
 * @returns mocked Express `req` object
 */
const getMockReq = () => ({
  app: {
    get: (key) => {
      switch (key) {
        case (DB): return mockDB;
        default: return {};
      }
    },
  },
  params: {},
  body: {},
  session: {
    destroy: jest.fn(),
  },
});

/**
 * Mock Express's `res` object for the response
 * @returns mocked Express `res` object
 */
const getMockRes = () => ({
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  sendStatus: jest.fn().mockReturnThis(),
})

module.exports = {
  mockDB,
  getMockReq,
  getMockRes,
};
