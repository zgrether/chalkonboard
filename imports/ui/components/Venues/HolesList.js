/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, ListGroupItem, Glyphicon, Row, Col } from 'react-bootstrap';
import Sortable from 'react-sortablejs';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { createContainer } from 'meteor/react-meteor-data';
import HolesCollection from '../../../api/Holes/Holes';
import HolesAdd from './HolesAdd';
import TeeSummary from './TeeSummary';

const deleteHole = (holeId) => {
  Meteor.call('holes.remove', holeId, (error, holesLeft) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Hole removed!', 'success');
    }
  });
}
  
class HolesList extends React.Component {
  updateHoleOrder = (items) => {
    items.forEach((_id, order) => {
      Meteor.call('holes.update', { _id, order }, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        }
      });
    });
  };

  render() {
    
    const { holes, loading, tee } = this.props;
    const verticalAlign = {
      verticalAlign: 'top',
    };

    return (
        
        <div>    
          <Row>
            <Col xs={3} md={3} />
            <Col xs={6} md={6}><TeeSummary teeId={tee._id} /></Col>
            <Col xs={3} md={3} />
          </Row>
          <Row>
            <HolesAdd teeId={tee._id} />
          </Row>

          <Sortable onChange={ this.updateHoleOrder.bind(this) }>  
            {holes.map((hole) => (
              <ListGroupItem key={ hole._id } data-id={ hole._id }>
                <Glyphicon glyph="align-justify" />
                &nbsp;&nbsp;&nbsp;&nbsp;Hole: { hole.order+1 }&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;Par: { hole.par }&nbsp;&nbsp;&nbsp;&nbsp;|
                &nbsp;&nbsp;&nbsp;&nbsp;Yards: { hole.yds }
                <Button
                    bsStyle="link"
                    className="pull-right"
                    style={{"marginTop":"-7px"}}
                    onClick={ () => deleteHole(hole._id) }              
                  >Delete
                </Button>
              </ListGroupItem>
            ))}
          </Sortable> 

        </div>
    );
  }
}

HolesList.propTypes = {
  holes: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  tee: PropTypes.object.isRequired,
}

export default createContainer(({ tee }) => {
  const subscription = Meteor.subscribe('holes.tee', tee._id);
 
  return {
    holes: HolesCollection.find({ teeId: tee._id }, { sort: { order: 1 }}).fetch(),
    loading: !subscription.ready(),
    tee: tee,
  };
}, HolesList);
