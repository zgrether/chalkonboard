import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Players from '../Players';

Meteor.publish('players', function players() {
  return Players.find({ owner: this.userId });
});

Meteor.publish('players.view', function playersView(playerId) {
  check(playerId, String);
  return Players.find({ _id: playerId });
});

Meteor.publish('players.event', function playersEvent(eventId) {
  check(eventId, String);
  return Players.find({ events: {$in: [eventId]} });
})
Meteor.publish('players.game', function playersGame(gameId) {
  check(gameId, String);
  return Players.find({ gameId: gameId });
})

Meteor.publish('players.team', function playersTeam(teamId) {
  check(teamId, String);
  return Players.find({ teamId: teamId });
});

