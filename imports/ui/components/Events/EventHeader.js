/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { PageHeader } from 'react-bootstrap';

const canEdit = ({ event }) => {
  if (event.owner == Meteor.userId())
    return true;
  else 
    return false;
}

const EventHeader = ({ event, history, editing }) => (
  <div className="EventHeader">
      <PageHeader>
        {editing ? (
          // when editing the event (i.e. the owner), show the view button 
          <Link className="btn btn-primary" style={{"marginBottom":"5px"}} to={`/events/${event._id}`}>View</Link>
        ) : (
          canEdit({event}) ? ( 
            // when viewing the event, if you are the owner, show the edit button
            <Link className="btn btn-primary" style={{"marginBottom":"5px"}} to={`/events/${event._id}/edit`}>Edit</Link>
          ) : (
            null
          )
        )}
        &nbsp;&nbsp;{ event.title } <small>{ event.location }</small>
        {editing ? (
          // when editing the event
        <Link className="btn btn-link pull-right" style={{"marginTop":"10px"}} to={`/events`}>Back to Events</Link>
        ) : (
          null
        )}
      </PageHeader>

      <h4>{ event.info }</h4>

  </div>
);

EventHeader.propTypes = {
  event: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  editing: PropTypes.bool,
};

export default EventHeader;