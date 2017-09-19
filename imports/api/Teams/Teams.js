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
  owner: {
    type: String,
    label: 'The owner of the team.',
  },
  abbrv: {
    type: String,
    label: 'The abbreviation for the team.',
  },
  events: {
    type: Array,
    label: 'The list of events the team is taking part in.',
    required: false,
  },
  'events.$': Object,
  'events.$.eventId': String,
  'events.$.total': Number,
  // eventId: {
  //   type: String,
  //   label: 'The event the team is taking part in.',
  // },
  games: {
    type: Array,
    label: 'Array of games this team is taking part in.',
    required: false,
  },
  // total: {
  //   type: Number,
  //   label: 'The total score of team',
  //   required: false,
  // },
  'games.$': Object,
  'games.$.gameId': String,
  'games.$.scoreId': String,
});

Teams.attachSchema(Teams.schema);

export default Teams;
