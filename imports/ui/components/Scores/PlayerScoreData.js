import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../Loading/Loading';
import ScoresCollection from '../../../api/Scores/Scores';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Button, Alert, Modal } from 'react-bootstrap';

import './PlayerScoreData.scss';

const initializePlayer = (player, game) => {
  const playerScore = {
    raw: 0,
    final: 0,
    playerId: player._id,
    playerTeamId: player.teamId,
    gameId: game._id,
    eventId: game.eventId,
  };

  Meteor.call('scores.insertplayer', playerScore, (error, scoreId) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Player added to game!', 'success');
    }
  });
}

const quitGame = (player, scoreId, gameId) => {
  Meteor.call('players.quitGame', scoreId, player._id, player.teamId, gameId, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Player quit', 'success');
    }
  });
}

const editScore = (player, playerTeamId, scoreId, gameId, newScore) => {
  Meteor.call('scores.enterScore', scoreId, playerTeamId, gameId, newScore, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Score updated!', 'success');
    }
  });
}

const incScore = (player, playerTeamId, scoreId, gameId, inc) => {
  Meteor.call('scores.incrementScore', scoreId, playerTeamId, gameId, inc, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Score updated!', 'success');
    }
  });
}

class PlayerScoreData extends React.Component {

  render() {
    const { score, player, game, editing } = this.props;

    return (
       editing ? (
        score ? (
          <tr key={player._id}>
            <td className="playerName">{player.name}</td>
            <td>{score.raw}</td>
            <td><Button bsStyle="primary" onClick={ () => editScore(player, score.playerTeamId, score._id, game._id, 0) }>Reset</Button></td>
            <td><Button bsStyle="danger"  onClick={ () => quitGame(player, score._id, game._id) }>Quit</Button></td>      
          </tr>
        ) : (
          <tr key={player._id}>
            <td className="playerName">{player.name}</td>
            <td>-</td>
            <td colSpan="2"><Button bsStyle="info" block onClick={ () => initializePlayer(player, game) }>Initialize</Button></td>
          </tr>
        )
      ) : (
        score ? (
          <tr key={player._id}>
            <td className="playerName">{player.name}</td>
            <td>{score.raw}</td>
            <td><Button bsStyle="primary" onClick={ () => incScore(player, score.playerTeamId, score._id, game._id, -1) }>-</Button></td>
            <td><Button bsStyle="primary" onClick={ () => incScore(player, score.playerTeamId, score._id, game._id, 1) }>+</Button></td>
          </tr>
        ) : (
          <tr />
        )
      )
    )
  }
}
      
PlayerScoreData.propTypes = {
  score: PropTypes.object,
  loading: PropTypes.bool,
  player: PropTypes.object,
  game: PropTypes.object,
  editing: PropTypes.bool,
};

export default createContainer(({ game, player, editing }) => {
  let scoreId;

  player.games.map((playerGame) => {
    if (playerGame.gameId === game._id) {
      scoreId = playerGame.scoreId;
    }
  });

  if (scoreId) {
    const subscription = Meteor.subscribe('scores.view', scoreId);

    return {
      score: ScoresCollection.findOne(scoreId),
      loading: !subscription.ready(),
      player: player,
      game: game,
    }  
  } else {
    return {
      found: false,
    }
  }
}, PlayerScoreData);