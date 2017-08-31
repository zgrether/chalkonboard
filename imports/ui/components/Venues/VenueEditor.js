/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { PageHeader, FormControl, FormGroup, ControlLabel, Button, Row, Col } from 'react-bootstrap';
import validate from '../../../modules/validate';

class VenueEditor extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        venueName: { required: true },
      },
      messages: {
        venueName: { required: 'This needs a name' },
      },
      submitHandler() {
        component.handleSubmit();
      },
    });
  }

  handleSubmit() {
    const { venue } = this.props;
    const venueId = venue._id;
    
    const updateVenue = {
      _id: venueId,
      name: document.querySelector(`[name="venueName"]`).value,
    };

    Meteor.call('venues.update', updateVenue, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
    } else {
        Bert.alert('Venue updated!', 'success');
      }
    });
  }

  render() {

    const { venue } = this.props;

    return (

      <form ref={form => (this.form = form) } onSubmit={ e => e.preventDefault() }>
        <Row>
          <Col xs={ 5 } md={ 5 }>
            <FormGroup>
              <ControlLabel>Name</ControlLabel>
              <FormControl type="text" name="venueName" placeholder="Name" defaultValue={venue.name} />
            </FormGroup>
          </Col>
          <Col xs={ 2 } md={ 2 }>
            <Button style={{"marginTop":"25px"}} type="submit" bsStyle="success">Save</Button>
          </Col>
        </Row>
      </form>
    )
  }
}
  
VenueEditor.propTypes = {
  venue: PropTypes.object.isRequired,
};

export default VenueEditor;