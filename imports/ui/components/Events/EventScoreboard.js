/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import EventScoreboardPlayers from './EventScoreboardPlayers';
import EventScoreboardTeams from './EventScoreboardTeams';

const EventScoreboard = ({ event, history, editing }) => (
  <div className="EventScoreboard">
    { event.bteam ? (
      <EventScoreboardTeams history={history} event={event} editing={editing} />
    ) : (
      <EventScoreboardPlayers history={history} event={event} editing={editing} />
    )}
  </div>
);

EventScoreboard.propTypes = {
  event: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  editing: PropTypes.bool,
};

export default EventScoreboard;