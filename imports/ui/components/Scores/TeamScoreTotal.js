import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../Loading/Loading';
import PlayersCollection from '../../../api/Players/Players';
import ScoresCollection from '../../../api/Scores/Scores';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Button } from 'react-bootstrap';

import './TeamScoreTotal.scss'

class TeamScoreTotal extends React.Component {
  render() {
    const { score, loading, team, game } = this.props;

    return (
      !loading ? (
          <tr>
            <td className="teamName">Total</td>
            <td className="scoreCol">{score.raw}</td>
            <td />
            <td />
          </tr>
      ) : (
        <tr>
          <td><Loading /></td>
        </tr>
      )
    );
  }
}

TeamScoreTotal.propTypes = {
  score: PropTypes.object,
  loading: PropTypes.bool,
  team: PropTypes.object,
  game: PropTypes.object,
};

export default createContainer(({ game, team }) => {
  let scoreId;

  if (team.games) {
    team.games.forEach((teamGame) => {
      if (teamGame.gameId == game._id) {
        scoreId = teamGame.scoreId;
      }
    });
  }

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
      loading: true,
    }
  }
}, TeamScoreTotal);