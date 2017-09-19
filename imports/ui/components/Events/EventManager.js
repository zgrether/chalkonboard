/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Table, Alert, Button } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import EventsCollection from '../../../api/Events/Events';
import Loading from '../Loading/Loading';
import EventAdd from './EventAdd';

import './EventManager.scss';

const handleRemoveEvent = (eventId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('events.remove', eventId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Event deleted!', 'success');
      }
    });
  }
}

class EventManager extends React.Component {

  render() {
        const { loading, events, history } = this.props;
  
    return (
      !loading ? (
        <div className="EventManager">
          <h3>My Events</h3>

          <EventAdd />

          {events.length ? 
            <Table condensed striped responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Location</th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id}>
                    <td>{event.title}</td>
                    <td>{event.location}</td>
                    <td>
                      <Button
                        bsStyle="primary"
                        onClick={ () => history.push(`/events/${event._id}`) }
                      >Watch</Button>
                    </td>
                    <td>
                      <Button
                        bsStyle="primary"
                        onClick={ () => history.push(`/events/${event._id}/edit`) }
                      >Edit</Button>
                    </td>
                    <td>
                      <Button
                        bsStyle="link"
                        onClick={ () => handleRemoveEvent(event._id) }
                      >Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table> : <Alert bsStyle="warning">No events yet!</Alert>}
        </div>
      ) : ( 
        <Loading />
      )
    );    
  }
}

EventManager.propTypes = {
  loading: PropTypes.bool.isRequired,
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('events');

  return {
    loading: !subscription.ready(),
    events: EventsCollection.find().fetch(),
  };
}, EventManager);
