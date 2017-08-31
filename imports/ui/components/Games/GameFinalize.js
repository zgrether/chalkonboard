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

const GameFinalize = ({scores, points, loading, game, history}) => (
  !loading ? (
    <div>
      {points.map((point) => (
        scores[point.order] && (
          <p key={point.order}>Place: {point.order+1}  Score: {scores[point.order].raw}  Awarded: {point.awarded}</p>
        ) 
      ))}
      <Button type="button" bsStyle="success" onClick={() => gameFinalize(game, scores, points, history)}>Finalize</Button> 
    </div>
  ) : (
    <Loading />
  )
);

GameFinalize.propTypes = {
  scores: PropTypes.arrayOf(PropTypes.object),
  points: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool.isRequired,
  game: PropTypes.object,
  history: PropTypes.object,
};

export default createContainer(({ game, history }) => {
  const pointSub = Meteor.subscribe('points.gameId', game._id);

  let scoreSub;
  if (game.bteam) {
    scoreSub = Meteor.subscribe('scores.gameTeamOrderPositive', game._id);
  } else {
    scoreSub = Meteor.subscribe('scores.gamePlayerOrderPositive', game._id);
  }
    
  return {
    scores: ScoresCollection.find({ gameId: game._id}, { sort: { raw: -1 } }).fetch(),
    points: PointsCollection.find({ gameId: game._id}, { sort: { order: 1 } }).fetch(),
    loading: !(pointSub.ready() && scoreSub.ready()),
    game: game,
    history: history,
  };
}, GameFinalize);