import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../Loading/Loading';
import TeamsCollection from '../../../api/Teams/Teams';
import GamesCollection from '../../../api/Games/Games';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import GameData from '../Games/GameData'
import { Table } from 'react-bootstrap';

const handleClickGame = (history, gameId, editing) => {
  if (editing) {
    history.push(`/games/${gameId}/edit`);
  } else {
    history.push(`/games/${gameId}`);
  }
}

const EventScoreboardTeams = ({ event,  teams, games, history, editing }) => ( 
 
    <Table condensed striped hover className="table-nonfluid">
      <thead>
        <tr>
          <th>Game</th>
          {teams.map(({ _id, name, abbrv }) => (
            <th className="rotate" key={_id}><div><span>{abbrv}</span></div></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {games.map((game) => (
          <tr key={game._id} onClick={ () => handleClickGame(history, game._id, editing) }>
            <td>{game.title}</td>
            {teams.map((team) => (
              <GameData key={team._id} game={game} team={team} />
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td>TOTALS:</td>
          {teams.map((team) => (
            <td className="totalscore" key={team._id}>{team.events[0].total}</td>
          ))}
        </tr>
      </tfoot>
    </Table> 

  
);

EventScoreboardTeams.propTypes = {
  event: PropTypes.object.isRequired,
  //loading: PropTypes.bool.isRequired,
  teams: PropTypes.arrayOf(PropTypes.object).isRequired,
  games: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.object.isRequired,
  editing: PropTypes.bool,
};

export default createContainer(({ history, event, editing }) => {
  const subscription = Meteor.subscribe('teams.event', event._id);
  //const gameSubscription = Meteor.subscribe('games.event', event._id);
  return {
    event: event,
    loading: !subscription.ready(),
    teams: TeamsCollection.find({'events.eventId': event._id}).fetch(),
    //games: GamesCollection.find({ eventId: event._id }, { sort: { order: 1 }}).fetch(),
    editing: editing,
  }
}, EventScoreboardTeams);