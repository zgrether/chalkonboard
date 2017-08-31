import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Tees from './Tees';
import Holes from '../Holes/Holes';
import Games from '../Games/Games';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'tees.insert': function teesInsert(tee) {
    check(tee, {
      color: String,
      venueId: String,
      venueName: String,
    });

    try {
      return Tees.insert({ owner: this.userId, ...tee });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'tees.update': function teesUpdate(tee) {
    check(tee, {
      _id: String,
      frontpar: Number,
      backpar: Number,
      totalpar: Number,
      frontyds: Number,
      backyds: Number,
      totalyds: Number,
    });

    try {
      const teeId = tee._id;
      Tees.update(teeId, { $set: tee });
      return teeId; // Return _id so we can redirect to tee after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'tees.updateVenueName': function teesUpdateVenue(tee) {
    check(tee, {
      _id: String,
      venueName: String,
    });

    try {
      const teeId = tee._id;
      Tees.update(teeId, { $set: tee });
      return teeId;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'tees.remove': function teesRemove(teeId) {
    check(teeId, String);
    
    try {
      Tees.remove(teeId);
      
      const holes = Holes.find({ teeId: teeId });
      holes.forEach((hole) => {
        Meteor.call('holes.remove', hole._id, (error) => {
          if (error) {
            console.log(error);
          }
        });
      });

      const games = Games.find({ teeId: teeId });
      games.forEach((game) => {
        const gameUpdate = {
          _id: game._id,
          teeId: "none",
        };

        Meteor.call('games.updatetee', game, (error) => {
          if (error) {
            console.log(error);
          }
        });
      });

      return teeId;
    } catch (exception) {
      console.log(exception);
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'tees.insert',
    'tees.update',
    'tees.remove',
  ],
  limit: 5,
  timeRange: 1000,
});

