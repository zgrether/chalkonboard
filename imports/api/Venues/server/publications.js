import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Venues from '../Venues';

Meteor.publish('venues', function venues() {
  return Venues.find({ owner: this.userId });
});

Meteor.publish('venues.view', function venuesView(venueId) {
  check(venueId, String);
  return Venues.find({ _id: venueId });
});
