import React from 'react';

import Svg from '../Svg/Svg';
import football from '../../../assets/football.svg';

import './interstitial.scss';

const defaultMessage = 'Please wait';

const Interstitial = ({ children, message }) => (
  <div className="interstitial">
    <Svg markup={football} />
    { children || message || defaultMessage }...
  </div>
);

export default Interstitial;
