const { DB } = require('./constants');

/**
  * Helper function to extract database mappers via [MassiveJS](https://massivejs.org/)
  * @param {*} req Express request object
  * @returns database mappers
  */
const getMappers = (req) => {
  const {
    profile: {
      delete_user_profile: deleteUserProfile,
      get_user_profile: getUserProfile,
      reset_user_profile: resetUserProfile,
    },
    vocab: {
      add_new_word: addNewWord,
      check_profile: checkProfile,
      get_user_encounters: getUserEncounters,
      get_user_word_data: getUserWordData,
      get_user_word: getUserWord,
      update_word: updateWord,
    },
    users: {
      check_user: checkUser,
      register_user: registerUser,
    },
  } = req.app.get(DB);

  const db = {
    profile: {
      deleteUserProfile,
      getUserProfile,
      resetUserProfile,
    },
    vocab: {
      addNewWord,
      checkProfile,
      getUserEncounters,
      getUserWordData,
      getUserWord,
      updateWord,
    },
    users: {
      checkUser,
      registerUser,
    },
  };

  return db;
}

module.exports = {
  getMappers,
};
