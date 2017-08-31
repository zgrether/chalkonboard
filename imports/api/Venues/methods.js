import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Venues from './Venues';
import Tees from '../Tees/Tees';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'venues.insert': function venuesInsert(venue) {
    check(venue, {
      name: String,
      type: String,
    });

    //venue.tees=[];

    try {
      return Venues.insert({ owner: this.userId, ...venue });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'venues.update': function venuesUpdate(venue) {
    check(venue, {
      _id: String,
      name: String,
    });

    try {
      const venueId = venue._id;
      Venues.update(venueId, { $set: venue });

      const tees = Tees.find({ venueId: venueId }).fetch();
      tees.forEach((tee) => {
        const teeUpdate = {
          _id: tee._id,
          venueName: venue.name,
        };

        Meteor.call('tees.updateVenueName', teeUpdate, (error) => {
          if (error) {
            console.log(error);
          }
        });
      });

      return venueId; // Return _id so we can redirect to venue after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'venues.remove': function venuesRemove(venueId) {
    check(venueId, String);

    try {
      Venues.remove(venueId);

      const tees = Tees.find({ venueId: venueId}).fetch();
      tees.forEach((tee) => {
        Meteor.call('tees.remove', tee._id, (error) => {
          if (error) {
            console.log(error);
          }
        });
      });
      
      return venueId;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  // 'venues.addtee': function venuesAddTee(venueId, tee) {
  //   check(venueId, String);
  //   check(tee._id, String);
  //   check(tee.name, String);

  //   try {
  //     return Venues.update(venueId, {
  //       $addToSet: {
  //         tees: tee,
  //       }
  //     });
  //   } catch (exception) {
  //     throw new Meteor.Error('500', exception);
  //   }
  // },
  // 'venues.removetee': function venuesRemoveTee(venueId, teeId) {
  //   check(venueId, String);
  //   check(teeId, String);

  //   try {
  //     return Venues.update(venueId, {
  //       $pull: {
  //         tees: {
  //           _id: teeId
  //         }
  //       }
  //     });
  //   } catch (exception) {
  //     throw new Meteor.Error('500', exception);
  //   }
  // },

});

rateLimit({
  methods: [
    'venues.insert',
    'venues.update',
    'venues.remove',
  ],
  limit: 5,
  timeRange: 1000,
});

