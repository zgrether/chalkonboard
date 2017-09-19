import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Alert } from 'react-bootstrap';
import EventsCollection from '../../../api/Events/Events';
import Loading from '../../components/Loading/Loading';
import EventHeader from '../../components/Events/EventHeader';
import EventScoreboard from '../../components/Events/EventScoreboard';

class ScoreEvent extends React.Component {

  render() {

    const { loading, found, events, history } = this.props;

    return (
      !loading ? (
         found ? (
          <div className="ScoreEvent">
            <EventHeader event={event} history={history} />

            <EventScoreboard event={event} history={history} />
          </div>
        ) : ( 
          <Alert bsStyle="warning">This event is not available</Alert> 
        )
      ) : (
        <Loading />
      )
    );
  }
}  

ScoreEvent.propTypes = {
  loading: PropTypes.bool.isRequired,
  event: PropTypes.object,
  found: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const shareId = match.params.shareId;
  const subscription = Meteor.subscribe('events.shareId', shareId);
  const events = EventsCollection.find({ shareId: shareId }).fetch();
  let found = false;

  if (events.length > 0) {
    event = events[0];
    found = true;
  }

  return {
    loading: !subscription.ready(),
    event: event,
    found: found,
  };
}, ScoreEvent);
