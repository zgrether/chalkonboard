/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Players = new Mongo.Collection('Players');

Players.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Players.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Players.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this player object belongs to.',
  },
  name: {
    type: String,
    label: 'The name of the player.',
  },
  email: {
    type: String,
    label: 'The email of the player.',
    required: false,
  },
  events: {
    type: Array,
    label: 'The list of events the player is taking part in.',
    required: false,
  },
  'events.$': String,
  teamId: {
    type: String,
    label: 'The ID of the team this player is on.',
    required: false,
  },
  teamName: {
    type: String,
    label: 'The name of the team this player is on.',
    required: false,
  },
  games: {
    type: Array,
    label: 'Array of games this player is taking part in.',
    required: false,
  },
  total: {
    type: Number,
    label: 'The total score of player',
    required: false,
  },
  'games.$': Object,
  'games.$.gameId': String,
  'games.$.scoreId': String,
});

Players.attachSchema(Players.schema);

export default Players;
