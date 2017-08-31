import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Alert } from 'react-bootstrap';
import GamesCollection from '../../../api/Games/Games';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
import GameHeader from '../../components/Games/GameHeader';
import GameScoreboard from '../../components/Games/GameScoreboard';

class EditGame extends React.Component {

  render() {

    const { loading, game, history } = this.props;

    return (
      !loading && game ? (
          <div className="EditGame">
            <GameHeader game={game} history={history} editing={true} />
            <GameScoreboard game={ game } history={ history } editing={ true }/>
          </div>
        ) : (
          <Alert bsStyle="warning">This game is not available</Alert>
        )
    );
  }
}

EditGame.propTypes = {
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
}, EditGame);
