import React, { useEffect } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUser } from './reducers/user';
import Header from './components/Header';
import routes from './routes';
import "./sass/style.scss";

const App = ({ history, userId, getUser }) => {
  // route to landing if user logs out, otherwise stay on page if refreshed
  const getSession = async (history, getUser) => {
    const user = await axios.get('/auth/session');
  
    if (user) {
      const { username, user_id, first_name } = user.data;
      getUser(username, user_id, first_name);
    } else {
      history.push('/');
    }
  }

  useEffect(() => {
    if (!userId) getSession(history, getUser);
  // eslint-disable-next-line
  }, [userId])
  
  return (
    <div className="app">
      {userId && <Header />}
      {routes}
    </div>
  );
}

const mapStateToProps = (state) => ({
  userId: state.user.userId,
});

const mapDispatchToProps = (dispatch) => ({
  getUser: (username, userId, firstName) => dispatch(getUser(username, userId, firstName)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
