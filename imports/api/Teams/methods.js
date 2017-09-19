import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Teams from './Teams';
import Players from '../Players/Players';
import Scores from '../Scores/Scores';
import Games from '../Games/Games';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'teams.insert': function teamsInsert(team) {
    check(team, {
      name: String,
      abbrv: String,
    });

    team.events = [];
    team.games = [];
    
    try {
      return Teams.insert({ owner: this.userId, ...team });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'teams.update': function teamsUpdate(team) {
    check(team, {
      _id: String,
      name: String,
    });

    try {
      return Teams.update(team._id, { $set: team });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'teams.updateinfo': function teamsUpdateInfo(team) {
    check(team, {
      _id: String,
      name: String,
      abbrv: String,
    });

    try {
      const teamId = team._id;
      Teams.update(teamId, { $set: team });
      return teamId;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'teams.remove': function teamsRemove(teamId) {
    check(teamId, String);

    try {
      Teams.remove(teamId);

      const players = Players.find({teams: { $in: [teamId]} });
      players.forEach(function(player) {
        Meteor.call('players.removeTeam', player._id, teamId, (error) => {
          if (error) {
            console.log(error);
          }
        });
      });

      return teamId;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'teams.addEvent': function teamsAddEvent(teamId, eventId) {
    try {
      const updateEvent = {
        eventId: eventId, 
        total: 0,
      };

      const id = Teams.update(teamId, {
        $addToSet: {
          events: updateEvent,
        }
      });

      // initialize scores for every game for this team
      const games = Games.find({ eventId: eventId });
      games.forEach((game) => {
        const teamScore = {
          raw: 0,
          final: 0,
          teamId: teamId,
          gameId: game._id,
          eventId: eventId,
        };

        Meteor.call('scores.insertteam', teamScore, (error, scoreId) => {
          if (error) {
            console.log(error);
          }
        });
      });

      return id;ß

    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'teams.quitEvent': function teamsQuitEvent(teamId, eventId) {
    try {
      // remove teamId from players assigned to team
      const players = Players.find({ 'events.teamId': teamId });
      players.forEach((player) => {
        Meteor.call('players.removeTeam', player._id, teamId, (error) => {
          if (error) {
            console.log(error);
          }
        });
      });

      // remove scores for every game, of this event, for this team
      const games = Teams.findOne(teamId).games;
      games.forEach((game) => {
        const gameValid = Games.findOne(game.gameId);
        if (gameValid && (gameValid.eventId == eventId)) {
            Meteor.call('teams.quitGame', game.scoreId, teamId, game.gameId, (error) => {
              if (error) {
                console.log(error);
              }
            });
          }
      });

      // remove event from team
      Teams.update(teamId, {
        $pull: {
          events: {
            eventId: eventId
          }
        }
      });

      return eventId;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'teams.allQuitEvent': function teamsAllQuitEvent(eventId) {
    try {
      const teams = Teams.find({ 'events.eventId': eventId});
      teams.forEach((team) => {
        Meteor.call('teams.quitEvent', team._id, eventId, (error) => {
          if (error) {
            console.log(error);
          }
        });
      });
      return;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'teams.addGame': function teamsAddGame(teamId, gameId, scoreId) {
    try {
      const newGame = {
        gameId: gameId,
        scoreId: scoreId,
      }
      
      return Teams.update(teamId, {
        $addToSet: {
          games: newGame,
        }
      });
    }
    catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'teams.quitGame': function teamsQuitGame(scoreId, teamId, gameId) {
    try {
      const team = Teams.update(teamId, {
        $pull: {
          games: {
            gameId: gameId
          }
        }
      });

      if (scoreId) {
        Meteor.call('scores.remove', scoreId, null, gameId, (error) => {
          if (error) {
            console.log(error);
          }
        });
      }
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'teams.updateTotal': function teamsUpdateTotal(teamId, eventId, total) {
    try {
      const team = Teams.update({ _id: teamId, "events.eventId": eventId}, {
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
    'teams.insert',
    'teams.update',
    'teams.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
