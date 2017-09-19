import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Players from './Players';
import Scores from '../Scores/Scores';
import Games from '../Games/Games';
import Teams from '../Teams/Teams';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'players.insert': function playersInsert(player) {
    check(player, {
      name: String,
      email: String,
    });
    
    player.events = [];
    player.games = [];
    player.teams = [];

    try {
      return Players.insert({ owner: this.userId, ...player });
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
  'players.update': function playersUpdate(player) {
    check(player, {
      _id: String,
      name: String,
      eventId: String,
      teams: Array,
      games: Array,
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
  'players.joinTeam': function playersUpdateTeam(playerId, teamId, teamName, eventId) {
    try {
      const updatePlayerId = Players.update({ 
        _id: playerId, 
        "events.eventId": eventId
      }, {
        $set: {
          "events.$.teamId": teamId,
          "events.$.teamName": teamName
        }
      });
  
      if (teamId) {
        const scores = Scores.find({ eventId: eventId, playerId: playerId});
        scores.forEach(function(score) {
          const updateScore = {
            _id: score._id,
            playerTeamId: teamId,
          };

          Meteor.call('scores.updateTeam', updateScore, (error) => {
            if (error) {
              console.log(error);
            }
          });
        });
      }
      return updatePlayerId;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'players.removeTeam': function playersRemoveTeam(playerId, teamId) {
    try {
      const player = Players.update({_id: playerId, "events.teamId": teamId}, {
        $set: {
          "events.$.teamId": "",
          "events.$.teamName": "",
        }
      });
      
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'players.addEvent': function playersAddEvent(playerId, eventId) {
    try {
      const updateEvent = {
        eventId: eventId,
        total: 0,
        teamId: "",
      }

      const id = Players.update(playerId, {
        $addToSet: {
          events: updateEvent,
        }
      });
      
      // initialize scores for every game for this player
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
  },
  'players.quitEvent': function playersQuitEvent(playerId, eventId) {
    try {
      const event = Players.update(playerId, {
        $pull: {
          events: {
            eventId: eventId
          } 
        }
      });

      // remove scores for every game, of this event, for this player
      const games = Players.findOne(playerId).games;
      games.forEach((game) => {
        if (Games.findOne(game.gameId).eventId == eventId) {
          Meteor.call('players.quitGame', game.scoreId, playerId, "", game.gameId, (error) => {
            if (error) {
              console.log(error);
            }
          });
        }
      });

      return eventId;
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
  'players.quitGame': function playersQuitGame(scoreId, playerId, team, gameId) {
    try {
      const player = Players.update(playerId, {
        $pull: {
          games: {
            gameId: gameId
          }
        }
      });

      if (scoreId) {
        Meteor.call('scores.remove', scoreId, team, gameId, (error) => {
          if (error) {
            console.log(error);
          }
        });
      }
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
   },
   'players.updateTotal': function playersUpdateTotal(playerId, eventId, total) {
    try {
      const player = Players.update({ _id: playerId, "events.eventId": eventId }, {
        $set: {
          "events.$.total": total,
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
