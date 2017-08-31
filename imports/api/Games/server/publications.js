import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Games from '../Games';

Meteor.publish('games', function games() {
  return Games.find({ owner: this.userId });
});

Meteor.publish('games.view', function gamesView(gameId) {
  check(gameId, String);
  return Games.find({ _id: gameId });
});

Meteor.publish('games.event', function gamesEvent(eventId) {
  check(eventId, String);
  return Games.find({ eventId: eventId });
});
