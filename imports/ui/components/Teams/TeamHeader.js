import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../Loading/Loading';
import TeamsCollection from '../../../api/Teams/Teams';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

const TeamHeader = ({ event, teams }) =>  (
  <tr>
    <th width="200">Game</th>
    {teams.map(({ _id, name }) => (
      <th key={_id}>{name}</th>
    ))}
  </tr>
);

TeamHeader.propTypes = {
  event: PropTypes.object.isRequired,
  teams: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default createContainer(({ event }) => {
  const subscription = Meteor.subscribe('teams.event', event._id);

  return {
    event: event,
    teams: TeamsCollection.find().fetch(),
  }
}, TeamHeader);