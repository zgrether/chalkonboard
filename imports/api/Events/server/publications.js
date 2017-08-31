import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Events from '../Events';

Meteor.publish('events', function events() {
  return Events.find({ owner: this.userId });
});

Meteor.publish('events.view', function eventsView(eventId) {
  check(eventId, String);
  return Events.find({ _id: eventId });
});

Meteor.publish('events.shareId', function eventsShareId(shareId) {
  check(shareId, String);
  return Events.find({ shareId: shareId });
});
