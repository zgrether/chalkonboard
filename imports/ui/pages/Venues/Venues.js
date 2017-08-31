/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { PageHeader, Table, Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import VenuesCollection from '../../../api/Venues/Venues';
import Loading from '../../components/Loading/Loading';
import VenueAdd from '../../components/Venues/VenueAdd';

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

class Venues extends React.Component {
  
  render() {
    const mediumStyle = { verticalAlign: 'middle', textAlign: 'center', width: 400 };
    const nameStyle = { verticalAlign: 'middle', textAlign: 'left', width: 100 };
    const narrowStyle = { verticalAlign: 'middle', textAlign: 'center', width: 10 };   
    const { loading, venues, history } = this.props;
  
    return (
      !loading ? (
        <div className="Venues">
          <PageHeader>
            Venue Manager
          </PageHeader>

          <VenueAdd />

          {venues.length ? 
            <Table condensed striped>
              <thead>
                <tr>
                  <th style={ nameStyle }>Name</th>
                  <th style={ nameStyle }>Type</th>
                  <th style={ narrowStyle }>Details</th>
                  <th style={ narrowStyle }></th>
                </tr>
              </thead>
              <tbody>
                {venues.map((venue) => (
                  <tr key={venue._id}>
                    <td style={ nameStyle }>{venue.name}</td>
                    <td style={ nameStyle }>{venue.type}</td>
                    <td style={ narrowStyle }>
                      <Button
                        bsStyle="primary"
                        onClick={() => history.push(`/venues/${venue._id}`)}
                        block
                      >View</Button>
                    </td>
                    <td style={ narrowStyle }>
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

Venues.propTypes = {
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
}, Venues);
