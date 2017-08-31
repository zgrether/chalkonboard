import React from 'react';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

const AuthenticatedNavigation = ({ name }) => (
  <div>
    <Nav>
      <LinkContainer to="/events">
        <NavItem eventKey={1} href="/events">Events</NavItem>
      </LinkContainer>
      <LinkContainer to="/players">
        <NavItem eventKey={2} href="/players">Players</NavItem>
      </LinkContainer>
      <LinkContainer to="/venues">
        <NavItem eventKey={3} href="/venues">Venues</NavItem>
      </LinkContainer>
      {/* <LinkContainer to="/scores">
        <NavItem eventKey={4} href="/scores">Scores</NavItem>
      </LinkContainer>
      <LinkContainer to="/games">
        <NavItem eventKey={5} href="/games">Games</NavItem>
      </LinkContainer> */}
    </Nav>
    <Nav pullRight>
      <NavDropdown eventKey={7} title={name} id="user-nav-dropdown">
        <LinkContainer to="/profile">
          <NavItem eventKey={7.1} href="/profile">Profile</NavItem>
        </LinkContainer>
        <MenuItem divider />
        <MenuItem eventKey={7.2} onClick={() => Meteor.logout()}>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  </div>
);

AuthenticatedNavigation.propTypes = {
  name: PropTypes.string.isRequired,
};

export default AuthenticatedNavigation;
