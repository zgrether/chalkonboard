/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, FormGroup, InputGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class PointsAdd extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        awarded: { required: true },
      },
      messages: {
        awarded: { required: 'Need a point value.' },
      },
      submitHandler() {
        component.handleSubmit();
      },
    });
  }

  handleSubmit() {
    const { gameId } = this.props;

    const point = {
      gameId: gameId,
      awarded: parseInt(document.querySelector(`[name="awarded"]`).value, 10),
    };
    
    Meteor.call('points.insert', point, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.form.reset();
        setTimeout(() => { document.querySelector(`[name="awarded"`).focus(); }, 0);
        Bert.alert('Point Value Added!', 'success');
      }
    });
  }

  render() {

    return (

      <form ref={form => (this.form = form) } onSubmit={e => e.preventDefault()}>

        <Col xs={ 12 } md={ 12 }>
          <FormGroup>
          <ControlLabel>Points To Be Awarded</ControlLabel>
          <InputGroup>
            <FormControl type="text" name="awarded" placeholder="Points" />
            <InputGroup.Button>
              <Button bsStyle="primary" type="submit" className="pull-right">Add</Button>
            </InputGroup.Button>
          </InputGroup>
          </FormGroup>
        </Col>

      </form>   

    )
  }
}

PointsAdd.propTypes = {
  gameId: PropTypes.string.isRequired,
};

export default PointsAdd;