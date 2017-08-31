import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../Loading/Loading';
import PlayersCollection from '../../../api/Players/Players';
import GamesCollection from '../../../api/Games/Games';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import GameData from '../Games/GameData'
import { Table, Button } from 'react-bootstrap';

import './EventScoreboardPlayers.scss';

const handleClickGame = (history, gameId, editing) => {
  if (editing) {
    history.push(`/games/${gameId}/edit`);
  } else {
    history.push(`/games/${gameId}`);
  }
}

const EventScoreboardPlayers = ({ event, loading, players, games, history, editing }) => ( 
  !loading ? (
    <Table condensed striped hover className="table-nonfluid">
      <thead>
        <tr>
          <th>Game</th>
          {players.map(({ _id, name }) => (
            <th className="rotate" key={_id}><div><span>{name}</span></div></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {games.map((game) => (
          <tr key={game._id} onClick={ () => handleClickGame(history, game._id, editing)}>
            <td className="gameName">{game.title}</td>
            {players.map((player) => (
              <GameData key={player._id} game={game} player={player} />
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td>TOTALS:</td>
          {players.map((player) => (
            player.total ? (
              <td className="totalscore" key={player._id}>{player.total}</td>
            ) : (
              <td className="totalscore" key={player._id}>-</td>
            )
          ))}
        </tr>
      </tfoot>
    </Table> 
    ) : (
    <Loading />
  )
);

EventScoreboardPlayers.propTypes = {
  event: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
  games: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.object.isRequired,
  editing: PropTypes.bool,
};

export default createContainer(({ history, event, editing }) => {
  const playerSubscription = Meteor.subscribe('players.event', event._id);
  const gameSubscription = Meteor.subscribe('games.event', event._id);
  return {
    event: event,
    loading: !(playerSubscription.ready() && gameSubscription.ready()),
    players: PlayersCollection.find({ events: {$in: [event._id] } }).fetch(),
    games: GamesCollection.find({ eventId: event._id }, { sort: { order: 1 }}).fetch(),
    editing: editing,
  }
}, EventScoreboardPlayers); 