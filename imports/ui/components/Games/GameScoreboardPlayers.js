import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../Loading/Loading';
import PlayersCollection from '../../../api/Players/Players';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PlayerScoreData from '../Scores/PlayerScoreData';
import GameFinalize from './GameFinalize';
import { Table } from 'react-bootstrap';

import './GameScoreboardPlayers.scss';

class GameScoreboardPlayers extends React.Component {

  render() {
    const { game, loading, players, editing } = this.props; 

    return (
      !loading ? (
        <div>
          <Table condensed striped hover className="table-nonfluid">
            <thead>
              <tr>
                <th className="playerName">Player</th>
                <th className="scoreCol">Score</th>
                <th/>
                <th/>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (  
                <PlayerScoreData key={player._id} game={game} player={player} editing={editing} />
              ))} 
            </tbody>
          </Table> 
        </div>
        ) : (
        <Loading />
      )
    );
  }
}

GameScoreboardPlayers.propTypes = {
  game: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
  editing: PropTypes.bool,
};

export default createContainer(({ game, editing }) => {
  const playerSubscription = Meteor.subscribe('players.event', game.eventId);

  return {
    game: game,
    loading: !(playerSubscription.ready()),
    players: PlayersCollection.find().fetch(),
    editing: editing,
  }
}, GameScoreboardPlayers);