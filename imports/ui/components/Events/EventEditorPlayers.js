/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Table, Alert, Button, FormControl, InputGroup, Row, Col} from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import PlayersCollection from '../../../api/Players/Players';
import Loading from '../../components/Loading/Loading';
import PlayerSelectEvent from '../Players/PlayerSelectEvent';

const handleRemove = (playerId, eventId) => {
  
  Meteor.call('players.quitEvent', playerId, eventId, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Player deleted!', 'success');
    }
  });
};

const mediumStyle = { verticalAlign: 'middle', textAlign: 'center', width: 400 };
const nameStyle = { verticalAlign: 'middle', textAlign: 'left', width: 200 };
const narrowStyle = { verticalAlign: 'middle', textAlign: 'center', width: 10 };   

const EventEditorPlayers = ({ bteam, event, loading, players }) => (!loading ? (
  event ? (
    <div>
      <br />

      <PlayerSelectEvent eventId={event._id} />
   
      {players.length ? (
        <Table condensed striped>
          <thead>
            <tr>
              <th style={ nameStyle }>Name</th>
              <th style={ mediumStyle }>Email</th>
              { bteam &&
              <th style={ mediumStyle }>Team</th>
              }         
              <th style={ narrowStyle }></th>
            </tr>
          </thead>
          <tbody>
            {players.map(({ _id, name, email, teamName }) => (
              <tr key={_id}>
                <td style={ nameStyle }>{name}</td>
                <td style={ mediumStyle }>{email}</td>
                { bteam &&
                <td style={ mediumStyle }>{teamName}</td>
                }
                <td style={ narrowStyle }>
                  <Button
                    bsStyle="link"
                    onClick={() => handleRemove(_id, event._id)}
                    block
                  >Remove</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert bsStyle="warning">No players yet!</Alert>
      )}
    </div>
  ) : ( null )
) : <Loading />);

EventEditorPlayers.propTypes = {
  bteam: PropTypes.bool,
  event: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default createContainer(({ event }) => {
  const subscription = Meteor.subscribe('players');
  
  return{
    bteam: event.bteam,
    event: event,
    loading: !subscription.ready(),
    players: PlayersCollection.find({events: { $in: [event._id]}}).fetch(),
  };
}, EventEditorPlayers);