import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Tees from '../Tees';

Meteor.publish('tees', function tees() {
  return Tees.find({ owner: this.userId });
});

Meteor.publish('tees.view', function teesView(teeId) {
  check(teeId, String);
  return Tees.find({ _id: teeId });
});

Meteor.publish('tees.venue', function teesVenue(venueId) {
  check(venueId, String);
  return Tees.find({ venueId: venueId });
})
