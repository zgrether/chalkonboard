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

const handleRemoveFromTeam = (playerId, teamId) => {
  Meteor.call('players.removeTeam', playerId, teamId, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Player removed', 'success');
    }
  });
}

class RosterEditor extends React.Component {

  render() {
    const { eventId, team, playersOnTeam, playersNotOnTeam } = this.props;
 
    return (

        <div>
          <PlayerSelectTeam eventId={eventId} teamId={team._id} teamName={team.name} playersNotOnTeam={playersNotOnTeam}/>

          { playersOnTeam.length ?
            <Table condensed striped>
              <thead>
                <tr>
                  <th>Current Players</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {playersOnTeam.map((player) => (
                  <tr key={player._id}>
                    <td>{player.name}</td>
                    <td>
                      <Button
                        bsStyle="link"
                        onClick={ () => handleRemoveFromTeam(player._id, team._id)}
                        block
                      >Remove</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table> : <Alert bsStyle="warning">No players yet!</Alert>
          }
        </div>

    );
  }
}

RosterEditor.propTypes = {
  eventId: PropTypes.string,
  team: PropTypes.object,
  playersOnTeam: PropTypes.arrayOf(PropTypes.object).isRequired,
  playersNotOnTeam: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default createContainer(({ eventId, team }) => {

  return {
    eventId: eventId,
    team: team,
    playersOnTeam: Players.find({'events.eventId': eventId, 'events.teamId': team._id}).fetch(),
    playersNotOnTeam: Players.find({'events.eventId': eventId, 'events.teamId': { $ne: team._id}}).fetch(),
  };
}, RosterEditor);