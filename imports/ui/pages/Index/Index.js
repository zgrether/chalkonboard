import React from 'react';
import PropTypes from 'prop-types';
import { Button, FormGroup } from 'react-bootstrap';

import './Index.scss';

const viewEvent = (shareId, history) => {
  Meteor.call('events.eventIdFromShareId', shareId, (error, eventId) => {
    if (error) {
      Bert.alert('danger', error);
    } else {
      history.push(`/events/${eventId}`);
    }
  })
}

const sendToEvent = (shareId, history) => {
  history.push(`/scores/${shareId}`);
}

const Index = ({history}) => (
  <div className="Index">
    <img
      src="https://s3-us-west-2.amazonaws.com/cleverbeagle-assets/graphics/email-icon.png"
      alt="Clever Beagle"
    />
    <h1>Event Master</h1>
    <div className="centerButton">
      <form>
        <FormGroup>
          <input
            type="name"
            name="shareId"
            placeholder="Share ID"
            ref={shareId => (this.shareId = shareId)}
            className="form-control"
          />
        </FormGroup>
        <Button type="submit" bsStyle="success" onClick={ () => sendToEvent(this.shareId.value, history) }>Watch</Button>              
      </form>
    </div>
    <footer>
      <p>Build a Team, Create a Venue, Keep Score!</p>
    </footer>
  </div>
);

Index.propTypes = {
  history: PropTypes.object.isRequired,
}

export default Index;
