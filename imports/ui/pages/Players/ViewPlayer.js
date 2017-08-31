import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Alert } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import PlayersCollection from '../../../api/Players/Players';
import Loading from '../../components/Loading/Loading';
import PlayerEditor from '../../components/Players/PlayerEditor';

class ViewPlayer extends React.Component {

  render() {

    const { loading, player } = this.props;

    return (
      !loading && player ? (
        <div className="ViewPlayer">
          <PageHeader>
            {player.name} <small>{player.email}</small>
          </PageHeader>
  
          <PlayerEditor player={player} />

        </div>
      ) : ( 
        <Alert bsStyle="warning">This player is not available</Alert>          
      )
    );
  }
}  

ViewPlayer.propTypes = {
  loading: PropTypes.bool.isRequired,
  player: PropTypes.object,
};

export default createContainer(({ match }) => {
  const playerId = match.params._id;
  const subscription = Meteor.subscribe('players.view', playerId);

  return {
    loading: !subscription.ready(),
    player: PlayersCollection.findOne(playerId),
  };
}, ViewPlayer);
