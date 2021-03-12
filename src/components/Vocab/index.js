import { connect } from 'react-redux';
import { getUser } from '../../reducers/user';
import Vocab from './Vocab';

const mapStateToProps = (state) => ({
  userId: state.user.userId,
});

const mapDispatchToProps = (dispatch) => ({
  getUser: (username, userId, firstName) => dispatch(getUser(username, userId, firstName)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Vocab);
