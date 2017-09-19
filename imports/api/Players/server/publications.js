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
  return Players.find({ 'events.eventId': eventId }, {
    fields: {
       name: true,
       email: true,
       owner: true,
       events: { $elemMatch: { eventId: eventId } } ,
       games: true,
    }
  });
});

Meteor.publish('players.notevent', function playersNotEvent(eventId) {
  check(eventId, String);
  return Players.find({ owner: this.userId, 'events.eventId': { $ne: eventId } }, {
    fields: {
       name: true,
       email: true,
       owner: true,
    }
  });
});

Meteor.publish('players.game', function playersGame(gameId) {
  check(gameId, String);
  return Players.find({ 'games.gameId': gameId });
});

Meteor.publish('players.team', function playersTeam(teamId) {
  check(teamId, String);
  return Players.find({ 'events.teamId': teamId }, {
    fields: {
       name: true,
       email: true,
       owner: true,
       events: { $elemMatch: { teamId: teamId } },
       games: true,
      } 
    });
});

