import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Events from './Events';
import Games from '../Games/Games';
import Players from '../Players/Players';
import Teams from '../Teams/Teams';
import Scores from '../Scores/Scores';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'events.insert': function eventsInsert(event) {
    check(event, {
      title: String,
    });

    event.bteam = false;

    try {
      return Events.insert({ owner: this.userId, ...event });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'events.update': function eventsUpdate(event) {
    check(event, {
      _id: String,
      title: String,
      location: String,
      info: String,
      bteam: Boolean,
      private: Boolean,
      shareId: String,
    });

    try {
      const eventId = event._id;
      Events.update(eventId, { $set: event });

      const games = Games.find({ eventId: eventId }).fetch();
      games.forEach((game) => {
        const updateGame = {
          _id: game._id,
          bteam: event.bteam,
        };

        Meteor.call('games.updateteamscoring', updateGame, (error) => {
          if (error) {
            console.log(error);
          }
        });
      });
      return eventId; // Return _id so we can redirect to event after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'events.remove': function eventsRemove(eventId) {
    check(eventId, String);
    const scores = Scores.find({ eventId: eventId });
    const games = Games.find({ eventId: eventId });
    const players = Players.find({ eventId: eventId });
    const teams = Teams.find({ eventId: eventId });

    try {
      Events.remove(eventId);

      scores.forEach((score) => {
        Scores.remove(score._id);
      });

      players.forEach((player) => {
        Players.remove(player._id);
      });

      teams.forEach((team) => {
        Teams.remove(team._id);
      });

      games.forEach((game) => {
        Games.remove(game._id);
      });

    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'events.eventIdFromShareId': function eventsGetEventId(shareId) {
    check(shareId, String);
    let eventId;

    try {
      const events = Events.find({ shareId: shareId }).fetch();
      
      if (events.length > 0) {
        eventId = events[0]._id;
      } 
      return eventId;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  }
});

rateLimit({
  methods: [
    'events.insert',
    'events.update',
    'events.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
