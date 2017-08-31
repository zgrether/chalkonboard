import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Holes from './Holes';
import Tees from '../Tees/Tees';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'holes.insert': function holeInsert(hole) {
    check(hole, {
      teeId: String,
      par: Number,
      yds: Number,
    });

    hole.order = Holes.find({ teeId: hole.teeId }).fetch().length;
    
    try {
      const holeId = Holes.insert({ ...hole });
      Meteor.call('holes.updatetees', hole.teeId, (error) => {
        if (error) {
          console.log(error);
        }
      });
      return holeId;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'holes.update': function holesUpdate(hole) {
    check(hole, {
      _id: String,
      order: Number,
    });

    try {
      const holeId = hole._id;
      Holes.update(holeId, { $set: hole });
      const fullHole = Holes.findOne(holeId);
      
      Meteor.call('holes.updatetees', fullHole.teeId, (error) => {
        if (error) {
          console.log(error);
        }
      });

      return holeId; // Return _id so we can redirect to hole after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'holes.remove': function holesRemove(holeId) {
    check(holeId, String);
    try {
      const teeId = Holes.findOne(holeId).teeId;
      Holes.remove(holeId);
      
      const holes = Holes.find({ teeId: teeId }, { sort: { order: 1}}).fetch();
      let count = 0;
      let holeUpdate;
      holes.forEach((hole) => {
        holeUpdate = {
          _id: hole._id,
          order: count
        };
        count++;
        Meteor.call('holes.update', holeUpdate, (error) => {
          if (error) {
            console.log(error);
          }
        });
      });

      Meteor.call('holes.updatetees', teeId, (error) => {
        if (error) {
          console.log(error);
        }
      });

      return Holes.find({ teeId: teeId }).fetch();
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'holes.updatetees': function holesUpdateTees(teeId) {
    check(teeId, String);

    let frontpar = backpar = totalpar = frontyds = backyds = totalyds = count = 0;
    
    const holes = Holes.find({ teeId: teeId }, { sort: { order: 1}}).fetch();
    holes.forEach((hole) => {
      if (count < 9) {
        frontpar += hole.par;
        frontyds += hole.yds;
      } else {
        backpar += hole.par;
        backyds += hole.yds;
      }
      count++;
    });
    totalpar = frontpar + backpar;
    totalyds = frontyds + backyds;

    const tee = {
      _id: teeId,
      frontpar: frontpar,
      backpar: backpar,
      totalpar: totalpar,
      frontyds: frontyds,
      backyds: backyds,
      totalyds: totalyds
    }

    Meteor.call('tees.update', tee, (error) => {
      if (error) {
        console.log(error);
      }
    });
    return;
  }

});

rateLimit({
  methods: [
    'holes.insert',
    'holes.update',
    'holes.remove',
  ],
  limit: 100,
  timeRange: 1000,
});

