import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Alert } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import VenuesCollection from '../../../api/Venues/Venues';
import Loading from '../../components/Loading/Loading';
import VenueEditor from '../../components/Venues/VenueEditor';
import TeesList from '../../components/Venues/TeesList';

class ViewVenue extends React.Component {
  
  render() {

    const { loading, venue } = this.props;

    return (
      !loading && venue ? (
        <div className="ViewVenue">
          <PageHeader>
            {venue.name}
          </PageHeader>
          
          <VenueEditor venue={venue} />

          { venue.type == "Golf Course" ? (
              <TeesList venue={venue} />
          ) : (
            <div />
          )}
        </div> 
      ) : (
        <Alert bsStyle="warning">This venue is not available</Alert>          
      )
    );
  }
}

ViewVenue.propTypes = {
  loading: PropTypes.bool.isRequired,
  venue: PropTypes.object,
};

export default createContainer(({ match }) => {
  const venueId = match.params._id;
  const subscription = Meteor.subscribe('venues.view', venueId);

  return {
    loading: !subscription.ready(),
    venue: VenuesCollection.findOne(venueId),
  };
}, ViewVenue);
