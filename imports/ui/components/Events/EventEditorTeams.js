/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Table, Alert, Button, FormControl, InputGroup, Row, Col, Modal} from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import TeamsCollection from '../../../api/Teams/Teams';
import Loading from '../../components/Loading/Loading';
import TeamAdd from '../Teams/TeamAdd';
import TeamEditor from '../Teams/TeamEditor';
import RosterEditor from '../Teams/RosterEditor';
import TeamSelectEvent from '../Teams/TeamSelectEvent';

const handleRemove = (teamId, eventId) => {

  Meteor.call('teams.quitEvent', teamId, eventId, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Team removed!', 'success');
    }
  });
};

class EventEditorTeams extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      team: undefined,
      showModal: false,
    };
  }
  
  render() {
    const { event, loading, teams } = this.props;

    return (
      !loading ? (
        <div className="EventEditorTeams">
          
          <br />

          <TeamSelectEvent eventId={event._id} />

          {teams.length ? 
          <Table condensed striped>
            <thead>
              <tr>
                <th>Name</th>
                <th>Abbreviation</th>
                <th>Rosters</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team._id}>
                  <td>{team.name}</td>
                  <td>{team.abbrv}</td>
                  <td>
                    <Button
                      bsStyle="primary"
                      onClick={ () => this.setState({ showModal: true, team: team }) }     
                      block         
                    >Manage</Button>
                  </td>  
                  <td>
                  <Button
                    bsStyle="link"
                    onClick={() => handleRemove(team._id, event._id)}
                    block
                  >Remove</Button>
                </td>            
                </tr>
              ))}
            </tbody>
          </Table> : <Alert bsStyle="warning">No teams yet!</Alert>}
              
          <Modal show={ this.state.showModal } onHide={ () => this.setState({ showModal: false }) }>
            <Modal.Header>
              Manage Roster
            </Modal.Header>
            <Modal.Body>
              {this.state.team && (
                <RosterEditor eventId={ event._id } team={ this.state.team } /> 
              )}
            </Modal.Body>
            <Modal.Footer>
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

EventEditorTeams.propTypes = {
  event: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  teams: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default createContainer(({ event }) => {
  const subscription = Meteor.subscribe('teams.event', event._id);
  
  return{
    event: event,
    loading: !subscription.ready(),
    teams: TeamsCollection.find({ 'events.eventId': event._id }).fetch(),
  };
}, EventEditorTeams);