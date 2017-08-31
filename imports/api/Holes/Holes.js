/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Holes = new Mongo.Collection('Holes');

Holes.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Holes.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Holes.schema = new SimpleSchema({
  teeId: {
    type: String,
    label: 'The ID of the tee.',
    required: false,
  },
  order: {
    type: Number,
    label: 'The hole order.',
    required: true,
  },
  par: {
    type: Number,
    label: 'Par for the hole.',
    required: false,
  },
  yds: {
    type: Number,
    label: 'Yards for the hole.',
    required: false,
  },
});

Holes.attachSchema(Holes.schema);

export default Holes;
