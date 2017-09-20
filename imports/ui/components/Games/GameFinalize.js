/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { createContainer } from 'meteor/react-meteor-data';
import ScoresCollection from '../../../api/Scores/Scores';
import PointsCollection from '../../../api/Points/Points';
import Loading from '../Loading/Loading';

const gameSetFinalScores = (game, scores, points, history) => {
  Meteor.call('scores.awardFinals', game, scores, points, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      if (points) {
        Bert.alert('Game Final!', 'success');
      } else {
        Bert.alert('Game Reset!', 'success');
      }
      history.push(`/events/${game.eventId}`);
    }
  });
}

const GameFinalize = ({scores, points, game, history}) => (
  <div style={{"textAlign":"center"}}>
    
    <h5>Award Final Scores (ties get averaged)</h5>

    {points.length > 0 ? (
      <Button type="button" bsStyle="success" onClick={() => gameSetFinalScores(game, scores, points, history)}>
        | {points.map((point) => (<span key={point.order}> {point.awarded} |</span>))}
      </Button> 
    ) : (
      <Button type="button" bsStyle="success" disabled>No points to award</Button>   
    )}
    
    <br />
    <br />

    <h5>Reset Final Scores to 0 for {game.title}</h5>  
    <Button type="button" bsStyle="warning" onClick={ () => gameSetFinalScores(game, scores, null, history) }>Reset Final Scores</Button>

    <br />
    <br />
    
    {/* <h5>Reset ALL Player/Team Scores for {game.title}</h5>
    <Button type="button" bsStyle="danger" onClick={ () => resetAllScores(game) }>Reset All Scores</Button>

    <br />
    <br /> */}

  </div>
);

GameFinalize.propTypes = {
  scores: PropTypes.arrayOf(PropTypes.object),
  points: PropTypes.arrayOf(PropTypes.object),
  game: PropTypes.object,
  history: PropTypes.object,
};

export default createContainer(({ game, history }) => {
  const pointsSub = Meteor.subscribe('points.gameId', game._id);
  const points = PointsCollection.find({ gameId: game._id}, { sort: { order: 1 } }).fetch();
  let order = -1;

  if (game.golftype == "Stroke Play")
    order = 1;

  if (game.bteam) {
    const subscription = Meteor.subscribe('scores.gameTeamOrder', game._id, order);
    return {
      scores: ScoresCollection.find({ gameId: game._id, teamId: { $exists: true }}, { sort: { raw: order } }).fetch(),
      points: points,
      game: game,
      history: history,
    };
  } else {
    const subscription = Meteor.subscribe('scores.gamePlayerOrder', game._id, order);
    return {
      scores: ScoresCollection.find({ gameId: game._id, playerId: { $exists: true }}, { sort: { raw: order } }).fetch(),
      points: points,
      game: game,
      history: history,
    };
  }    
}, GameFinalize);