const { VocabRouter } = require('.')
const {
  routes: { VOCAB },
  urlParams: { userId },
} = require('../constants');

const mockApp = {
  get: jest.fn(),
  put: jest.fn(),
};

describe('VocabRouter', () => {
  let vocabRouter;

  beforeEach(() => {
    vocabRouter = new VocabRouter(mockApp);
  });

  it('should configure routes', async () => {
    // Act
    vocabRouter.configure(mockApp);

    // Assert
    expect(mockApp.get).toHaveBeenCalledTimes(1);
    expect(mockApp.get).toHaveBeenCalledWith(`${VOCAB}/${userId}`, expect.any(Function));

    expect(mockApp.put).toHaveBeenCalledTimes(1);
    expect(mockApp.put).toHaveBeenCalledWith(`${VOCAB}/${userId}`, expect.any(Function));

    // Restore the original methods
    jest.restoreAllMocks();
  });
});
