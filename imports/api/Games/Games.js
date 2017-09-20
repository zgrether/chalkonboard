/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Games = new Mongo.Collection('Games');

Games.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Games.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Games.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this game belongs to.',
  },
  eventId: {
    type: String,
    label: 'The ID of the event this game belongs to.',
    required: true,
  },
  title: {
    type: String,
    label: 'The title of the game.',
    required: true,
  },
  order: {
    type: Number,
    label: 'The game order in the schedule.',
    required: true,
  },
  type: {
    type: String,
    label: 'The type of game, particularly sport.',
    required: false,
  },
  golftype: {
    type: String,
    label: 'The type of golf game.',
    required: false,
  },
  sumpoints: {
    type: Boolean,
    label: 'If team-based event, this sums the players on team.',
    required: false,
  },
  venueId: {
    type: String,
    label: 'The ID of the venue this game belongs to.',
    required: false,
  },
  teeId: {
    type: String,
    label: 'The ID of the tee this game belongs to.',
    required: false,
  },
  rules: {
    type: String,
    label: 'The rules of the game.',
    required: false,
  },
  bteam: {
    type: Boolean,
    label: 'Event team or individual based.',
    required: true,
  },
});

Games.attachSchema(Games.schema);

export default Games;
