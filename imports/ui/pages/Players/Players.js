/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Table, Alert, Button } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import PlayersCollection from '../../../api/Players/Players';
import Loading from '../../components/Loading/Loading';
import PlayerAdd from '../../components/Players/PlayerAdd';

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

class Players extends React.Component {
  
  render() {
    const mediumStyle = { verticalAlign: 'middle', textAlign: 'center', width: 400 };
    const nameStyle = { verticalAlign: 'middle', textAlign: 'left', width: 100 };
    const narrowStyle = { verticalAlign: 'middle', textAlign: 'center', width: 10 };   
    const { loading, players, history } = this.props;

    return (
      !loading ? (
        <div className="Players">
          <PageHeader>
            Player Manager
          </PageHeader>
          
          <PlayerAdd />

          {players.length ? 
            <Table condensed striped>
              <thead>
                <tr>
                  <th style={ nameStyle }>Name</th>
                  <th style={ nameStyle }>Email</th>
                  <th style={ narrowStyle }>Details</th>
                  <th style={ narrowStyle }></th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player._id}>
                    <td style={ nameStyle }>{player.name}</td>
                    <td style={ nameStyle }>{player.email}</td>
                    <td style={ narrowStyle }>
                      <Button
                        bsStyle="primary"
                        onClick={() => history.push(`/players/${player._id}`) }
                        block
                      >Edit</Button>
                    </td>
                    <td style={ narrowStyle }>
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

Players.propTypes = {
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
}, Players);