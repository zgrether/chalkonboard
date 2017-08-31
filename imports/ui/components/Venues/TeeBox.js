/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const TeeBox = ({ color, onClick }) => (
  <Button  onClick={ onClick } 
           style={{
                    'background': color,
                     'width': '36px',
                     'height': '32px',
                     'borderRadius': '2px'
                  }}
  />
);

TeeBox.propTypes = {
  color: PropTypes.string,
};

export default TeeBox;