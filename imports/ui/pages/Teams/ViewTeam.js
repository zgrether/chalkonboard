import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Alert } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import TeamsCollection from '../../../api/Teams/Teams';
import Loading from '../../components/Loading/Loading';
import TeamEditor from '../../components/Teams/TeamEditor';

class ViewTeam extends React.Component {

  render() {

    const { loading, team } = this.props;

    return (
      !loading && team ? (
        <div className="ViewTeam">
          <PageHeader>
            {team.name} <small>{team.abbrv}</small>
          </PageHeader>
  
          <TeamEditor team={team} />

        </div>
      ) : ( 
        <Alert bsStyle="warning">This player is not available</Alert>          
      )
    );
  }
}  

ViewTeam.propTypes = {
  loading: PropTypes.bool.isRequired,
  team: PropTypes.object,
};

export default createContainer(({ match }) => {
  const teamId = match.params._id;
  const subscription = Meteor.subscribe('teams.view', teamId);

  return {
    loading: !subscription.ready(),
    team: TeamsCollection.findOne(teamId),
  };
}, ViewTeam);
