import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Players from '../Players/Players';
import Teams from '../Teams/Teams';
import Scores from './Scores';
import Games from '../Games/Games';
import Events from '../Events/Events';

import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'scores.insertplayer': function scoresInsertPlayer(score, playerTeamId) {
    check(score, {
      raw: Number,
      final: Number,
      playerId: String,
      gameId: String,
      eventId: String,
    });
    score.playerTeamId = playerTeamId;

    try {
      const scoreId = Scores.insert({ ...score });
      Meteor.call('players.addGame', score.playerId, score.gameId, scoreId, (error) => {
        if (error) {
          console.log(error);
        }
      });
      
      return scoreId;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'scores.insertteam': function scoresInsertTeam(score) {
    check(score, {
      raw: Number,
      final: Number,
      teamId: String,
      gameId: String,
      eventId: String,
    });

    try {
      const scoreId = Scores.insert({ ...score });
      Meteor.call('teams.addGame', score.teamId, score.gameId, scoreId, (error) => {
        if (error) {
          console.log(error);
        }
      });
      
      return scoreId;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'scores.update': function scoresUpdate(score) {
    check(score, {
      _id: String,
      raw: Number,
      final: Number,
      playerId: String,
      teamId: String,
      gameId: String,
      eventId: String,
    });

    try {
      const scoreId = score._id;
      Scores.update(scoreId, { $set: score });
      return scoreId; // Return _id so we can redirect to score after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'scores.finalize': function scoresFinalize(score) {
    check(score, {
      _id: String,
      final: Number,
    });

    try {
      const scoreId = score._id;
      Scores.update(scoreId, { $set: score });
      return scoreId;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'scores.remove': function scoresRemove(scoreId, playerTeamId, gameId) {
    check(scoreId, String);

    try {
      const score = Scores.remove(scoreId);

      // if a player is on a team, update his team's points (different from teamId 
      // when referencing a team)
      if (playerTeamId) {
        Meteor.call('scores.updateTeamPoints', playerTeamId, gameId, (error) => {
          if (error) {
            console.log(error);
          }
        });
      }

      const eventId = Games.findOne({ _id: gameId }).eventId;

      Meteor.call('scores.updateTotals', eventId, (error) => {
        if (error) {
          console.log(error);
        }
      });

      return score;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'scores.removeAll': function scoresRemoveAll(eventId) {
    check(eventId, String);

    try {
      return Scores.remove({ eventId: eventId });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'scores.enterScore': function scoresEnterScore(scoreId, playerTeamId, gameId, newScore) {
    check(scoreId, String);
    check(gameId, String);
    check(newScore, Number);

    try {
      let score;
      if (newScore == 0) {
        score = Scores.update(scoreId, {
          "$set": {
            "raw": newScore,
            "final": 0
          }
        });
        const eventId = Games.findOne({ _id: gameId }).eventId;
  
        Meteor.call('scores.updateTotals', eventId, (error) => {
          if (error) {
            console.log(error);
          }
        });

      } else {
        score = Scores.update(scoreId, {
          "$set": {
            "raw": newScore
          }
        });        
      }
      // if a player is on a team, update his team's points (different from teamId 
      // when referencing a team)
      if (playerTeamId) {
        Meteor.call('scores.updateTeamPoints', playerTeamId, gameId, (error) => {
          if (error) {
            console.log(error);
          }
        });
      }

      return score;
    } catch (exception) {
      console.log(exception);
      throw new Meteor.Error('500', exception);
    }
  },
  'scores.incrementScore': function scoresIncrement(scoreId, playerTeamId, gameId, inc) {
    check(scoreId, String);
    check(inc, Number);

    try {
      const score = Scores.update(scoreId, {
        "$inc": {
          "raw": inc
        }
      });

      // if a player is on a team, increment his team's points (different from teamId 
      // when referencing a team)
      if (playerTeamId) {
        Meteor.call('scores.updateTeamPoints', playerTeamId, gameId, (error) => {
          if (error) {
            console.log(error);
          }
        });
      }

      return score;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'scores.awardFinals': function scoresAwardFinals(game, scores, points) {
    try {
      let index = 0;
      scores.forEach((score) => {
        if (points[index])
          score.final = points[index].awarded;
        else
          score.final = 0;

        Scores.update(score._id, {
          $set: score,
        });
        index++;
      });

      Meteor.call('scores.updateTotals', game.eventId, (error) => {
        if (error) {
          console.log(error);
        }
      });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
    'scores.updateTeamPoints': function scoresUpdateTeamPoints(teamId, gameId) {
    let total = 0;
    const players = Players.find({ teamId: teamId });
    players.forEach(function(player) {
      const scores = Scores.find({ gameId: gameId, playerId: player._id });
      scores.forEach((score) => {
        if (score.playerId) {
          total += score.raw;
        }
      });
    });

    const teamScore = Scores.find({ gameId: gameId, teamId: teamId }).fetch();
    let updateTeam = teamScore[0];
    updateTeam.raw = total;
    try {
      return Scores.update(updateTeam._id, { $set: updateTeam });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'scores.updateTotals': function scoresUpdateTotals(eventId) {
    // update team totals if it is a team based event or update
    // players if this is an individual event
    const event = Events.findOne({_id: eventId});
    
    if (event.bteam) {
      const teams = Teams.find({ eventId: { $in: [eventId] } });
      
      teams.forEach((team) => {
        const games = team.games;
        let total = 0;
        let score;
  
        games.forEach((game) => {
          score = Scores.findOne(game.scoreId);
          if (score) {
            total = total + score.final;
          }
        })
        const updateTeam = {
          _id: team._id,
          total: total,
        };
        try {
          return Teams.update(team._id, { $set: updateTeam });
        } catch (exception) {
          throw new Meteor.Error('500', exception);
        }
      });
    } else {
      const players = Players.find({ events: { $in: [eventId]} });
      
      players.forEach((player) => {
        const games = player.games;
        let total = 0;
        let score;

        games.forEach((game) => {
          score = Scores.findOne(game.scoreId);
          if (score) {
            total = total + score.final;
          }
        })
        const updatePlayer = {
          _id: player._id,
          total: total,
        };
        try {
          return Players.update(player._id, { $set: updatePlayer });
        } catch (exception) {
          throw new Meteor.Error('500', exception);
        }
      });
    }      
  }
});

rateLimit({
  methods: [
    'scores.insert',
    'scores.update',
    'scores.remove',
  ],
  limit: 5,
  timeRange: 1000,
});