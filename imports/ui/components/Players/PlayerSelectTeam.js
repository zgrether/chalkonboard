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

class PlayerSelectTeam extends React.Component {
  handleSubmit() {
   const { teamId, teamName } = this.props;

    const updatePlayer = {
      _id: document.querySelector(`[name="playerTeamSelect"]`).value,
      teamId: teamId,
      teamName: teamName,
    };

    Meteor.call('players.updateteam', updatePlayer, (error, playerId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Player added', 'success');
      }
    });
  }

  render() {
    const nameStyle = { verticalAlign: 'middle', textAlign: 'left', width: 200 };
    const narrowStyle = { verticalAlign: 'middle', textAlign: 'center', width: 10 };   
    const { teamId, teamName, loading, playersNotOnTeam } = this.props;

    return (
      !loading ? (
        playersNotOnTeam.length ? (
          <form ref={form => (this.form = form) } onSubmit={ e => e.preventDefault() }>
            <FormGroup>
              <ControlLabel>Player Selection</ControlLabel>
              <FormControl componentClass="select" name="playerTeamSelect" onChange={ this.handleSubmit.bind(this) }>
                <option value="none">Select a Player</option>
                { playersNotOnTeam && playersNotOnTeam.map((player) => (
                  <option value={player._id} key={player._id}>{player.name} - Current Team: {player.teamName ? player.teamName : "none"}</option>
                ))}
              </FormControl>
            </FormGroup>
          </form>
        ) : (
          <Alert bsStyle="warning">Add more players under the event's settings tab</Alert>
        )
      ) : ( <Loading />)
    );
  }
}

PlayerSelectTeam.propTypes = {
  teamId: PropTypes.string,
  teamName: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  playersNotOnTeam: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default createContainer(({ eventId, teamId, teamName }) => {
  const subscription = Meteor.subscribe('players.event', eventId);

  return {
    teamId: teamId,
    teamName: teamName,
    loading: !subscription.ready(),
    playersNotOnTeam: Players.find({events: { $in: [eventId]}, teamId: {$ne: teamId}}).fetch(),
  };
}, PlayerSelectTeam);

