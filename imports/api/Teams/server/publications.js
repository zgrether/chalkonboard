import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Teams from '../Teams';

Meteor.publish('teams', function teams() {
  return Teams.find();
});

Meteor.publish('teams.view', function teamsView(teamId) {
  check(teamId, String);
  return Teams.find({ _id: teamId });
});

Meteor.publish('teams.event', function teamsEvent(eventId) {
  check(eventId, String);
  return Teams.find({ eventId: eventId });
});

