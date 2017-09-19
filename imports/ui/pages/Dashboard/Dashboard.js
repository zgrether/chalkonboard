/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Tab, Row, Nav, NavItem } from 'react-bootstrap';
import EventManager from '../../components/Events/EventManager.js';
import PlayerManager from '../../components/Players/PlayerManager.js';
import TeamManager from '../../components/Teams/TeamManager.js';
import VenueManager from '../../components/Venues/VenueManager.js';

import './Dashboard.scss';

class Dashboard extends React.Component {

  render() {

    const { history } = this.props;
    
    return (
      <div className="Dashboard">

        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row className="clearfix">
              <Nav bsStyle="pills">
                <NavItem eventKey="first" key="first">
                  My Events
                </NavItem>
                <NavItem eventKey="second" key="second">
                  My Players
                </NavItem>
                <NavItem eventKey="third" key="third">
                  My Teams
                </NavItem>
                <NavItem eventKey="fourth" key="fourth">
                  My Venues
                </NavItem>
              </Nav>

              <Tab.Content animation>
                <Tab.Pane eventKey="first">
                  <EventManager history={history} />
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <PlayerManager history={history} /> 
                </Tab.Pane>
                <Tab.Pane eventKey="third">
                  <TeamManager history={history} /> 
                </Tab.Pane>
                <Tab.Pane eventKey="fourth">
                  <VenueManager history={history} />
                </Tab.Pane>
              </Tab.Content>
          </Row>
        </Tab.Container>
      </div>
    );
  }
}

Dashboard.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Dashboard;