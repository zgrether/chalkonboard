     
     /* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { createContainer } from 'meteor/react-meteor-data';
import TeesCollection from '../../../api/Tees/Tees';
import HolesCollection from '../../../api/Holes/Holes';
import TeeBox from './TeeBox';

class ScorecardTee extends React.Component {

  render() {
    
    const { tee, holes, loading, onClick } = this.props;

    return (
     
     <tbody>
        <tr>
          <td rowSpan="2"><TeeBox color={tee.color} onClick={onClick}/></td>
          {holes[0] ? (<td>{holes[0].par}</td>) : (<td>0</td>)}
          {holes[1] ? (<td>{holes[1].par}</td>) : (<td>0</td>)}
          {holes[2] ? (<td>{holes[2].par}</td>) : (<td>0</td>)}
          {holes[3] ? (<td>{holes[3].par}</td>) : (<td>0</td>)}
          {holes[4] ? (<td>{holes[4].par}</td>) : (<td>0</td>)}
          {holes[5] ? (<td>{holes[5].par}</td>) : (<td>0</td>)}
          {holes[6] ? (<td>{holes[6].par}</td>) : (<td>0</td>)}
          {holes[7] ? (<td>{holes[7].par}</td>) : (<td>0</td>)}
          {holes[8] ? (<td>{holes[8].par}</td>) : (<td>0</td>)}
          <td>{tee.frontpar}</td>
          {holes[9] ? (<td>{holes[9].par}</td>) : (<td>0</td>)}
          {holes[10] ? (<td>{holes[10].par}</td>) : (<td>0</td>)}
          {holes[11] ? (<td>{holes[11].par}</td>) : (<td>0</td>)}
          {holes[12] ? (<td>{holes[12].par}</td>) : (<td>0</td>)}
          {holes[13] ? (<td>{holes[13].par}</td>) : (<td>0</td>)}
          {holes[14] ? (<td>{holes[14].par}</td>) : (<td>0</td>)}
          {holes[15] ? (<td>{holes[15].par}</td>) : (<td>0</td>)}
          {holes[16] ? (<td>{holes[16].par}</td>) : (<td>0</td>)}
          {holes[17] ? (<td>{holes[17].par}</td>) : (<td>0</td>)}
          <td>{tee.backpar}</td>
          <td>{tee.totalpar}</td>
        </tr>
        <tr>
          {holes[0] ? (<td>{holes[0].yds}</td>) : (<td>0</td>)}
          {holes[1] ? (<td>{holes[1].yds}</td>) : (<td>0</td>)}
          {holes[2] ? (<td>{holes[2].yds}</td>) : (<td>0</td>)}
          {holes[3] ? (<td>{holes[3].yds}</td>) : (<td>0</td>)}
          {holes[4] ? (<td>{holes[4].yds}</td>) : (<td>0</td>)}
          {holes[5] ? (<td>{holes[5].yds}</td>) : (<td>0</td>)}
          {holes[6] ? (<td>{holes[6].yds}</td>) : (<td>0</td>)}
          {holes[7] ? (<td>{holes[7].yds}</td>) : (<td>0</td>)}
          {holes[8] ? (<td>{holes[8].yds}</td>) : (<td>0</td>)}
          <td>{tee.frontyds}</td>
          {holes[9] ? (<td>{holes[9].yds}</td>) : (<td>0</td>)}
          {holes[10] ? (<td>{holes[10].yds}</td>) : (<td>0</td>)}
          {holes[11] ? (<td>{holes[11].yds}</td>) : (<td>0</td>)}
          {holes[12] ? (<td>{holes[12].yds}</td>) : (<td>0</td>)}
          {holes[13] ? (<td>{holes[13].yds}</td>) : (<td>0</td>)}
          {holes[14] ? (<td>{holes[14].yds}</td>) : (<td>0</td>)}
          {holes[15] ? (<td>{holes[15].yds}</td>) : (<td>0</td>)}
          {holes[16] ? (<td>{holes[16].yds}</td>) : (<td>0</td>)}
          {holes[17] ? (<td>{holes[17].yds}</td>) : (<td>0</td>)}
          <td>{tee.backyds}</td>
          <td>{tee.totalyds}</td>
        </tr>
      </tbody>
            
    );
  }
}


ScorecardTee.propTypes = {
  tee: PropTypes.object,
  holes: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  onClick: PropTypes.func,
}

export default createContainer(({ teeId }) => {
  const holeSub = Meteor.subscribe('holes.tee', teeId);
  const teeSub = Meteor.subscribe('tees.view', teeId);

  return {
    tee: TeesCollection.findOne(teeId),
    holes: HolesCollection.find({ teeId: teeId }, { sort: { order: 1 }}).fetch(),
    loading: !(holeSub.ready() && teeSub.ready()),
  };
}, ScorecardTee);
