/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Scores = new Mongo.Collection('Scores');

Scores.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Scores.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Scores.schema = new SimpleSchema({
  eventId: {
    type: String,
    label: 'The score belongs to an event.',
  },
  gameId: {
    type: String,
    label: 'The score belongs to a game.',
  },
  playerId: {
    type: String,
    label: 'The score belongs to a player.',
    required: false,
  },
  teamId: {
    type: String,
    label: 'The score belongs to a team.',
    required: false,
  },
  playerTeamId: {
    type: String,
    label: 'The team a player belongs to (for individual scoring of a team-based event).',
    required: false,
  },
  raw: {
    type: Number ,
    label: 'The score is a raw value in array form.',
  },
  final: {
    type: Number,
    label: 'The score is a final value.',
  },
});

Scores.attachSchema(Scores.schema);

export default Scores;
