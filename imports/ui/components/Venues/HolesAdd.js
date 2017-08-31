/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class HolesAdd extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        par: { required: true },
        yds: { required: true }, 
      },
      messages: {
        par: { required: 'This needs a par' },
        yds: { required: 'This needs a yardage' },
      },
      submitHandler() {
        component.handleSubmit();
      },
    });
  }

  handleSubmit() {
    const { teeId } = this.props;

    const hole = {
      teeId: teeId,
      par: parseInt(document.querySelector(`[name="par"]`).value, 10),
      yds: parseInt(document.querySelector(`[name="yds"]`).value, 10),
    };
   
    Meteor.call('holes.insert', hole, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.form.reset();
        setTimeout(() => { document.querySelector(`[name="par"]`).focus(); }, 0);
        Bert.alert('Hole added!', 'success');
      }
    });
  }


  render() {

    const buttonStyle = {
        'marginTop': 25
    };

    return (
      
        <form ref={form => (this.form = form) } onSubmit={e => e.preventDefault()}>
          <Col xs={ 1 } md={ 1 } />
          
          <Col xs={ 4 } md={ 4 }>
            <FormGroup>
              <ControlLabel>Par</ControlLabel>
              <FormControl type="text" name="par" placeholder="Par" />
            </FormGroup>
          </Col>

          <Col xs={ 4} md={ 4 }>
            <FormGroup>
              <ControlLabel>Yards</ControlLabel>
              <FormControl type="text" name="yds" placeholder="Yards" />
            </FormGroup>
          </Col>

          <Col xs={ 2 } md={ 2 }>  
            <Button bsStyle="primary" type="submit" style={ buttonStyle }>Add</Button>
          </Col>
          
          <Col xs={ 1 } md={ 1 } />
        </form>   

     )
  }
}

HolesAdd.propTypes = {
  teeId: PropTypes.string.isRequired,
};

export default HolesAdd;
