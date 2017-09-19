import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { timeago, monthDayYearAtTime } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import ScoresCollection from '../../../api/Scores/Scores';
import Loading from '../../components/Loading/Loading';

const deleteScore = (scoreId) => {
  Meteor.call('scores.remove', scoreId, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Score deleted!', 'success');
    }
  })
}

const Scores = ({ loading, scores, match, history }) => (!loading ? (
  <div className="Scores">
    <div className="page-header clearfix">
      <h4 className="pull-left">Scores</h4>
    </div>
    {scores.length ? <Table responsive>
      <thead>
        <tr>
          <th>Score</th>
          <th>Event ID</th>
          <th>Game ID</th>
          <th>Player ID</th>
          <th>Team IDA</th>
          <th>Raw</th>
          <th>Final</th>
          <th />
        </tr>
      </thead>
      <tbody>
         {scores.map(({ _id, eventId, gameId, playerId, teamId, raw, final }) => (
          <tr key={_id}>
            <td>{_id}</td>
            <td>{eventId}</td>
            <td>{gameId}</td>
            <td>{playerId}</td>
            <td>{teamId}</td>
            <td>{raw}</td>
            <td>{final}</td> 
            <td><Button bsStyle="danger" onClick={ () => deleteScore(_id) }>Delete</Button></td>
          </tr>
        ))} 
      </tbody>
    </Table> : <Alert bsStyle="warning">No scores yet!</Alert>}
  </div>
) : <Loading />);

Scores.propTypes = {
  loading: PropTypes.bool.isRequired,
  scores: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('scores');

  return {
    loading: !subscription.ready(),
    scores: ScoresCollection.find().fetch(),
  };
}, Scores);
