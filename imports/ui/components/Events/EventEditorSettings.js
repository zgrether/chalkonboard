/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, FormGroup, FormControl, Button, ControlLabel, Col, Checkbox } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class EventEditorSettings extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        title: { required: true },
        location: { required: false },
        info: { required: false },
        bteam: { required: false },
        private: { required: false },
        shareId: { required: false },
      },
      messages: { 
        title: { required: 'This needs a title' },
        location: { required: 'This needs a location' },
        info: { required: 'This needs more information' },
        bteam: { required: 'This needs a check for bteam' },
        private: { required: 'This needs a check for privacy' },
        shareId: { required: 'This needs a shareId' },
      },
      submitHandler() {
        component.handleSubmit();
      },
    });
  }

  handleSubmit() {
    const { event } = this.props;
    const eventId = event._id;

    const updateEvent = {
      _id: eventId,
      title: document.querySelector(`[name="titleEvent"]`).value,
      location: document.querySelector(`[name="location"]`).value,
      info: document.querySelector(`[name="info"]`).value,
      bteam: document.querySelector(`[name="bteam"]`).checked,
      private: false, //document.querySelector(`[name="private"]`).checked,
      shareId: document.querySelector(`[name="shareid"]`).value,
    };

    if (!updateEvent.bteam && event.bteam) {
      if (confirm('This will remove all teams and team assignments? Are you sure?')) {
        Meteor.call('events.update', updateEvent, (error) => {
          if (error) {
            Bert.alert(error.reason, 'danger');
          } else {
            Bert.alert('Event updated!', 'success');
          }
        });
        
        Meteor.call('teams.allQuitEvent', eventId, (error) => {
          if (error) {
            Bert.alert(error.reason, 'danger');
          } else {
            Bert.alert('Teams removed!', 'success');
          }
        });
      } else {
        document.querySelector(`[name="bteam"]`).checked = true;
      }
    } else {
      Meteor.call('events.update', updateEvent, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Event updated!', 'success');
        }
      });  
    }
  }

  render() {

    const { event } = this.props;

    return (

        event ? (
          <div>
            <br />

            <form ref={form => (this.form = form) } onSubmit={ e => e.preventDefault() }>

              <FormGroup>
                <ControlLabel>Title</ControlLabel>
                <FormControl type="text" name="titleEvent" placeholder="Title" defaultValue={event.title}/>
              </FormGroup>
            
              <FormGroup>
                <ControlLabel>Location</ControlLabel>
                <FormControl type="text" name="location" placeholder="Location" defaultValue={event.location}/>
              </FormGroup>

              <FormGroup>
                <ControlLabel>Information</ControlLabel>
                <FormControl type="text" name="info" placeholder="Information" defaultValue={event.info}/>
              </FormGroup>

              <FormGroup>
                <ControlLabel>Scoring</ControlLabel>
                <Checkbox name="bteam" defaultChecked={event.bteam} onChange={ this.handleSubmit.bind(this) }>Team-Based Scoring</Checkbox>
              </FormGroup>
    
              {/* <FormGroup>
                <ControlLabel>Private</ControlLabel>
                <Checkbox name="private" defaultChecked={event.private} onChange={ this.handleSubmit.bind(this) }>Only Logged-In Players Can View</Checkbox>
              </FormGroup> */}

              <FormGroup>
                <ControlLabel>Easy Share ID (alternative URL to: http://chalkonboard.herokuapp.com/events/{event._id})</ControlLabel>
                <FormControl type="text" name="shareid" placeholder="Share ID" defaultValue={event.shareId}/>
              </FormGroup>

              <div style={{"textAlign":"center"}}>
               <Button type="submit" bsStyle="success">Save Settings</Button>
              </div>

            </form>
          </div>
        ) : ( null )
    );
  }
}  

EventEditorSettings.propTypes = {
  event: PropTypes.object,
};

export default EventEditorSettings;