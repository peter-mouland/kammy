import React from 'react';
import bemHelper from 'react-bem-helper';

import './multi-toggle.scss';

const bem = bemHelper({ name: 'multi-toggle' });

export default ({
  id, checked, options = [], label, className, onChange, ...props
}) => (
  <span {...bem(null, null, className)} id={ id } { ...props }>
    {label && <span {...bem('label')}>{label}</span>}
    <span {...bem('group')} id={ id } { ...props }>
      {
        options.map((option, i) => (
          <div { ...bem('option') } key={ `${id}-${i}` }>
            <input
              checked={checked === option}
              id={ `${id}-${i}` }
              name={ id }
              type={'radio'}
              value={option}
              onChange={ onChange }
            />
            <label htmlFor={ `${id}-${i}` }>{option}</label>
          </div>
        ))
      }
    </span>
  </span>
);
