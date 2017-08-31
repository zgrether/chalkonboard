/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class PlayerAdd extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        name: {
          required: true,
        },
        emailAddress: {
          required: false,
          email: true,
        },
      },
      messages: {
        title: {
          required: 'Need a name for your player.',
        },
        emailAddress: {
          required: 'Need an email address here.',
          email: 'Is this email address correct?',
        },
      },
      submitHandler() {
        component.handleSubmit();
      },
    });
  }

  handleSubmit() {
    
    const player = {
      name: this.name.value,
      email: this.emailAddress.value,
    };

    Meteor.call('players.insert', player, (error, playerId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.form.reset();
        Bert.alert('Player created!', 'success');
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
                name="name"
                ref={name => (this.name = name)}
                className="form-control"
              />
            </FormGroup>
          </Col>
          <Col xs={ 5 } md={ 5 }>
            <FormGroup>
              <ControlLabel>Email Address</ControlLabel>
              <input
                type="email"
                name="emailAddress"
                ref={emailAddress => (this.emailAddress = emailAddress)}
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

export default PlayerAdd;