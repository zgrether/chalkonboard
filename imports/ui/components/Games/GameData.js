import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../Loading/Loading';
import ScoreCollection from '../../../api/Scores/Scores';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

const textStyle = { verticalAlign: 'middle', textAlign: 'center' };

const GameData = ({ score, found }) =>  (
  found && score ? (
  <td style={textStyle}>{score.final}</td>
 ) : ( <td style={textStyle}>-</td> )
);

GameData.propTypes = {
  score: PropTypes.object,
  found: PropTypes.bool.isRequired,
};

export default createContainer(({ game, player, team }) => {
  let scoreId;

  if (game.bteam) {
    team.games.map((teamGame) => {
      if (teamGame.gameId === game._id) {
        scoreId = teamGame.scoreId;
      }
    });  
  } else {
    player.games.map((playerGame) => {
      if (playerGame.gameId === game._id) {
        scoreId = playerGame.scoreId;
      }
    });
  }

  if (scoreId) {
    const subscription = Meteor.subscribe('scores.view', scoreId);

    return {
      score: ScoreCollection.findOne(scoreId),
      found: subscription.ready(),
    }  
  } else {
    return {
      found: false,
    }
  }
}, GameData);