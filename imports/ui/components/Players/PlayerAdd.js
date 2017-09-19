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
    validate(component.playerForm, {
      rules: {
        playerName: {
          required: true,
        },
        emailAddress: {
          required: false,
          email: true,
        },
      },
      messages: {
        playerName: {
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
      name: this.playerName.value,
      email: this.emailAddress.value,
    };

    Meteor.call('players.insert', player, (error, playerId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.playerForm.reset();
        Bert.alert('Player created!', 'success');
      }
    });
  }

  render() {

    return (
      <form ref={playerForm => (this.playerForm = playerForm) } onSubmit={e => e.preventDefault()}>
        <Row>
          <Col xs={ 5 } md={ 5 }>
            <FormGroup>
              <ControlLabel>Player Name</ControlLabel>
              <input
                type="text"
                name="playerName"
                ref={playerName => (this.playerName = playerName)}
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