/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, FormGroup, FormControl, Button, ControlLabel, Row, Col, Checkbox } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class PlayerEditor extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        playerName: { required: true },
        email: { required: false },
      },
      messages: { 
        playerName: { required: 'This needs a name' },
        email: { required: 'This needs a email' },
      },
      submitHandler() {
        component.handleSubmit();
      },
    });
  }

  handleSubmit() {
    const { player } = this.props;
    const playerId = player._id;

    const updatePlayer = {
      _id: playerId,
      name: document.querySelector(`[name="playerName"]`).value,
      email: document.querySelector(`[name="email"]`).value,
    };

    Meteor.call('players.updateinfo', updatePlayer, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Player updated!', 'success');
      }
    });
  }

  render() {

    const { player } = this.props;
    
    return (
  
      <form ref={form => (this.form = form) } onSubmit={ e => e.preventDefault() }>
        <Row>
          <Col xs={ 5 } md={ 5 }>
            <FormGroup>
              <ControlLabel>Name</ControlLabel>
              <FormControl type="text" name="playerName" placeholder="Name" defaultValue={player.name}/>
            </FormGroup>
          </Col>
          <Col xs={ 5 } md={ 5 }>
            <FormGroup>
              <ControlLabel>Email</ControlLabel>
              <FormControl type="email" name="email" placeholder="Email" defaultValue={player.email}/>
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

PlayerEditor.propTypes = {
  player: PropTypes.object,
};

export default PlayerEditor;
