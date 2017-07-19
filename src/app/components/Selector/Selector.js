import React from 'react';

export default ({ onChange, defaultValue, options, disabled = [] }) => (
  <select onChange={onChange} defaultValue={defaultValue}>
    <option value={''}>all</option>
    {options.map((item) => (
      <option
        value={ item._id || item }
        key={ item._id || item }
        disabled={ disabled.indexOf(item._id || item) > -1 }
      >
        { item.name || item }
      </option>
    ))}
  </select>
);
