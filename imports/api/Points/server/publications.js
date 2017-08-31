import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Points from '../Points';

Meteor.publish('points', function points() {
  return Points.find();
});

Meteor.publish('points.view', function pointsView(pointId) {
  check(pointId, String);
  return Points.find({ _id: gameId });
});

Meteor.publish('points.gameId', function pointsGame(gameId) {
  check(gameId, String);
  return Points.find({ 
    gameId: gameId 
  }, { 
    sort: { 
      order: 1 
    } 
  }
  );
});
