/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, InputGroup, FormControl, Button, Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';
import Loading from '../Loading/Loading';

class TeamAdd extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        name: {
          required: true,
        },
        eventId: {
          required: true,
        },
      },
      messages: {
        name: {
          required: 'Need a name for your team.',
        },
        eventId: {
          required: 'Need an event ID.',
        },
      },
      submitHandler() {
        component.handleSubmit();
      },
    });
  }

  handleSubmit() {
    const { eventId } = this.props;
    const team = {
      name: this.inputName.value.trim(),
      eventId: eventId,
    };

    Meteor.call('teams.insert', team, (error, teamId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.form.reset();
        Bert.alert('Team created!', 'success');
      }
    });
  }

  render() {
    const { eventId } = this.props;
    return (
      <div>
        {eventId ? (
        <form ref={form => (this.form = form) } onSubmit={e => e.preventDefault()}>
          <Row>
            <Col xs={ 7 } md={ 7 }>
              <InputGroup>
                <FormControl type="text" name="name" placeholder="Team Name" inputRef={(input => this.inputName = input)}/>
                <InputGroup.Button>
                  <Button type="submit" bsStyle="success" className="pull-right">Add Team</Button>
                </InputGroup.Button>
              </InputGroup>
            </Col>
          </Row>
        </form>) : <Loading /> }
      </div>
    )
  }
}

TeamAdd.defaultProps = {
  team: { name: '', eventId: '' },
};

TeamAdd.propTypes = {
  eventId: PropTypes.string,
};

export default TeamAdd;