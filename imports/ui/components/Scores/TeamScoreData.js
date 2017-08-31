import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../Loading/Loading';
import ScoresCollection from '../../../api/Scores/Scores';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Button, Alert } from 'react-bootstrap';

const initializeTeam = (team, game) => {
  const teamScore = {
    raw: 0,
    final: 0,
    teamId: team._id,
    gameId: game._id,
    eventId: game.eventId,
  };

  Meteor.call('scores.insertteam', teamScore, (error, scoreId) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Team added to game!', 'success');
    }
  });
}

const quitGame = (teamId, scoreId, gameId) => {
  Meteor.call('teams.quitGame',  scoreId, teamId, gameId, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Team quit', 'success');
    }
  });
}

const editScore = (scoreId, gameId, newScore) => {
  Meteor.call('scores.enterScore', scoreId, null, gameId, newScore, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Score updated!', 'success');
    }
  });
}

const incScore = (scoreId, gameId, inc) => {
  Meteor.call('scores.incrementScore', scoreId, null, gameId, inc, (error) => {
    if (error) {
      Bert.alert(error.response, 'danger');
    } else {
      Bert.alert('Score incremented!', 'success');
    }
  });
}

class TeamScoreData extends React.Component {

  render() {
    const { score, team, game, editing } = this.props;

    return (
        editing ? (
          score ? (
            <tr key={team._id}>
              <td>{team.name}</td>
              <td className="scoreCol">{score.raw}</td>
              <td><Button bsStyle="primary" onClick={ () => editScore(score._id, game._id, 0) }>Reset</Button></td>
              <td><Button bsStyle="danger"  onClick={ () => quitGame(team._id, score._id, game._id) }>Quit</Button></td>      
            </tr>
          ) : (
            <tr key={team._id}>
              <td>{team.name}</td>
              <td className="scoreCol">-</td>
              <td colSpan="2"><Button bsStyle="info" block onClick={ () => initializeTeam(team, game) }>Initialize</Button></td>
            </tr>
          )
        ) : (
          score ? (
            <tr key={team._id}>
              <td>{team.name}</td>
              <td className="scoreCol">{score.raw}</td>
              <td><Button bsStyle="primary" onClick={ () => incScore(score._id, game._id, -1) }>-</Button></td>
              <td><Button bsStyle="primary" onClick={ () => incScore(score._id, game._id, 1) }>+</Button></td>
            </tr>
          ) : (
            <tr />
          )
        )
      )
    
  }
}

TeamScoreData.propTypes = {
  score: PropTypes.object,
  loading: PropTypes.bool,
  team: PropTypes.object,
  game: PropTypes.object,
  editing: PropTypes.bool,
};

export default createContainer(({ game, team, editing }) => {
  let scoreId;

  team.games.map((teamGame) => {
    if (teamGame.gameId === game._id) {
      scoreId = teamGame.scoreId;
    }
  });

  if (scoreId) {
    const subscription = Meteor.subscribe('scores.view', scoreId);

    return {
      score: ScoresCollection.findOne(scoreId),
      loading: !subscription.ready(),
      team: team,
      game: game,
    }  
  } else {
    return {
      found: false,
    }
  }
}, TeamScoreData);