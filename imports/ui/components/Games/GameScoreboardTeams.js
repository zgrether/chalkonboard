import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../Loading/Loading';
import TeamsCollection from '../../../api/Teams/Teams';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import TeamScoreData from '../Scores/TeamScoreData';
import TeamPlayerScoreData from '../Scores/TeamPlayerScoreData';
import { Table } from 'react-bootstrap';

import './GameScoreboardTeams.scss';

class GameScoreboardTeams extends React.Component {

  render() {
    const { game, loading, teams, editing } = this.props; 

    return (
      !loading ? (
        <div>         
          {game.sumpoints ? (
            teams.map((team) => (
              <TeamPlayerScoreData key={team._id} game={game} team={team} editing={editing}/>
            ))
          ) : ( 
            <Table condensed striped hover className="table-nonfluid">
              <thead>
                <tr>
                  <th className="teamName">Team</th>
                  <th className="scoreCol">Score</th>
                  <th/>
                  <th/>
                  {!editing && (
                    <th/>
                  )}
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (  
                  <TeamScoreData key={team._id} game={game} team={team} editing={editing}/>
                ))} 
              </tbody>
            </Table>
          )}
        </div>
        ) : (
        <Loading />
      )
    );
  }
}

GameScoreboardTeams.propTypes = {
  game: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  teams: PropTypes.arrayOf(PropTypes.object).isRequired,
  editing: PropTypes.bool,
};

export default createContainer(({ game, editing }) => {
  const teamSubscription = Meteor.subscribe('teams.event', game.eventId);
  return {
    game: game,
    loading: !(teamSubscription.ready()),
    teams: TeamsCollection.find().fetch(),
    editing: editing,
  }
}, GameScoreboardTeams);