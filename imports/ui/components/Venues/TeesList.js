/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup, Button, Row, Col, Modal, Glyphicon, Table } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import TeesCollection from '../../../api/Tees/Tees';
import HolesCollection from '../../../api/Holes/Holes';
import TeeBox from './TeeBox';
import HolesList from './HolesList';
import ScorecardHeader from './ScorecardHeader';
import ScorecardTee from './ScorecardTee';
import { GithubPicker } from 'react-color';
import reactCSS from 'reactcss'

const lookupColorName = (hex) => {
  switch (hex.toLowerCase()) {
    case "#ff0000":
      return "Red";
    case "#0000ff":
      return "Blue";
    case "#ffffff":
      return "White";
    case "#ffd700":
      return "Gold";
    case "#008000":
      return "Green";
    case "#000000":
    default:
      return "Black";
  }
}

class TeesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tee: undefined,
      color: 'Black',
      displayColorPicker: false,
      showModal: false,
    };

  }

  handleDeleteTee(e) {
    e.preventDefault();

    const teeId = this.state.tee._id;

    Meteor.call('tees.remove', teeId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Tee removed!', 'success');
      }
    });

    this.setState({ 
      tee: undefined,
      showModal: false,
    });
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color) => {
    const { venue } = this.props;
    this.setState({ color: color.hex })

    const newTee = {
      color: lookupColorName(color.hex),
      venueId: venue._id,
      venueName: venue.name
    };

    Meteor.call('tees.insert', newTee, (error, newTeeId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Tee added!', 'success');
        this.setState({
          tee: newTeeId,
          displayColorPicker: false,
        });
      }
    });
  };
 
  render() {
    const { venue, tees, loading } = this.props;
    const colors=['Black', 'Blue', 'White', 'Gold', 'Green', 'Red'];
    const styles = reactCSS({
      'default': {
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });
  
    return (
      <div>
        <h4>Tee Boxes
          <Button bsStyle="link" onClick={this.handleClick }><Glyphicon glyph='plus' /></Button>
          { this.state.displayColorPicker ? 
            <div style={ styles.popover }>
              <div style={ styles.cover } onClick={ this.handleClose }/>
              <GithubPicker color={ this.state.color } 
                            colors={ colors }
                            onChange={ this.handleChange } 
                            triangle="hide"
                            />
            </div> : null 
          }
        </h4>

        <Table>
          <ScorecardHeader />
          {tees.map((tee) => (
            <ScorecardTee key={tee._id} teeId={tee._id} onClick={ () => this.setState({ showModal: true, tee: tee }) }/>
          ))}
        </Table>

        <Modal show={ this.state.showModal } onHide={ () => this.setState({ showModal: false }) }>
          <Modal.Header closeButton>
            <Modal.Title>
              {this.state.tee ? (
                <div>
                  <TeeBox color={this.state.tee.color} />&nbsp;&nbsp;&nbsp;&nbsp;Hole Editor
                </div>
              ) : (
                <div />
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.tee ? (
              <HolesList tee={this.state.tee} />
             ) : ( <div />)}
          </Modal.Body>
          <Modal.Footer>
            {this.state.tee ? (
              <Button bsStyle="danger" className="pull-left" onClick={ this.handleDeleteTee.bind(this) }>Delete Tee</Button>
            ) : ( <div /> )}
            <Button onClick={ () => this.setState({ showModal: false }) }>Close</Button>
          </Modal.Footer>
        </Modal>

      </div>

    )
  }
}

TeesList.propTypes = {
  venue: PropTypes.object.isRequired,
  tees: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default createContainer(({venue}) => {
  const subscription = Meteor.subscribe('tees.venue', venue._id);

  return {
    venue: venue,
    tees: TeesCollection.find({ venueId: venue._id }).fetch(),
    loading: !subscription.ready(),
  };
}, TeesList);



