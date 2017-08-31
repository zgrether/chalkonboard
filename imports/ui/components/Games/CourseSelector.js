/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, FormGroup, FormControl, Button, ControlLabel, Col, Checkbox } from 'react-bootstrap';
import TeesCollection from '../../../api/Tees/Tees';
import { createContainer } from 'meteor/react-meteor-data';
import Loading from '../Loading/Loading';

import validate from '../../../modules/validate';

class CourseSelector extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        teeId: { required: true },
      },
      messages: { 
        teeId: { required: 'This needs a tee' },
      },
      submitHandler() {
        component.handleSubmit();
      },
    });
  }

  handleSubmit() {
    const { game } = this.props;
    const gameId = game._id;

    const updateGame = {
      _id: gameId,
      teeId: document.querySelector(`[name="teeId"]`).value,
    };

    Meteor.call('games.updatetee', updateGame, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Game updated!', 'success');
      }
    });
  }

  render() {
    const { loading, tees, game } = this.props;

    return (
      !loading ? (
        <form ref={form => (this.form = form) } onSubmit={ e => e.preventDefault() }> 
          <FormGroup>
            <ControlLabel>Golf Course Tee Selection</ControlLabel>
            {tees.length > 0 && (
            <FormControl componentClass="select" name="teeId" defaultValue={game.teeId} onChange={ this.handleSubmit.bind(this) }>
                <option value="none">No Tee Selected</option>
                { tees ? tees.map((tee) => (
                  <option value={tee._id} key={tee._id}>{tee.venueName} | {tee.color}</option>
                )) : (
                  <option value="No Tees Available">No Tees Available</option>
                )}
            </FormControl>
            )}
          </FormGroup>
        </form>
      ) : ( 
        <Loading /> 
      )
    );
  }
}

CourseSelector.propTypes = {
  loading: PropTypes.bool.isRequired,
  tees: PropTypes.arrayOf(PropTypes.object).isRequired,
  game: PropTypes.object,
};

export default createContainer(({game}) => {
  const subscription = Meteor.subscribe('tees');

  return {
    loading: !subscription.ready(),
    tees: TeesCollection.find().fetch(),
    game: game,
  };
}, CourseSelector);