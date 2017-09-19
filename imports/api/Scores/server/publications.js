import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Scores from '../Scores';

Meteor.publish('scores', function scores() {
  return Scores.find();
});

Meteor.publish('scores.view', function scoresView(scoreId) {
  check(scoreId, String);
  return Scores.find({ _id: scoreId });
});

Meteor.publish('scores.raw', function scoresRaw({gameId, playerId}) {
  return Scores.find({ gameId: gameId, playerId: playerId});
});

Meteor.publish('scores.player', function scoresPlayer(playerId) {
  check(playerId, String);
  return Scores.find({ playerId: playerId });
});

Meteor.publish('scores.team', function scoresTeam(teamId) {
  check(teamId, String);
  return Scores.find({ teamId: teamId });
});

Meteor.publish('scores.game', function scoresGame(gameId) {
  check(gameId, String);
  return Scores.find({ gameId: gameId });
});

Meteor.publish('scores.gamePlayerOrderPositive', function scoresPlayerGameOrderPositive(gameId) {
  check(gameId, String);
  return Scores.find({ 
      gameId: gameId,
      playerId: {$exists: true },
    }, 
    {
      sort: { raw: -1 }
    }
  );
});

Meteor.publish('scores.gameTeamOrderPositive', function scoresTeamGameOrderPositive(gameId) {
  check(gameId, String);
  return Scores.find({ 
      gameId: gameId,
      teamId: {$exists: true },
    }, 
    {
      sort: { raw: -1 }
    }
  );
});

Meteor.publish('scores.event', function scoresEvent(eventId) {
  check(eventId, String);
  return Scores.find({ eventId: eventId });
});

Meteor.publish('scores.playergame', function scoresPlayerGame(playerId, gameId) {
  check(playerId, String);
  check(gameId, String);
  return Scores.find({ playerId: playerId, gameId: gameId });
});

Meteor.publish('scores.teamgame', function scoresTeamGame(teamId, gameId) {
  check(teamId, String);
  check(gameId, String);
  return Scores.find({ playerId: "", teamId: teamId, gameId: gameId });
});



