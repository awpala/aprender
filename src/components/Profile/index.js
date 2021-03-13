import { connect } from 'react-redux';
import { logOutUser } from '../../reducers/user';
import Profile from './Profile';

const mapStateToProps = (state) => ({
  userId: state.user.userId,
  firstName: state.user.firstName,
  username: state.user.username,
});

const mapDispatchToProps = (dispatch) => ({
  logOutUser: () => dispatch(logOutUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
