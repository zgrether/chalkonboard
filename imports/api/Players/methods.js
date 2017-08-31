import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Players from './Players';
import Scores from '../Scores/Scores';
import Games from '../Games/Games';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'players.insert': function playersInsert(player) {
    check(player, {
      name: String,
      email: String,
    });
    
    player.teamId = "";
    player.teamName = "";
    player.events = [];
    player.games = [];
    player.total = 0;

    try {
      return Players.insert({ owner: this.userId, ...player });
    } catch (exception) {
      console.log(exception);
      throw new Meteor.Error('500', exception);
    }
  },
  'players.update': function playersUpdate(player) {
    check(player, {
      _id: String,
      name: String,
      eventId: String,
      teamId: String,
      teamName: String,
      games: Array,
      total: Number,
    });

    try {
      const playerId = player._id;
      Players.update(playerId, { $set: player });
      return playerId; // Return _id so we can redirect to player after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'players.updateinfo': function playersUpdateInfo(player) {
    check(player, {
      _id: String,
      name: String,
      email: String,
    });

    try {
      const playerId = player._id;
      Players.update(playerId, { $set: player });
      return playerId;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'players.updateteam': function playersUpdateTeam(player) {
    check(player, {
      _id: String,
      teamId: String,
      teamName: String,
    });

    try {
      const playerId = player._id;
      Players.update(playerId, { $set: player });
      return playerId;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'players.remove': function playersRemove(playerId) {
    check(playerId, String);

    try {
      return Players.remove(playerId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'players.addEvent': function playersAddEvent(player) {
    const playerId = player._id;
    const eventId = player.eventId;
    
    const exists = Players.findOne({ "_id": playerId, "events": eventId });
    if (!exists) {
      try {

        const id = Players.update(playerId, {
          $addToSet: {
            events: eventId,
          }
        });
        
        const games = Games.find({ eventId: eventId });
        games.forEach((game) => {
          const playerScore = {
            raw: 0,
            final: 0,
            playerId: playerId,
            gameId: game._id,
            eventId: eventId,
          };

          Meteor.call('scores.insertplayer', playerScore, (error, scoreId) => {
            if (error) {
              console.log(error);
            }
          });
        });

        return id;
      }
      catch (exception) {
        throw new Meteor.Error('500', exception);
      }
    }
  },
  'players.quitEvent': function playersQuitEvent(playerId, eventId) {
    try {
      const event = Players.update(playerId, {
        $pull: {
          events: 
            eventId,   
        }
      });

    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'players.addGame': function playersAddGame(playerId, gameId, scoreId) {
    try {
      const newGame = {
        gameId: gameId,
        scoreId: scoreId,
      }

      return Players.update(playerId, {
        $addToSet: {
          games: newGame,
        }
      });
    }
    catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'players.quitGame': function playersQuitGame(scoreId, playerId, playerTeamId, gameId) {
    try {
      const player = Players.update(playerId, {
        $pull: {
          games: {
            gameId: gameId
          }
        }
      });
      Meteor.call('scores.remove', scoreId, playerTeamId, gameId, (error) => {
        if (error) {
          console.log(error);
        }
      });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
   },
 });

rateLimit({
  methods: [
    'players.insert',
    'players.update',
    'players.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
