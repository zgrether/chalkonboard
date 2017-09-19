/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Table, Alert, Button } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import TeamsCollection from '../../../api/Teams/Teams';
import Loading from '../Loading/Loading';
import TeamAdd from './TeamAdd';

const handleRemoveTeam = (teamId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('teams.remove', teamId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Team deleted!', 'success');
      }
    });
  }
}

class TeamManager extends React.Component {
  
  render() {
    const { loading, teams, history } = this.props;

    return (
      !loading ? (
        <div className="TeamManager">
          <h3>My Teams</h3>
          
          <TeamAdd />

          {teams.length ? 
            <Table condensed striped>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Abbreviation</th>
                  <th>Details</th>
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
                        onClick={() => history.push(`/teams/${team._id}`) }
                        block
                      >Edit</Button>
                    </td>
                    <td>
                      <Button 
                        bsStyle="link" 
                        onClick={ () => handleRemoveTeam(team._id) }
                      >Delete</Button>
                    </td>                          
                  </tr>
                ))}
              </tbody>
            </Table> : <Alert bsStyle="warning">No teams yet!</Alert>}
        </div>
      ) : (
        <Loading />
      )
    );
  }
}

TeamManager.propTypes = {
  loading: PropTypes.bool.isRequired,
  teams: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('teams');
  
  return{
    loading: !subscription.ready(),
    teams: TeamsCollection.find().fetch(),
  };
}, TeamManager);