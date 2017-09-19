import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Players from '../Players/Players';
import Teams from '../Teams/Teams';
import Scores from './Scores';
import Games from '../Games/Games';
import Events from '../Events/Events';

import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'scores.insertplayer': function scoresInsertPlayer(score, teamId) {
    check(score, {
      raw: Number,
      final: Number,
      playerId: String,
      gameId: String,
      eventId: String,
    });
    if (teamId)
      score.playerTeamId = teamId;

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
  'scores.updateTeam': function scoresUpdateTeam(score) {
    check(score, {
      _id: String,
      playerTeamId: String,
    });

    try {
      const scoreId = score._id;
      Scores.update(scoreId, { $set: score });
      return scoreId;
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
  'scores.remove': function scoresRemove(scoreId, team) {
    check(scoreId, String);

    try {
      const score = Scores.findOne({ _id: scoreId });
      const gameId = score.gameId;
      const eventId = score.eventId;

      Scores.remove(scoreId);

      // if a player is on a team, update his team's points (different from teamId 
      // when referencing a team)
      if (team) {
        const playerTeamId = team._id;
        Meteor.call('scores.updateTeamPoints', playerTeamId, gameId, (error) => {
          if (error) {
            console.log(error);
          }
        });
      }

     

      // Meteor.call('scores.updateTotals', eventId, (error) => {
      //   if (error) {
      //     console.log(error);
      //   }
      // });

      return score;
    } catch (exception) {
      console.log(exception);
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
        // const eventId = Games.findOne({ _id: gameId }).eventId;
  
        // Meteor.call('scores.updateTotals', eventId, (error) => {
        //   if (error) {
        //     console.log(error);
        //   }
        // });

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
      const numScores = scores.length;
      let newScore = [];
      let totalPoints;
      let i = 0;
      let j = 0;
      let k = 0;

      if (points) {
        while (i < numScores) {
          if (points[i]) {
            totalPoints = points[i].awarded;
          } else {
            totalPoints = 0;
          }

          let count = 1;
          for (j = (i + 1); j < numScores; j++) {
            if (scores[i].raw == scores[j].raw) {
              if (points[j]) {
                totalPoints += points[j].awarded;
              } else {
                totalPoints += 0;
              }
              count += 1;
            }
          }
          k = i;
          for (k; k < i + count; k++) {
            scores[k].final = totalPoints / count;
          }
          i = k;
        }
        scores.forEach((score) => {
          Scores.update(score._id, {
            $set: score,
          });
        });
      } else {
        scores.forEach((score) => {
          
          score.final = 0;

          Scores.update(score._id, {
            $set: score,
          });
        });
      }

      Meteor.call('scores.updateTotals', game.eventId, (error) => {
        if (error) {
          console.log(error);
        }
      });

    } catch (exception) {
      console.log(exception);
      throw new Meteor.Error('500', exception);
    }
  },
  'scores.updateTeamPoints': function scoresUpdateTeamPoints(teamId, gameId) {
    try {

      // find all players on team and total their raw scores
      let total = 0;
      const players = Players.find({ "events.teamId": teamId }).fetch();
      players.forEach(function(player) {
        const scores = Scores.find({ gameId: gameId, playerId: player._id });
        scores.forEach((score) => {
          if (score.playerId) {
            total += score.raw;
          }
        });
      });

      // find the team score associated with this game
      let teamScoreId;
      const games = Teams.findOne(teamId).games;//.games[0].scoreId;
      games.forEach(function(game) {
        if (game.gameId == gameId) {
          teamScoreId = game.scoreId;
        }
      });
      let updateTeam = Scores.findOne(teamScoreId);

      // set the raw score to the total for this score
      updateTeam.raw = total;
      Scores.update(updateTeam._id, { $set: updateTeam });
      
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'scores.updateTotals': function scoresUpdateTotals(eventId) {
    try {
      // update team totals if it is a team based event or update
      // players if this is an individual event
      const event = Events.findOne({_id: eventId});
      
      if (event.bteam) {
        const teams = Teams.find({ 'events.eventId': eventId });
        
        teams.forEach((team) => {
          const games = team.games;
          let total = 0;
          let score;
    
          games.forEach((game) => {
            score = Scores.findOne(game.scoreId);
            if (score) {
              total = total + score.final;
            }
          });

          Meteor.call('teams.updateTotal', team._id, eventId, total, (error) => {
            if (error) {
              console.log(error);
            }
          });

        });
      } else {
        const players = Players.find({ 'events.eventId': eventId });
        
        players.forEach((player) => {
          const games = player.games;
          let total = 0;
          let score;

          games.forEach((game) => {
            score = Scores.findOne(game.scoreId);
            if (score) {
              total = total + score.final;
            }
          });

          Meteor.call('players.updateTotal', player._id, eventId, total, (error) => {
            if (error) {
              console.log(error);
            }
          });
        }); 
      } 
    } catch (exception) {
      throw new Meteor.Error('500', exception);
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
