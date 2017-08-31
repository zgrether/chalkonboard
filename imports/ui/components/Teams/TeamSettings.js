/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, FormGroup, FormControl, Button, ControlLabel, Row, Col, Checkbox } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { createContainer } from 'meteor/react-meteor-data';
import validate from '../../../modules/validate';
import TeamsCollection from '../../../api/Teams/Teams';
import Loading from '../Loading/Loading';

class TeamSettings extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        teamName: { required: false },
      },
      messages: { 
        teamName: { required: 'This needs a name' },
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
    };

    Meteor.call('teams.update', updateTeam, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Team updated!', 'success');
      }
    });
  }

  render() {

    const { loading, team } = this.props;
    return (
       team ? (
        <div className="TeamSettings">
          <PageHeader>
            <small>Update {team.name}</small>
          </PageHeader>

          <form ref={form => (this.form = form) } onSubmit={ e => e.preventDefault() }>
            <Row>
              <Col xs={ 10 } md={ 10 }>
                <FormGroup>
                  <ControlLabel>Name</ControlLabel>
                  <FormControl type="text" name="teamName" placeholder="Name" defaultValue={team.name}/>
                </FormGroup>
              </Col>
              <Col xs={ 2 } md={ 2 }>
                <Button style={{"marginTop":"25px"}} type="submit" bsStyle="success">Save</Button>
              </Col>
            </Row>   

          </form>
        </div>
      ) : ( 
        <div /> 
      )
    )
  }
}  

TeamSettings.propTypes = {
  loading: PropTypes.bool.isRequired,
  team: PropTypes.object,
};

export default createContainer(({ team }) => {
  const subscription = Meteor.subscribe('teams.view', team._id);
 
  return {
    loading: !subscription.ready(),
    team: TeamsCollection.findOne(team._id),
  };
}, TeamSettings);