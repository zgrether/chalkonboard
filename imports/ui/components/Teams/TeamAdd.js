/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class TeamAdd extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.teamForm, {
      rules: {
        teamName: {
          required: true,
        },
        teamAbbrv: {
          required: true,
        },
      },
      messages: {
        teamName: {
          required: 'Need a name for your team.',
        },
        teamAbbrv: {
          required: 'Need an abbreviation for your team.',
        }
      },
      submitHandler() {
        component.handleSubmit();
      },
    });
  }

  handleSubmit() {
    
    const team = {
      name: this.teamName.value,
      abbrv: this.teamAbbrv.value,
    };
    
    Meteor.call('teams.insert', team, (error, teamId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.teamForm.reset();
        Bert.alert('Team created!', 'success');
      }
    });
  }

  render() {

    return (
      <form ref={teamForm => (this.teamForm = teamForm) } onSubmit={e => e.preventDefault()}>
        <Row>
          <Col xs={ 5 } md={ 5 }>
            <FormGroup>
              <ControlLabel>Team Name</ControlLabel>
              <input
                type="text"
                name="teamName"
                ref={ teamName => (this.teamName = teamName )}
                className="form-control"
              />
            </FormGroup>
          </Col>

          <Col xs={ 5 } md={ 5 }>
            <FormGroup>
              <ControlLabel>Team Abbreviation</ControlLabel>
              <input
                type="text"
                name="teamAbbrv"
                ref={ teamAbbrv => (this.teamAbbrv = teamAbbrv )}
                className="form-control"
              />
            </FormGroup>
          </Col>
          <Col xs={ 2 } md={ 2 }>
            <Button style={{"marginTop":"25px"}} type="submit" bsStyle="success">Add</Button>
          </Col>
        </Row>
      </form>
    )
  }
}

export default TeamAdd;