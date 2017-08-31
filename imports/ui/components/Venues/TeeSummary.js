
/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, ListGroupItem, Alert, Glyphicon, Row, Col, Table } from 'react-bootstrap';
import Sortable from 'react-sortablejs';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { createContainer } from 'meteor/react-meteor-data';
import TeesCollection from '../../../api/Tees/Tees';

class TeeSummary extends React.Component {

  render() {

    const { tee, loading } = this.props;

    return (
     <Table>
        <thead>
          <tr>
            <th />
            <th>Par</th>
            <th>Yards</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Front</td>
            <td>{tee.frontpar}</td>
            <td>{tee.frontyds}</td>
          </tr>
          <tr>
            <td>Back</td>
            <td>{tee.backpar}</td>
            <td>{tee.backyds}</td>
          </tr>
          <tr>
            <td>Total</td>
            <td>{tee.totalpar}</td>
            <td>{tee.totalyds}</td>
          </tr>
        </tbody>
      </Table>
    );
  }
}

TeeSummary.propTypes = {
  tee: PropTypes.object,
  loading: PropTypes.bool,
}

export default createContainer(({ teeId }) => {
  const subscription = Meteor.subscribe('tee.view', teeId);
 
  return {
    tee: TeesCollection.findOne({ _id: teeId }),
    loading: !subscription.ready(),
  };
}, TeeSummary);
