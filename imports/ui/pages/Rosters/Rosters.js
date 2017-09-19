/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Table, Alert, Button } from 'react-bootstrap';
import PlayerManager from '../../components/Players/PlayerManager';
import TeamManager from '../../components/Teams/TeamManager';

class Rosters extends React.Component {
  
  render() {

    return (
      <div className="Rosters">
        <PageHeader>
          Roster Manager
        </PageHeader>
        
        <PlayerManager />

        <TeamManager />
     
      </div>
    );
  }
}

export default Rosters;