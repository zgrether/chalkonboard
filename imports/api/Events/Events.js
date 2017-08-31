/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Events = new Mongo.Collection('Events');

Events.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Events.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Events.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this event belongs to.',
  },
  createdAt: {
    type: String,
    label: 'The date this event was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this event was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
  title: {
    type: String,
    label: 'The title of the event.',
  },
  location: {
    type: String,
    label: 'The location of the event.',
    required: false,
  },
  info: {
    type: String,
    label: 'Extra info about the event.',
    required: false,
  },
  bteam: {
    type: Boolean,
    label: 'Team based scoring event.',
    required: false,
  },
  private: {
    type: Boolean,
    label: 'Private event from prying eyes.',
    required: false,
  },
  shareId: {
    type: String,
    label: 'The ID used to share the event.',
    required: false,
  },
});

Events.attachSchema(Events.schema);

export default Events;
