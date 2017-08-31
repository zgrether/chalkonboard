import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Alert } from 'react-bootstrap';
import EventsCollection from '../../../api/Events/Events';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
import EventEditor from '../../components/Events/EventEditor';

class EditEvent extends React.Component {

  render() {

    const { loading, event, history } = this.props;

    return (
      !loading && event ? (
          <div className="EditEvent">
            <EventEditor event={event} history={history}/>
          </div>
        ) : ( 
          <Alert bsStyle="warning">This event is not available</Alert>        
        )
    );
  }
}  

EditEvent.propTypes = {
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
}, EditEvent);
