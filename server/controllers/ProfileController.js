const {
  DB,
  httpStatusCodes: {
    OK,
  },
} = require('../constants');

const { getMappers } = require('../utilities');

/**
 * Controller for entity `profile`
 */
class ProfileController {
  constructor() {
    this.getUserProfile = this.getUserProfile.bind(this);
    this.resetUserProfile = this.resetUserProfile.bind(this);
    this.deleteUserProfile = this.deleteUserProfile.bind(this);
  }

  /**
   * Get profile for user provided via param `:userId`
   * @param {*} req Express request object
   * @param {*} res Express response object
   * @returns HTTP status code
   */
  async getUserProfile(req, res) {
    const userId = +req.params.userId;
    const { getUserProfile } = getMappers(req).profile;
    const userProfile = await getUserProfile({ userId });
    res.status(OK).send(userProfile);
  }

  /**
   * Reset profile for user provided via param `:userId`
   * @param {*} req Express request object
   * @param {*} res Express response object
   * @returns HTTP status code
   */
  async resetUserProfile(req, res) {
    const userId = +req.params.userId;
    const { resetUserProfile } = getMappers(req).profile;
    await resetUserProfile({ userId });
    res.sendStatus(OK);
  }

  /**
   * Delete profile for user provided via param `:userId`
   * @param {*} req Express request object
   * @param {*} res Express response object
   * @returns HTTP status code
   */
  async deleteUserProfile(req, res) {
    const userId = +req.params.userId;
    const { deleteUserProfile } = getMappers(req).profile;
    await deleteUserProfile({ userId });
    res.sendStatus(OK);
  }
}

module.exports = ProfileController;
