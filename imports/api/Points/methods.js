import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Points from './Points';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'points.insert': function pointsInsert(point) {
    check(point, {
      gameId: String,
      awarded: Number,
    });
    
    try {
      point.order = Points.find({ gameId: point.gameId }).fetch().length;

      const pointId = Points.insert({ ...point });

      return pointId;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'points.update': function pointsUpdate(point) {
    check(point, {
      _id: String,
      order: Number,
    });

    try {
      const pointId = point._id;
      Points.update(pointId, { $set: point });

      return pointId; // Return _id so we can redirect to hole after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'points.remove': function pointsRemove(pointId) {
    check(pointId, String);
    try {
      const gameId = Points.findOne(pointId).gameId;
      Points.remove(pointId);

      const points = Points.find({ gameId: gameId }, { sort: { order: 1 }}).fetch();
      let count = 0;
      let pointUpdate;
      points.forEach((point) => {
        pointUpdate = {
          _id: point._id,
          order: count
        };
        count++;
        Meteor.call('points.update', pointUpdate, (error) => {
          if (error) {
            console.log(error);
          }
        });
      });
      
      return Points.find({ gameId: gameId }).fetch();
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'points.insert',
    'points.update',
    'points.remove',
  ],
  limit: 100,
  timeRange: 1000,
});

