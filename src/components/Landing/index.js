import { connect } from 'react-redux';
import { registerUser, getUser } from '../../reducers/user';
import Landing from './Landing';

const mapDispatchToProps = (dispatch) => ({
  registerUser: (firstName, lastName, username, password) => dispatch(registerUser(firstName, lastName, username, password)),
  getUser: (username, userId, firstName, lastName) => dispatch(getUser(username, userId, firstName, lastName)),
});

export default connect(null, mapDispatchToProps)(Landing);