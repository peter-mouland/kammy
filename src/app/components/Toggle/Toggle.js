import React from 'react';
import bemHelper from 'react-bem-helper';

import './toggle.scss';

const bem = bemHelper({ name: 'toggle' });

export default ({
  id, checked, children, label, className, ...props
}) => (
  <span className={className || ''}>
    <input
      { ...bem(null, 'ios') }
      id={ id }
      type="checkbox"
      defaultChecked={ checked }
      { ...props }
    />
    <label { ...bem('label') } htmlFor={ id } >
      {label || children}
      <span { ...bem('btn') } />
    </label>
  </span>
);
