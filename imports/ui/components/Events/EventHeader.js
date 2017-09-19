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
        { event.title } <small>{ event.location }</small>
        { editing ? (
          // when editing the event
          <Link className="btn btn-primary pull-right" style={{"marginTop":"10px"}} to={`/events/${event._id}`}>View Scoreboard</Link>
        ) : (
          canEdit({event}) ? ( 
            // when viewing the event, if you are the owner, show the edit button
            <Link className="btn btn-primary pull-right" style={{"marginTop":"10px"}} to={`/events/${event._id}/edit`}>Edit Event</Link>
          ) : (
            null
          )
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