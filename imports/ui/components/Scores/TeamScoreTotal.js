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
    const { loading, total } = this.props;

    return (
      !loading ? (
          <tr>
            <td className="teamName">Total</td>
            <td className="scoreCol">{total}</td>
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
  loading: PropTypes.bool.isRequired,
  total: PropTypes.number,
};

export default createContainer(({ game, team }) => {
  const subscription = Meteor.subscribe('scores.teamgame', team._id, game._id);
  const scores = ScoresCollection.find({ gameId: game._id, teamId: team._id }).fetch();

  let total = 0;
  scores.forEach((score) => {
    total += score.raw;
  });

  return {
    loading: !subscription.ready(),
    total,
  }
}, TeamScoreTotal);