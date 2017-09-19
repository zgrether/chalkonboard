/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import GamesCollection from '../../../api/Games/Games';
import { createContainer } from 'meteor/react-meteor-data';
import EventScoreboardPlayers from './EventScoreboardPlayers';
import EventScoreboardTeams from './EventScoreboardTeams';

const EventScoreboard = ({ event, history, games, loading, editing }) => (
  !loading && (
  <div className="EventScoreboard">
    { event.bteam ? (
      <EventScoreboardTeams history={history} event={event} games={games} editing={editing} />
    ) : (
      <EventScoreboardPlayers history={history} event={event} games={games} editing={editing} />
    )}
  </div>
  )
);

EventScoreboard.propTypes = {
  event: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  games: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  //editing: PropTypes.bool,
};

export default createContainer(({ event, history }) => {
  const subscription = Meteor.subscribe('games.event', event._id);
   
  return{
    event: event,
    loading: !subscription.ready(),
    games: GamesCollection.find({ eventId: event._id }, { sort: { order: 1 }}).fetch(),
  };
}, EventScoreboard);