/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import GameScoreboardPlayers from './GameScoreboardPlayers';
import GameScoreboardTeams from './GameScoreboardTeams';

const GameScoreboard = ({ game, editing }) => ( 
  <div className="GameScoreboard">
    { game.bteam ? (
      <GameScoreboardTeams game={game} editing={editing} />
    ) : (
      <GameScoreboardPlayers game={game} editing={editing} />
    )}
  </div>
);

GameScoreboard.propTypes = {
  game: PropTypes.object.isRequired,
  editing: PropTypes.bool,
};

export default GameScoreboard;