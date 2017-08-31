import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Grid } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import Navigation from '../../components/Navigation/Navigation';
import Authenticated from '../../components/Authenticated/Authenticated';
import Public from '../../components/Public/Public';
import Index from '../../pages/Index/Index';
import Events from '../../pages/Events/Events';
import ViewEvent from '../../pages/Events/ViewEvent';
import EditEvent from '../../pages/Events/EditEvent';
import ScoreEvent from '../../pages/Events/ScoreEvent';
import Games from '../../pages/Games/Games';
import ViewGame from '../../pages/Games/ViewGame';
import EditGame from '../../pages/Games/EditGame';
import Scores from '../../pages/Scores/Scores';
import Players from '../../pages/Players/Players';
import ViewPlayer from '../../pages/Players/ViewPlayer';
import Venues from '../../pages/Venues/Venues';
import ViewVenue from '../../pages/Venues/ViewVenue';
import Signup from '../../pages/Signup/Signup';
import Login from '../../pages/Login/Login';
import Logout from '../../pages/Logout/Logout';
import RecoverPassword from '../../pages/RecoverPassword/RecoverPassword';
import ResetPassword from '../../pages/ResetPassword/ResetPassword';
import Profile from '../../pages/Profile/Profile';
import NotFound from '../../pages/NotFound/NotFound';
import Footer from '../../components/Footer/Footer';

import './App.scss';

const App = props => (
  <Router>
    {!props.loading ? <div className="App">
      <Navigation {...props} />
      <Grid>
        <Switch>
          <Route exact name="index" path="/" component={Index} />
          <Authenticated exact path="/events" component={Events} {...props} />
          <Authenticated exact path="/events/:_id" component={ViewEvent} {...props} />
          <Authenticated exact path="/events/:_id/edit" component={EditEvent} {...props} />
          <Authenticated exact path="/players" component={Players} {...props} />
          <Authenticated exact path="/players/:_id" component={ViewPlayer} {...props} />
          <Authenticated exact path="/venues" component={Venues} {...props} />
          <Authenticated exact path="/venues/:_id" component={ViewVenue} {...props} />
          <Authenticated exact path="/games" component={Games} {...props} />
          <Authenticated exact path="/games/:_id" component={ViewGame} {...props} />
          <Authenticated exact path="/games/:_id/edit" component={EditGame} {...props} />
          <Authenticated exact path="/scores/:shareId" component={ScoreEvent} {...props} />
          <Authenticated exact path="/profile" component={Profile} {...props} />
          <Authenticated exact path="/scores" component={Scores} {...props} />
          <Public path="/signup" component={Signup} {...props} />
          <Public path="/login" component={Login} {...props} />
          <Public path="/logout" component={Logout} {...props} />
          <Route name="recover-password" path="/recover-password" component={RecoverPassword} />
          <Route name="reset-password" path="/reset-password/:token" component={ResetPassword} />
          <Route component={NotFound} />
        </Switch>
      </Grid>
      <Footer />
    </div> : ''}
  </Router>
);

App.propTypes = {
  loading: PropTypes.bool.isRequired,
};

const getUserName = name => ({
  string: name,
  object: `${name.first} ${name.last}`,
}[typeof name]);

export default createContainer(() => {
  const loggingIn = Meteor.loggingIn();
  const user = Meteor.user();
  const userId = Meteor.userId();
  const loading = !Roles.subscription.ready();
  const name = user && user.profile && user.profile.name && getUserName(user.profile.name);
  const emailAddress = user && user.emails && user.emails[0].address;

  return {
    loading,
    loggingIn,
    authenticated: !loggingIn && !!userId,
    name: name || emailAddress,
    roles: !loading && Roles.getRolesForUser(userId),
  };
}, App);
