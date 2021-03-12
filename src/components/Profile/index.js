import { connect } from 'react-redux';
import Profile from './Profile';

const mapStateToProps = (state) => ({
  userId: state.user.userId,
  firstName: state.user.firstName,
});

export default connect(mapStateToProps)(Profile);
