/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button, Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class EventAdd extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        title: {
          required: true,
        },
      },
      messages: {
        title: {
          required: 'Need a title in here.',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }
  
  handleSubmit() {

    const event = {
      title: this.eventTitle.value,
    };

    Meteor.call('events.insert', event, (error, eventId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.form.reset();
        Bert.alert('Event created!', 'success');
      }
    });
  }

  render() {
    return (
      <form ref={form => (this.form = form) } onSubmit={e => e.preventDefault()}>
        <Row>
          <Col xs={ 10 } md={ 10 }>
            <FormGroup>
              <ControlLabel>Title</ControlLabel>
              <input 
                type="text" 
                name="eventTitle" 
                ref={eventTitle => (this.eventTitle = eventTitle)} 
                className="form-control" 
              />
            </FormGroup>
          </Col>  
          <Col xs={ 2 } md={ 2 }>
            <Button style={{"marginTop":"25px"}} type="submit" bsStyle="success">Add</Button>
          </Col>
        </Row>
      </form>
    );
  }
}

export default EventAdd;