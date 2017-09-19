/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl, Button, Row, Col, Alert } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { createContainer } from 'meteor/react-meteor-data';
import Players from '../../../api/Players/Players';

class PlayerSelectTeam extends React.Component {
  handleSubmit() {
    const { teamId, teamName, eventId } = this.props;
    const playerId = document.querySelector(`[name="playerTeamSelect"]`).value;

    Meteor.call('players.joinTeam', playerId, teamId, teamName, eventId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Player added', 'success');
      }
    });
  }

  render() {

    const { playersNotOnTeam } = this.props; 

    return (
      playersNotOnTeam.length ? (
        <form ref={form => (this.form = form) } onSubmit={ e => e.preventDefault() }>
          <FormGroup>
            <ControlLabel>Player Selection</ControlLabel>
            <FormControl componentClass="select" name="playerTeamSelect" onChange={ this.handleSubmit.bind(this) }>
              <option value="none">Select a Player</option>
              { playersNotOnTeam.map((player) => (
                player.events[0].teamId ? (  
                  <option value={player._id} key={player._id}>{player.name} | Current Team: {player.events[0].teamName}</option>
                ) : (
                  <option value={player._id} key={player._id}>{player.name}</option>
                )
              ))}
            </FormControl>
          </FormGroup>
        </form>
      ) : (
        <Alert bsStyle="warning">Add more players under the event's settings tab</Alert>
      )
    );
  }
}

PlayerSelectTeam.propTypes = {
  teamId: PropTypes.string,
  eventId: PropTypes.string.isRequired,
  playersNotOnTeam: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PlayerSelectTeam;
