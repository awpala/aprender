import { connect } from 'react-redux';
import Vocab from './Vocab';

const mapStateToProps = (state) => ({
  userId: state.user.userId,
});

export default connect(mapStateToProps)(Vocab);
