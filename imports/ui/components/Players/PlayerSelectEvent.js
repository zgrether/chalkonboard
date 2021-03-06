/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl, Button, Row, Col, Alert } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { createContainer } from 'meteor/react-meteor-data';
import Players from '../../../api/Players/Players';
import validate from '../../../modules/validate';
import Loading from '../Loading/Loading';

class PlayerSelectEvent extends React.Component {
  handleSubmit() {
    const { eventId } = this.props;
    const playerId = document.querySelector(`[name="playerSelect"]`).value;

    Meteor.call('players.addEvent', playerId, eventId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Player updated!', 'success');
      }
    });
  }

  render() {
  
    const { eventId, loading, playersNotInEvent } = this.props;

    return (
      !loading ? (
        playersNotInEvent.length ? (
          <form ref={form => (this.form = form) } onSubmit={ e => e.preventDefault() }>
            <FormGroup>
              <ControlLabel>Player Selection</ControlLabel>
              <FormControl componentClass="select" name="playerSelect" onChange={ this.handleSubmit.bind(this) }>
                <option value="none">Select a Player</option>
                { playersNotInEvent && playersNotInEvent.map((player) => (
                  player.email ? (
                    <option value={player._id} key={player._id}>{player.name} | {player.email}</option>
                  ) : (
                  <option value={player._id} key={player._id}>{player.name}</option>
                  )
                ))}
              </FormControl>
            </FormGroup>
          </form>
        ) : (
          <Alert bsStyle="warning">Add more players under My Players > Management</Alert>
        )
      ) : ( <Loading />)
    );
  }
}

PlayerSelectEvent.propTypes = {
  eventId: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  playersNotInEvent: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default createContainer(({ eventId }) => {
  const subscription = Meteor.subscribe('players.notevent', eventId);
  
  return {
    eventId: eventId,
    loading: !subscription.ready(),
    playersNotInEvent: Players.find({'events.eventId': { $ne: eventId } }).fetch(),
  };
}, PlayerSelectEvent);

