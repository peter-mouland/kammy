import React from 'react';

export default ({ onChange, defaultValue, options }) => (
  <select onChange={onChange} defaultValue={defaultValue}>
    <option value={''}>all</option>
    {options.map((item) => (
      <option value={ item._id || item } key={ item._id || item }>
        { item.name || item }
      </option>
    ))}
  </select>
);
