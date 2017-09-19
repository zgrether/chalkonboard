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
      Bert.alert('Player removed!', 'success');
    }
  });
};

const EventEditorPlayers = ({ bteam, event, loading, players }) => (!loading ? (
  event ? (
    <div>
      <br />

      <PlayerSelectEvent eventId={event._id} />
   
      {players.length ? (
        <Table condensed striped>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Team</th> 
              <th></th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player._id}>
                <td>{player.name}</td>
                <td>{player.email}</td>
                { player.events[0].teamName ? (
                  <td>{player.events[0].teamName}</td>
                ) : (
                  <td></td>
                )}
                <td>
                  <Button
                    bsStyle="link"
                    onClick={() => handleRemove(player._id, event._id)}
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
  players: PropTypes.arrayOf(PropTypes.object).isRequired};

export default createContainer(({ event }) => {
  const subscription = Meteor.subscribe('players.event', event._id);

  return{
    bteam: event.bteam,
    event: event,
    loading: !subscription.ready(),
    players: PlayersCollection.find({ 'events.eventId': event._id }).fetch(),
  };
}, EventEditorPlayers);