import { connect } from 'react-redux';
import { logOutUser } from '../../reducers/user';
import Header from './Header';

const mapStateToProps = (state) => ({
  userId: state.user.userId,
})

const mapDispatchToProps = (dispatch) => ({
  logOutUser: () => dispatch(logOutUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
