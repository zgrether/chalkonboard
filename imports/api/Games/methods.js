import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Games from './Games';
import Scores from '../Scores/Scores';
import Teams from '../Teams/Teams';
import Players from '../Players/Players';
import Points from '../Points/Points';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'games.insert': function gamesInsert(game) {
    check(game, {
      title: String,
      eventId: String,
      bteam: Boolean,
    });

    const eventId = game.eventId;
    const bteam = game.bteam;

    try {
      game.type = "Generic Scoring";
      game.rules = "There are no rules";
      game.sumpoints = false;
      game.order = Games.find({ eventId: eventId }).fetch().length;
      game.teeId = "none";
      game.venueId = "none";

      const gameId = Games.insert({ owner: this.userId, ...game });

      // create a point value for first place
      const point = {
        gameId: gameId,
        awarded: 1,
      };

      Meteor.call('points.insert', point, (error) => {
        if (error) {
          console.log(error);
        }
      });

      // join all players to the new game
      const players = Players.find({ 'events.eventId': eventId });
      players.forEach((player) => {
        const playerScore = {
          raw: 0,
          final: 0,
          playerId: player._id,
          gameId: gameId,
          eventId: eventId,
        };

        const playerTeamId = player.events[0].teamId;

        // player.teamId may be null and won't pass "check" in scores.insertplayer
        Meteor.call('scores.insertplayer', playerScore, playerTeamId, (error, scoreId) => {
          if (error) {
            console.log(error);
          }
        });
      });

      // join all teams to the new game
      const teams = Teams.find({ 'events.eventId': eventId });
      teams.forEach((team) => {
        const teamScore = {
          raw: 0,
          final: 0,
          teamId: team._id,
          gameId: gameId,
          eventId: eventId,
        };

        Meteor.call('scores.insertteam', teamScore, (error, scoreId) => {
          if (error) {
            console.log(error);
          }
        });
      });

    return gameId;
    
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'games.reorder': function gamesReorder(game) {
    check(game, {
      _id: String,
      order: Number,
    });

    try {
      const gameId = game._id;
      Games.update(gameId, { $set: game });
      return gameId;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'games.update': function gamesUpdate(game) {
    check(game, {
      _id: String,
      title: String,
      type: String,
      golftype: String,
      rules: String,
      sumpoints: Boolean,
      teeId: String,
      venueId: String,
    });

    try {
      const gameId = game._id;
      Games.update(gameId, { $set: game });
      return gameId; // Return _id so we can redirect to game after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'games.updatetee': function gamesUpdateTee(game) {
    check(game, {
      _id: String,
      teeId: String,
    });

    try {
      const gameId = game._id;
      Games.update(gameId, { $set: game });
      return gameId; // Return _id so we can redirect to game after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'games.updateteamscoring': function gamesUpdateTeamScoring(game) {
    check(game, {
      _id: String,
      bteam: Boolean,
    });

    try {
      const gameId = game._id;
      Games.update(gameId, { $set: game });
      return gameId;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'games.remove': function gamesRemove(gameId) {
    check(gameId, String);

    try {
      const eventId = Games.findOne(gameId).eventId;
      Games.remove(gameId);

      const games = Games.find({ eventId: eventId }, { sort: { order: 1}}).fetch();
      let count = 0;
      let holeUpdate;
      games.forEach((game) => {
        gameUpdate = {
          _id: game._id,
          order: count
        };
        count++;
        Meteor.call('games.reorder', gameUpdate, (error) => {
          if (error) {
            console.log(error);
          }
        });
      });

      const scores = Scores.find({ gameId: gameId });
      scores.forEach((score) => {
        Meteor.call('scores.remove', score._id, (error) => {
          if (error) {
            console.log(error);
          }
        });
      });

      const players = Players.find({ "games.gameId": gameId });
      players.forEach((player) => {
        Meteor.call('players.quitGame', "", player._id, null, gameId, (error) => {
          if (error) {
            console.log(error);
          }
        });
      });
     
      const teams = Teams.find({ "games.gameId": gameId });
      teams.forEach((team) => {
        Meteor.call('teams.quitGame', "", team._id, null, gameId, (error) => {
          if (error) {
            console.log(error);
          }
        });
      });

      const points = Points.find({ "points.gameId": gameId });
      points.forEach((point) => {
        Meteor.call('points.remove', point._id, (error) => {
          if (error) {
            console.log(error);
          }
        });
      });

      // recalculate event final score tallies
      Meteor.call('scores.updateTotals', eventId, (error) => {
        if (error) {
          console.log(error);
        }
      });
      
      return gameId;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'games.insert',
    'games.update',
    'games.remove',
  ],
  limit: 100,
  timeRange: 1000,
});
