import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { PageHeader, Button, Table, ButtonGroup, Modal, Alert } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import GamesCollection from '../../../api/Games/Games';
import GameHeader from '../../components/Games/GameHeader';
import GameScoreboard from '../../components/Games/GameScoreboard';

class ViewGame extends React.Component {

  render() {
    
    const { loading, game, history } = this.props;

    return (
      !loading && game ? (
        <div className="ViewGame">
          <GameHeader game={game} history={history} />
          <GameScoreboard game={game}/>
        </div>
      ) : (
        <Alert bsStyle="warning">This game is not available</Alert>
      )
    );
  }
}

ViewGame.propTypes = {
  loading: PropTypes.bool.isRequired,
  game: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const gameId = match.params._id;
  const subscription = Meteor.subscribe('games.view', gameId);

  return {
    loading: !subscription.ready(),
    game: GamesCollection.findOne(gameId),
  };
}, ViewGame);
