const initialState = {
  username: '',
  firstName: '',
  userId: null,
}

export const REGISTER_USER = 'REGISTER_USER';
export const GET_USER = 'GET_USER';
export const LOG_OUT_USER = 'LOGOUT_USER';

export const registerUser = (firstName, lastName, username, password) => ({
  type: REGISTER_USER,
  payload: {
    firstName,
    lastName,
    username,
    password,
  },
});

export const getUser = (username, userId, firstName, lastName) => ({
  type: GET_USER,
  payload: {
    username,
    userId,
    firstName,
    lastName,
  },
});

export const logOutUser = () => ({
  type: LOG_OUT_USER,
  payload: {
    ...initialState,
  },
});

export default function userReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_USER:
    case GET_USER:
    case LOG_OUT_USER:
      return { ...state, ...payload };
    default:
      return { ...state };
  }
}
