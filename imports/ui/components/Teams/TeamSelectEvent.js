/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl, Button, Row, Col, Alert } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { createContainer } from 'meteor/react-meteor-data';
import Teams from '../../../api/Teams/Teams';
import validate from '../../../modules/validate';
import Loading from '../Loading/Loading';

class TeamSelectEvent extends React.Component {
  handleSubmit() {
    const { eventId } = this.props;
    const teamId = document.querySelector(`[name="teamSelect"]`).value;

    Meteor.call('teams.addEvent', teamId, eventId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Team updated!', 'success');
      }
    });
  }

  render() {
    const { eventId, loading, teamsNotInEvent } = this.props;

    return (
      !loading ? (
        teamsNotInEvent.length ? (
          <form ref={form => (this.form = form) } onSubmit={ e => e.preventDefault() }>
            <FormGroup>
              <ControlLabel>Team Selection</ControlLabel>
              <FormControl componentClass="select" name="teamSelect" onChange={ this.handleSubmit.bind(this) }>
                <option value="none">Select a Team</option>
                { teamsNotInEvent && teamsNotInEvent.map((team) => (
                  <option value={team._id} key={team._id}>{team.name} | {team.abbrv}</option>
                ))}
              </FormControl>
            </FormGroup>
          </form>
        ) : (
          <Alert bsStyle="warning">Add more teams under My Teams > Management</Alert>
        )
      ) : ( <Loading />)
    );
  }
}

TeamSelectEvent.propTypes = {
  eventId: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  teamsNotInEvent: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default createContainer(({ eventId }) => {
  const subscription = Meteor.subscribe('teams.notevent', eventId);
  
  return {
    eventId: eventId,
    loading: !subscription.ready(),
    teamsNotInEvent: Teams.find({'events.eventId': { $ne: eventId } }).fetch(),
  };
}, TeamSelectEvent);

