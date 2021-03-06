/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { PageHeader, Button, ButtonGroup, Modal, Row, Col } from 'react-bootstrap';
import GameFinalize from '../../components/Games/GameFinalize';
import EventsCollection from '../../../api/Events/Events';

const returnToScoreboard = (history, game) => {
  history.goBack();
}

const canEdit = ({ event }) => {
  if (event.owner == Meteor.userId())
    return true;
  else 
    return false;
}

class GameHeader extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      showModal: false,
      showModalRules: false,
      game: undefined,
      title: "",
    };
  }
  
  handleFinalizeGame(e) {
    e.preventDefault();
    
    this.setState({ showModal: false });
  }
  
  render() {
    const { event, game, history, editing } = this.props;

    return (
      <div className="EventHeader">
          <PageHeader>
            {editing ? (
              // when editing the game (i.e. the owner), show the view button 
              <Link className="btn btn-primary" style={{"marginBottom":"5px"}} to={`/games/${game._id}`}>View</Link>
            ) : (
              canEdit({event}) ? (
                // when viewing the game, if you are the owner, show the edit button
                <Link className="btn btn-primary" style={{"marginBottom":"5px"}} to={`/games/${game._id}/edit`}>Edit</Link>
              ) : (
                null
              )
            )}
            &nbsp;&nbsp;{ game.title }
            {editing ? (
              <ButtonGroup className="pull-right">
                <Button onClick={ () => returnToScoreboard(history, game) }>Scoreboard</Button>
                <Button onClick={ () => this.setState({ showModalRules: true, game: game, title: game.title }) }>Rules</Button>
              </ButtonGroup>
            ) : (
              <ButtonGroup className="pull-right">
                <Button onClick={ () => this.setState({ showModal: true, game: game, title: game.title }) }>Manage</Button>
                <Button onClick={ () => returnToScoreboard(history, game) }>Scoreboard</Button>
                <Button onClick={ () => this.setState({ showModalRules: true, game: game, title: game.title }) }>Rules</Button>
              </ButtonGroup>      
            )}
          </PageHeader>
          
          <Modal show={ this.state.showModal } onHide={ () => this.setState({ showModal: false }) }>
            <Modal.Header closeButton>
              <Modal.Title>Manage {this.state.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <GameFinalize game={ this.state.game } history={ history } /> 
            </Modal.Body>
          </Modal>

          <Modal show={ this.state.showModalRules } onHide={ () => this.setState({ showModalRules: false }) }>
            <Modal.Header closeButton>
              <Modal.Title>{this.state.name} Rules</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>{game.rules}</p> 
            </Modal.Body>
          </Modal>
      </div>
    );
  }
}

GameHeader.propTypes = {
  event: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  editing: PropTypes.bool,
};

export default createContainer(({ game }) => {
  const eventId = game.eventId;
  const subscription = Meteor.subscribe('events.view', eventId);
  
  return {
    event: EventsCollection.findOne(eventId) || {},
  };
}, GameHeader);