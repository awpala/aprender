import React from 'react';
import { connect } from 'react-redux';
import Header from './Header/';
import routes from '../routes';
import "../sass/style.scss";

const App = ({ userId }) => (
  <div className="app">
    {userId
      ? (
        <>
          <Header/>
          {routes}
        </>
      )
      : routes
    }
  </div>
);

const mapStateToProps = (state) => ({
  userId: state.user.userId,
});

export default connect(mapStateToProps)(App);
