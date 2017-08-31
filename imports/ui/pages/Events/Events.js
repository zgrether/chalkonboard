/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Table, Alert, Button } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import EventsCollection from '../../../api/Events/Events';
import Loading from '../../components/Loading/Loading';
import EventAdd from '../../components/Events/EventAdd';

import './Events.scss';

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

class Events extends React.Component {

  render() {
    const narrowStyle = { verticalAlign: 'middle', textAlign: 'center', width: 100 };   
    const { loading, events, history } = this.props;
  
    return (
      !loading ? (
        <div className="Events">
          <PageHeader>
            Event Manager
          </PageHeader>

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
                    <td style={ narrowStyle }>
                      <Button
                        bsStyle="primary"
                        onClick={ () => history.push(`/events/${event._id}`) }
                        block
                      >Watch</Button>
                    </td>
                    <td style={ narrowStyle }>
                      <Button
                        bsStyle="primary"
                        onClick={ () => history.push(`/events/${event._id}/edit`) }
                        block
                      >Edit</Button>
                    </td>
                    <td style={ narrowStyle }>
                      <Button
                        bsStyle="link"
                        onClick={ () => handleRemoveEvent(event._id) }
                        block
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

Events.propTypes = {
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
}, Events);
