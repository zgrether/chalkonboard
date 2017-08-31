/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem, Button, Glyphicon, Row, Col, Table } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import Sortable from 'react-sortablejs';
import { Meteor } from 'meteor/meteor';
import GamesCollection from '../../../api/Games/Games';
import Loading from '../../components/Loading/Loading';
import PointsAdd from './PointsAdd';
import PointsCollection from '../../../api/Points/Points';

const deletePoint = (pointId) => {
  Meteor.call('points.remove', pointId, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Point removed!', 'success');
    }
  })
}

class GameEditorPoints extends React.Component {
  updatePointOrder = (items) => {
    items.forEach((_id, order) => {
      Meteor.call('points.update', { _id, order }, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        }
      });
    });
  };

  render() {
    const { points, loading, game } = this.props;
    const nameStyle = { verticalAlign: 'middle' };
    
    return (    
      <div>
        <Row>
          <PointsAdd gameId={game._id} /> 
        </Row>
        
        {!loading ? ( 
          <Row>
            <Col xs={ 12 } md={ 12 }>
              <Sortable onChange={ this.updatePointOrder.bind(this) }>
                {points.map((point) => (
                  <ListGroupItem key={ point._id } data-id={ point._id } style={nameStyle}>
                    <Glyphicon glyph="align-justify" />
                    &nbsp;&nbsp;&nbsp;&nbsp;Finishing Place: { point.order+1 }&nbsp;&nbsp;&nbsp;
                    <Glyphicon glyph="menu-right" />
                    &nbsp;&nbsp;&nbsp;Awarded: { point.awarded } Points
                    <Button
                        bsStyle="link"
                        className="pull-right"
                        style={{"marginTop":"-7px"}}
                        onClick={ () => deletePoint(point._id) }              
                      >Delete</Button>
                  </ListGroupItem>
                ))}
              </Sortable>
            </Col>
          </Row>
        ) : ( null )}
      </div>
    );
  }
}

GameEditorPoints.propTypes = {
  points: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  game: PropTypes.object.isRequired,
};

export default createContainer(({ game }) => {
  const subscription = Meteor.subscribe('points.gameId', game._id);
  
  return {
    points: PointsCollection.find({ gameId: game._id }, { sort: { order: 1 }}).fetch(),
    loading: !subscription.ready(),
    game: game,
  };
}, GameEditorPoints);