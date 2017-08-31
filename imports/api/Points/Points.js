/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Points = new Mongo.Collection('Points');

Points.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Points.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Points.schema = new SimpleSchema({
  gameId: {
    type: String,
    label: 'The ID of the game.',
    required: false,
  },
  order: {
    type: Number,
    label: 'The point order.',
    required: true,
  },
  awarded: {
    type: Number,
    label: 'Value for the point.',
    required: false,
  },
});

Points.attachSchema(Points.schema);

export default Points;
