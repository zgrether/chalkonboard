/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Teams = new Mongo.Collection('Teams');

Teams.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Teams.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Teams.schema = new SimpleSchema({
  name: {
    type: String,
    label: 'The name of the team.',
  },
  eventId: {
    type: String,
    label: 'The event the team is taking part in.',
  },
  games: {
    type: Array,
    label: 'Array of games this team is taking part in.',
    required: false,
  },
  total: {
    type: Number,
    label: 'The total score of team',
    required: false,
  },
  'games.$': Object,
  'games.$.gameId': String,
  'games.$.scoreId': String,
});

Teams.attachSchema(Teams.schema);

export default Teams;
