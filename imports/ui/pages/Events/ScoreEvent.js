import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { PageHeader } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import EventsCollection from '../../../api/Events/Events';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
import EventHeader from '../../components/Events/EventHeader';
import EventScoreboard from '../../components/Events/EventScoreboard';

class ScoreEvent extends React.Component {

  render() {

    const { loading, events, history } = this.props;

    return (
      !loading ? (
        event ? (
          <div className="ScoreEvent">
            <EventHeader event={event} history={history} />
            <EventScoreboard event={event} history={history} />
          </div>
        ) : ( 
          <NotFound /> 
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
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const shareId = match.params.shareId;
  const subscription = Meteor.subscribe('events.shareId', shareId);
  let events;
  let loading = true;

  if (subscription.ready) {
    events = EventsCollection.find({ shareId: shareId }).fetch();
    if (events.length > 0)
      event = events[0];

    loading = false;
  }

  return {
    loading: loading,
    event: event,
  };
}, ScoreEvent);
