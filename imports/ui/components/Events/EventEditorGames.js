/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem, Glyphicon, PageHeader, Table, Alert, Button, FormControl, InputGroup, Row, Col, Modal} from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import Sortable from 'react-sortablejs';
import { Meteor } from 'meteor/meteor';
import GamesCollection from '../../../api/Games/Games';
import Loading from '../../components/Loading/Loading';
import GameAdd from '../Games/GameAdd';
import GameEditor from '../Games/GameEditor';
import EventScoreboard from './EventScoreboard';

class EventEditorGames extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      game: undefined,
      showModal: false,
    };
  }

  handleRemoveGame(e) {
    e.preventDefault();

    const gameId = this.state.game._id;

    Meteor.call('games.remove', gameId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Game deleted!', 'success');
      }
    });

    this.setState({
      game: undefined,
      showModal: false,
    });
  }

  updateGameOrder = (items) => {
    items.forEach((_id, order) => {
      Meteor.call('games.reorder', { _id, order }, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        }
      });
    });
  };

  render() {

    const { event, loading, games, history } = this.props;

    return (
      !loading ? (
        <div className="EventEditorGames">
          
          <EventScoreboard event={event} history={history} editing={true}/>

          <PageHeader>
            <GameAdd event={event} />
          </PageHeader>

          {games.length ? 
            <Sortable onChange={ this.updateGameOrder.bind(this) }>
              {games.map((game) => (
                <ListGroupItem key={ game._id } data-id={ game._id }>
                  <Glyphicon glyph="align-justify" />
                  &nbsp;&nbsp;&nbsp;&nbsp;{ game.order+1 }&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;{ game.title }&nbsp;&nbsp;&nbsp;
                  <Button
                      bsStyle="link"
                      className="pull-right"
                      style={{"marginTop":"-7px"}}
                      onClick={ () => this.setState({ showModal: true, game: game }) }              
                    >Edit</Button>
                </ListGroupItem>
              ))}
            </Sortable> : <Alert bsStyle="warning">No games yet!</Alert>}

            <Modal show={ this.state.showModal } onHide={ () => this.setState({ showModal: false }) }>
              <Modal.Body>
                {this.state.game ? (
                  <GameEditor gameId={ this.state.game._id } /> 
                ) : ( <div /> )}
              </Modal.Body>
              <Modal.Footer>
                {this.state.game ? (
                  <Button bsStyle="danger" className="pull-left" onClick={ this.handleRemoveGame.bind(this) }>Delete Game</Button>
                ) : ( <div /> )}
                <Button onClick={ () => this.setState({ showModal: false }) }>Close</Button>
              </Modal.Footer>
            </Modal>
        </div>
      ) : (
        <Loading />
      )
    );
  }
}

EventEditorGames.propTypes = {
  event: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  games: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default createContainer(({ event, history }) => {
  const subscription = Meteor.subscribe('games.event', event._id);
   
  return{
    event: event,
    loading: !subscription.ready(),
    games: GamesCollection.find({ eventId: event._id }, { sort: { order: 1 }}).fetch(),
  };
}, EventEditorGames);