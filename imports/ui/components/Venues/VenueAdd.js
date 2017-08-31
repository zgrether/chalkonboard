/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl, Button, Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class VenueAdd extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        venueName: {
          required: true,
        },
        venueType: {
          required: true,
        },
      },
      messages: {
        venueName: {
          required: 'Need a name in here.',
        },
        venueType: {
          required: 'Need to know what type of venue it is.',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }
  
  handleSubmit() {
    const venue = {
      name: this.venueName.value,
      type: this.venueType.value,
    };

    Meteor.call('venues.insert', venue, (error, venueId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.form.reset();
        Bert.alert('Venue created!', 'success');
      }
    });
  }

  render() {

    return (
      <form ref={form => (this.form = form) } onSubmit={e => e.preventDefault()}>
        <Row>
          <Col xs={ 5 } md={ 5 }>
            <FormGroup>
              <ControlLabel>Name</ControlLabel>
              <input 
                type="text" 
                name="venueName"
                className="form-control"
                ref={venueName => (this.venueName = venueName)} 
              />
            </FormGroup>
          </Col>
          <Col xs={ 5 } md={ 5 }>
            <FormGroup>
              <ControlLabel>Type</ControlLabel>
              <FormControl componentClass="select" name="venueType" inputRef={(venueType => this.venueType = venueType)} defaultValue="Golf Course" >
                <option value="Golf Course">Golf Course</option>
                <option value="Other Venue">Other Venue</option>
              </FormControl>
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

VenueAdd.propTypes = {
  venue: PropTypes.object,
};

export default VenueAdd;