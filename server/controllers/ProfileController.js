const {
  DB,
  httpStatusCodes: {
    OK,
  },
} = require('../constants');

/**
 * Controller for entity `profile`
 */
class ProfileController {
  constructor() {
    // auxiliary function
    this.getProfileData = this.getProfileData.bind(this);

    // controller functions
    this.getUserProfile = this.getUserProfile.bind(this);
    this.resetUserProfile = this.resetUserProfile.bind(this);
    this.deleteUserProfile = this.deleteUserProfile.bind(this);
  }

  /**
   * Helper function to extract database mappers for entity `profile`
   * @param {*} req Express request object
   * @returns Database mappers for entity `profile`
   */
  getProfileData(req) {
    const {
      delete_user_profile: deleteUserProfile,
      get_user_profile: getUserProfile,
      reset_user_profile: resetUserProfile,
    } = req.app.get(DB).profile; 

    const db = {
      deleteUserProfile,
      getUserProfile,
      resetUserProfile,
    };

    return db;
  }

  /**
   * Get profile for user provided via param `:userId`
   * @param {*} req Express request object
   * @param {*} res Express response object
   * @returns HTTP status code
   */
  async getUserProfile(req, res) {
    const userId = +req.params.userId;
    const { getUserProfile } = this.getProfileData(req);
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
    const { resetUserProfile } = this.getProfileData(req);
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
    const { deleteUserProfile } = this.getProfileData(req);
    await deleteUserProfile({ userId });
    res.sendStatus(OK);
  }
}

module.exports = ProfileController;
