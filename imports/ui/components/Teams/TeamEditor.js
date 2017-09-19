/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, Button, ControlLabel, Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class TeamEditor extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        teamName: { required: true },
        teamAbbreviation: { required: true },
      },
      messages: { 
        teamName: { required: 'This needs a name' },
        teamAbbreviation: { required: 'This needs an abbreviation' },
      },
      submitHandler() {
        component.handleSubmit();
      },
    });
  }

  handleSubmit() {
    const { team } = this.props;
    const teamId = team._id;

    const updateTeam = {
      _id: teamId,
      name: document.querySelector(`[name="teamName"]`).value,
      abbrv: document.querySelector(`[name="teamAbbreviation"]`).value
    };

    Meteor.call('teams.updateinfo', updateTeam, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Team updated!', 'success');
      }
    });
  }

  render() {

    const { team } = this.props;

    return (

      <form ref={form => (this.form = form) } onSubmit={ e => e.preventDefault() }>
        <Row>
          <Col xs={ 5 } md={ 5 }>
            <FormGroup>
              <ControlLabel>Name</ControlLabel>
              <FormControl type="text" name="teamName" placeholder="Name" defaultValue={team.name}/>
            </FormGroup>
          </Col>
          <Col xs={ 5 } md={ 5 }>
            <FormGroup>
              <ControlLabel>Abbreviation</ControlLabel>
              <FormControl type="text" name="teamAbbreviation" placeholder="Abbreviation" defaultValue={team.abbrv}/>
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

TeamEditor.propTypes = {
  team: PropTypes.object,
};

export default TeamEditor;