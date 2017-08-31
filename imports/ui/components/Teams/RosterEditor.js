/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Table, FormGroup, InputGroup, FormControl, Button, DropdownButton, MenuItem, Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { createContainer } from 'meteor/react-meteor-data';
import Players from '../../../api/Players/Players';
import PlayerSelectTeam from '../Players/PlayerSelectTeam';
import validate from '../../../modules/validate';
import Loading from '../Loading/Loading';

const handleRemoveFromTeam = (playerId) => {
  const updatePlayer = {
    _id: playerId,
    teamId: "",
    teamName: "",
  };

  Meteor.call('players.updateteam', updatePlayer, (error, playerId) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Player added', 'success');
    }
  });
}

class RosterEditor extends React.Component {

  render() {
    const nameStyle = { verticalAlign: 'middle', textAlign: 'left', width: 200 };
    const narrowStyle = { verticalAlign: 'middle', textAlign: 'center', width: 10 };   
    const { eventId, team, loading, playersOnTeam, playersNotOnTeam } = this.props;

    return (
      !loading ? (
        <div>
          <PlayerSelectTeam eventId={eventId} teamId={team._id} teamName={team.name}/>

          { playersOnTeam.length ?
            <Table condensed striped>
              <thead>
                <tr>
                  <th style={ nameStyle }>Current Players</th>
                  <th style={ narrowStyle }></th>
                </tr>
              </thead>
              <tbody>
                {playersOnTeam.map((player) => (
                  <tr key={player._id}>
                    <td style={ nameStyle }>{player.name}</td>
                    <td style={ narrowStyle }>
                      <Button
                        bsStyle="link"
                        onClick={ () => handleRemoveFromTeam(player._id)}
                        block
                      >Remove</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table> : <Alert bsStyle="warning">No players yet!</Alert>
          }
        </div>
      ) : (
        <Loading />
      )
    );
  }
}

RosterEditor.propTypes = {
  eventId: PropTypes.string,
  teamId: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  playersOnTeam: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default createContainer(({ eventId, team }) => {
  const subscription = Meteor.subscribe('players.event', eventId);

  return {
    eventId: eventId,
    team: team,
    loading: !subscription.ready(),
    playersOnTeam: Players.find({teamId: team._id}).fetch(),
  };
}, RosterEditor);