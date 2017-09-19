/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Table, Alert, Button } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import PlayersCollection from '../../../api/Players/Players';
import Loading from '../Loading/Loading';
import PlayerAdd from './PlayerAdd';

const handleRemovePlayer = (playerId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('players.remove', playerId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Player deleted!', 'success');
      }
    });
  }
}

class PlayerManager extends React.Component {
  
  render() {
    const { loading, players, history } = this.props;

    return (
      !loading ? (
        <div className="PlayerManager">
          <h3>My Players</h3>
          
          <PlayerAdd />

          {players.length ? 
            <Table condensed striped>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Details</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player._id}>
                    <td>{player.name}</td>
                    <td>{player.email}</td>
                    <td>
                      <Button
                        bsStyle="primary"
                        onClick={() => history.push(`/players/${player._id}`) }
                        block
                      >Edit</Button>
                    </td>
                    <td>
                      <Button 
                        bsStyle="link" 
                        onClick={ () => handleRemovePlayer(player._id) }
                      >Delete</Button>
                    </td>                          
                  </tr>
                ))}
              </tbody>
            </Table> : <Alert bsStyle="warning">No players yet!</Alert>}
        </div>
      ) : (
        <Loading />
      )
    );
  }
}

PlayerManager.propTypes = {
  loading: PropTypes.bool.isRequired,
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('players');
  
  return{
    loading: !subscription.ready(),
    players: PlayersCollection.find().fetch(),
  };
}, PlayerManager);