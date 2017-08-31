import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Holes from '../Holes';

Meteor.publish('holes', function holes() {
  return Holes.find();
});

Meteor.publish('holes.view', function holesView(holeId) {
  check(holeId, String);
  return Holes.find({ _id: holeId });
});

Meteor.publish('holes.tee', function holesVenue(teeId) {
  check(teeId, String);
  return Holes.find({ 
    teeId: teeId 
  }, { 
    sort: { 
      order: 1 
    } 
  }
  );
});
