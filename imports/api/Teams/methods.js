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
      eventId: String,
    });

    team.games = [];
    team.total = 0;

    try {
      const teamId = Teams.insert({ ...team });

      const games = Games.find({ eventId: team.eventId });
      games.forEach((game) => {
        const teamScore = {
          raw: 0,
          final: 0,
          teamId: teamId,
          gameId: game._id,
          eventId: team.eventId,
        };

        Meteor.call('scores.insertteam', teamScore, (error, scoreId) => {
          if (error) {
            console.log(error);
          } else {
            Meteor.call('teams.addGame', teamId, game._id, scoreId, (error) => {
              if (error) {
                console.log(error);
              }
            });
          }
        });
      });

      return teamId;
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
      const teamId = team._id;
      Teams.update(teamId, { $set: team });

      players = Players.find({ teamId: teamId });
      players.forEach((player) => {
        const updatePlayer = {
          _id: player._id,
          teamId: teamId,
          teamName: team.name,
        };
        
        Meteor.call('players.updateteam', updatePlayer, (error) => {
          if (error) {
            console.log(error);
          }
        });
      })
      return teamId; // Return _id so we can redirect to team after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'teams.remove': function teamsRemove(teamId) {
    check(teamId, String);

    try {
      Teams.remove(teamId);

      const players = Players.find({teamId: teamId}).fetch();
      players.forEach(function(player) {
        const updatePlayer = {
          _id: player._id,
          teamId: "",
          teamName: "",
        };

        Meteor.call('players.updateteam', updatePlayer, (error) => {
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
  'teams.addGame': function teamsAddGame(teamId, gameId, scoreId) {
    const exists = Teams.findOne({ "_id": teamId, "games.gameId": gameId });
    if (!exists) {
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
    }
  },
  'teams.quitGame': function teamsQuitGame(scoreId, teamId, gameId) {
    try {
      console.log(gameId);
      console.log(teamId);
      const team = Teams.update(teamId, {
        $pull: {
          games: {
            gameId: gameId
          }
        }
      });
      Meteor.call('scores.remove', scoreId, null, gameId, (error) => {
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
    'teams.insert',
    'teams.update',
    'teams.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
