/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Tees = new Mongo.Collection('Tees');

Tees.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Tees.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Tees.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this tee belongs to.',
  },
  color: {
    type: String,
    label: 'Color of tee box',
  },
  venueId: {
    type: String,
    label: 'Golf course ID',
  },
  venueName: {
    type: String,
    label: 'Golf course name',
  },
  frontpar: {
    type: Number,
    label: 'Front 9 Par total',
    required: false,
  },
  backpar: {
    type: Number,
    label: 'Back 9 Par total',
    required: false,
  },
  totalpar: {
    type: Number,
    label: 'Total Par',
    required: false,
  },
  frontyds: {
    type: Number,
    label: 'Front 9 Yards total',
    required: false,
  },
  backyds: {
    type: Number,
    label: 'Back 9 Yards total',
    required: false,
  },
  totalyds: {
    type: Number,
    label: 'Total Yards',
    required: false,
  },
});

Tees.attachSchema(Tees.schema);

export default Tees;
