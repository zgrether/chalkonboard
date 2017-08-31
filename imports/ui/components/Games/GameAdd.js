/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, InputGroup, FormControl, Button, Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';
import Loading from '../Loading/Loading';

class GameAdd extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        title: {
          required: true,
        },
        eventId: {
          required: true,
        },
      },
      messages: {
        title: {
          required: 'Need a name for your game.',
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
    const { event } = this.props;
    const game = {
      title: this.inputName.value.trim(),
      eventId: event._id,
      bteam: event.bteam,
    };

    Meteor.call('games.insert', game, (error, gameId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.form.reset();
        Bert.alert('Game created!', 'success');
      }
    });
  }

  render() {
    const { event } = this.props;
    return (
      <div>
        {event ? (
        <form ref={form => (this.form = form) } onSubmit={e => e.preventDefault()}>
          <Row>
            <Col xs={ 7 } md={ 7 }>
              <InputGroup>
                <FormControl type="text" name="name" placeholder="Game Title" inputRef={(input => this.inputName = input)}/>
                <InputGroup.Button>
                  <Button type="submit" bsStyle="success" className="pull-right">Add Game</Button>
                </InputGroup.Button>
              </InputGroup>
            </Col>
          </Row>
        </form>) : <Loading /> }
      </div>
    )
  }
}

GameAdd.propTypes = {
  event: PropTypes.object,
};

export default GameAdd;