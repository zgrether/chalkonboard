/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { PageHeader, Button, Tab, Row, Col, Nav, NavItem, Alert } from 'react-bootstrap';
import EventEditorSettings from './EventEditorSettings.js';
import EventEditorTeams from './EventEditorTeams.js';
import EventEditorPlayers from './EventEditorPlayers.js';
import EventEditorGames from './EventEditorGames.js';
import Loading from '../Loading/Loading';
import { createContainer } from 'meteor/react-meteor-data';
import EventHeader from './EventHeader';
import EventScoreboard from './EventScoreboard';

import './EventEditor.scss';

class EventEditor extends React.Component {
  
  handleSubmit(e) {
    e.preventDefault();
  }

  render() {

    const { event, history } = this.props;
    const editing = true;
    
    return (
      <div className="EventEditor">

        <EventHeader event={event} history={history} editing={editing} />

        <EventScoreboard event={event} history={history} editing={editing}/>

        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row className="clearfix">
              <Nav bsStyle="tabs" >
                <NavItem eventKey="first" key="first">
                  Settings
                </NavItem>
                <NavItem eventKey="second" key="second">
                  Players
                </NavItem>
                { event.bteam && ( 
                  <NavItem eventKey="third" key="third">
                    Teams
                  </NavItem>
                )} 
                <NavItem eventKey="fourth" key="fourth">
                  Games
                </NavItem>
              </Nav>

              <Tab.Content animation>
                <Tab.Pane eventKey="first">
                  <EventEditorSettings event={ event } />
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <EventEditorPlayers event= { event } />
                </Tab.Pane>
                { event.bteam && ( 
                  <Tab.Pane eventKey="third">
                    <EventEditorTeams event={ event } /> 
                  </Tab.Pane>
                )}
                <Tab.Pane eventKey="fourth">
                  <EventEditorGames event={ event } />
                </Tab.Pane>
              </Tab.Content>
          </Row>
        </Tab.Container>
      </div>
    );
  }
}

EventEditor.propTypes = {
  event: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default EventEditor;