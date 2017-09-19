/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { PageHeader, Table, Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import VenuesCollection from '../../../api/Venues/Venues';
import Loading from '../Loading/Loading';
import VenueAdd from './VenueAdd';

const handleRemoveVenue = (venueId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('venues.remove', venueId, error => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Venue deleted!', 'success');
      }
    });
  }
}

class VenueManager extends React.Component {
  
  render() {

    const { loading, venues, history } = this.props;
  
    return (
      !loading ? (
        <div className="VenueManager">
          <h3>My Venues</h3>

          <VenueAdd />

          {venues.length ? 
            <Table condensed striped>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Details</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {venues.map((venue) => (
                  <tr key={venue._id}>
                    <td>{venue.name}</td>
                    <td>{venue.type}</td>
                    <td>
                      <Button
                        bsStyle="primary"
                        onClick={() => history.push(`/venues/${venue._id}`)}
                        block
                      >View</Button>
                    </td>
                    <td>
                      <Button 
                        bsStyle="link" 
                        onClick={ () => handleRemoveVenue(venue._id) }
                      >Delete</Button>
                    </td>     
                  </tr>
                ))}
              </tbody>
            </Table> : <Alert bsStyle="warning">No venues yet!</Alert>}
        </div>
      ) : (
        <Loading />
      )
    )
  }  
}

VenueManager.propTypes = {
  loading: PropTypes.bool.isRequired,
  venues: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('venues');

  return {
    loading: !subscription.ready(),
    venues: VenuesCollection.find().fetch(),
  };
}, VenueManager);
