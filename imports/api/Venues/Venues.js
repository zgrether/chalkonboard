/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Venues = new Mongo.Collection('Venues');

Venues.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Venues.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Venues.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this venue belongs to.',
  },
  name: {
    type: String,
    label: 'The name of the venue.',
  },
  type: {
    type: String,
    label: 'The type of venue, ex golf course.'
  },
  // tees: {
  //   type: Array,
  //   label: 'Array of tees associated with this venue.',
  //   required: false,
  // },
  // 'tees.$': Object,
  // 'tees.$._id': String,
  // 'tees.$.name': String,
});

Venues.attachSchema(Venues.schema);

export default Venues;
