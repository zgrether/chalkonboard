import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { timeago, monthDayYearAtTime } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import GamesCollection from '../../../api/Games/Games';
import Loading from '../../components/Loading/Loading';

const deleteGame = (gameId) => {
  Meteor.call('games.remove', gameId, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Game deleted!', 'success');
    }
  })
}

const Games = ({ loading, games, match, history }) => (!loading ? (
  <div className="Events">
    <div className="page-header clearfix">
      <h4 className="pull-left">Games</h4>
    </div>
    {games.length ? <Table responsive>
      <thead>
        <tr>
          <th>Title</th>
          <th>EventId</th>
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        {games.map((game) => (
          <tr key={game._id}>
            <td>{game.title}</td>
            <td>{game.eventId}</td>
            <td>
              <Button
                bsStyle="primary"
                onClick={() => history.push(`${match.url}/${game._id}`)}
                block
              >View Game</Button>
            </td>
            <td><Button bsStyle="danger" onClick={ () => deleteGame(game._id) }>Delete</Button></td>
          </tr>
        ))}
      </tbody>
    </Table> : <Alert bsStyle="warning">No games yet!</Alert>}
  </div>
) : <Loading />);

Games.propTypes = {
  loading: PropTypes.bool.isRequired,
  games: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('games');

  return {
    loading: !subscription.ready(),
    games: GamesCollection.find().fetch(),
  };
}, Games);
