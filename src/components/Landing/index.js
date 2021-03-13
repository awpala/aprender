import { connect } from 'react-redux';
import { getUser } from '../../reducers/user';
import Landing from './Landing';

const mapDispatchToProps = (dispatch) => ({
  getUser: (username, userId, firstName, lastName) => dispatch(getUser(username, userId, firstName, lastName)),
});

export default connect(null, mapDispatchToProps)(Landing);
