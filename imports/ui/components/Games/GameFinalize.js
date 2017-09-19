/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { createContainer } from 'meteor/react-meteor-data';
import ScoresCollection from '../../../api/Scores/Scores';
import PointsCollection from '../../../api/Points/Points';
import Loading from '../Loading/Loading';

const gameFinalize = (game, scores, points, history) => {
  Meteor.call('scores.awardFinals', game, scores, points, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Game Final!', 'success');
      history.push(`/events/${game.eventId}`);
    }
  });
}

const GameFinalize = ({scores, points, game, history}) => (
  <div>
    {points.map((point) => (
      scores[point.order] && (
        <p key={point.order}>Place: {point.order+1}  Score: {scores[point.order].raw}  Awarded: {point.awarded}</p>
      ) 
    ))}
    <Button type="button" bsStyle="success" onClick={() => gameFinalize(game, scores, points, history)}>Finalize</Button> 
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

  if (game.bteam) {
    const subscription = Meteor.subscribe('scores.gameTeamOrderPositive', game._id);
    return {
      scores: ScoresCollection.find({ gameId: game._id, teamId: { $exists: true }}, { sort: { raw: -1 } }).fetch(),
      points: points,
      game: game,
      history: history,
    };
  } else {
    const subscription = Meteor.subscribe('scores.gamePlayerOrderPositive', game._id);
    return {
      scores: ScoresCollection.find({ gameId: game._id, playerId: { $exists: true }}, { sort: { raw: -1 } }).fetch(),
      points: points,
      game: game,
      history: history,
    };
  }    
}, GameFinalize);