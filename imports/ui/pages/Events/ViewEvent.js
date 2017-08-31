import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Alert } from 'react-bootstrap';
import EventsCollection from '../../../api/Events/Events';
import Loading from '../../components/Loading/Loading';
import EventHeader from '../../components/Events/EventHeader';
import EventScoreboard from '../../components/Events/EventScoreboard';

class ViewEvent extends React.Component {

  render() {

    const { loading, event, history } = this.props;

    return (
      !loading && event ? (
        <div className="ViewEvent">
          <EventHeader event={event} history={history} />
          <EventScoreboard event={event} history={history} />
        </div>
      ) : ( 
        <Alert bsStyle="warning">This event is not available</Alert>          
      )
    );
  }
}  

ViewEvent.propTypes = {
  loading: PropTypes.bool.isRequired,
  event: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const eventId = match.params._id;
  const subscription = Meteor.subscribe('events.view', eventId);

  return {
    loading: !subscription.ready(),
    event: EventsCollection.findOne(eventId),
  };
}, ViewEvent);
