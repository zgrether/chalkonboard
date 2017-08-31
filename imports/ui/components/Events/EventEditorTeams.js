/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Table, Alert, Button, FormControl, InputGroup, Row, Col, Modal} from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import TeamsCollection from '../../../api/Teams/Teams';
import Loading from '../../components/Loading/Loading';
import TeamAdd from '../Teams/TeamAdd';
import TeamSettings from '../Teams/TeamSettings';
import RosterEditor from '../Teams/RosterEditor';

class EventEditorTeams extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      team: undefined,
      showModal: false,
    };
  }

  handleRemoveTeam(e) {
    e.preventDefault();

    const teamId = this.state.team._id;

    Meteor.call('teams.remove', teamId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Team deleted!', 'success');
      }
    });

    this.setState({
      team: undefined,
      showModal: false
    });
  }
  
  render() {
    const nameStyle = { verticalAlign: 'middle', textAlign: 'left', width: 200 };
    const narrowStyle = { verticalAlign: 'middle', textAlign: 'center', width: 50 };   
    const { eventId, loading, teams } = this.props;

    return (
      !loading ? (
        <div className="EventEditorTeams">
          <PageHeader>
            <TeamAdd eventId={eventId} />
          </PageHeader>

          {teams.length ? 
          <Table condensed striped>
            <thead>
              <tr>
                <th style={ nameStyle }>Name</th>
                <th style={ narrowStyle }></th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team._id}>
                  <td style={ nameStyle }>{team.name}</td>
                  <td style={ narrowStyle }>
                    <Button
                      bsStyle="primary"
                      onClick={ () => this.setState({ showModal: true, team: team }) }     
                      block         
                    >Manage</Button>
                  </td>              
                </tr>
              ))}
            </tbody>
          </Table> : <Alert bsStyle="warning">No teams yet!</Alert>}
              
          <Modal show={ this.state.showModal } onHide={ () => this.setState({ showModal: false }) }>
            <Modal.Body>
              {this.state.team ? (
                <div>
                  <TeamSettings team={ this.state.team } /> 
                  <RosterEditor eventId={ eventId } team={ this.state.team } /> 
                </div>
              ) : ( <div /> )}
            </Modal.Body>
            <Modal.Footer>
              {this.state.team ? (
                <Button bsStyle="danger" className="pull-left" onClick={ this.handleRemoveTeam.bind(this) }>Delete Team</Button>
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

EventEditorTeams.propTypes = {
  eventId: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  teams: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default createContainer(({ event }) => {
  const subscription = Meteor.subscribe('teams.event', event._id);
  
  return{
    eventId: event._id,
    loading: !subscription.ready(),
    teams: TeamsCollection.find().fetch(),
  };
}, EventEditorTeams);