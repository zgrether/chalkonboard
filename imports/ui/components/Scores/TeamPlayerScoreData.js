import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../Loading/Loading';
import PlayersCollection from '../../../api/Players/Players';
import ScoresCollection from '../../../api/Scores/Scores';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Table, Button } from 'react-bootstrap';
import PlayerScoreData from './PlayerScoreData';
import TeamScoreTotal from './TeamScoreTotal';

import './TeamPlayerScoreData.scss';

class TeamPlayerScoreData extends React.Component {

  render() {
    const { game, loading, team, players, editing } = this.props;

    return (
      !loading ? (
        <Table condensed striped hover className="table-nonfluid">
          <thead>
            <tr>
              <th className="teamName">{team.name}</th>
              <th className="scoreCol">Score</th>
              <th/>
              <th/>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <PlayerScoreData key={player._id} game={game} player={player} team={team} editing={editing} />
            ))}              
          </tbody>
          <tfoot>
            <TeamScoreTotal game={game} team={team} />
          </tfoot>
          
        </Table>
      ) : (
        <Loading />
      )
    );
  }
}

TeamPlayerScoreData.propTypes = {
  game: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  team: PropTypes.object,
  players: PropTypes.arrayOf(PropTypes.object),
  editing: PropTypes.bool,
};

export default createContainer(({ game, team, editing}) => {
  const subscription = Meteor.subscribe('players.event', game.eventId);

  return {
    game: game,
    loading: !(subscription.ready()),
    team: team,
    players: PlayersCollection.find({ 'events.teamId': team._id }).fetch(),
    editing: editing,
  }
}, TeamPlayerScoreData);