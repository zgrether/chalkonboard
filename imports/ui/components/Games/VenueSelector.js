/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import CourseSelector from './CourseSelector';

class VenueSelector extends React.Component {

render() {
  const { game } = this.props;
  
  return (
    <div className="VenueSelector">
      {game.type == "Golf" ? (
        <CourseSelector game={game}/>  
      ) : (
        null
      )}
    </div>
    );
  }
}

VenueSelector.propTypes = {
  game: PropTypes.object
};

export default VenueSelector;
  