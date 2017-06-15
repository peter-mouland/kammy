import React from 'react';

const Error = ({ error }) => <div>
  <p>Error Loading seasons!</p>
  <p>{ error.message }</p>
</div>;

export default ({ errors }) => <div>
  {errors.map((error, i) => <Error error={error} key={i} />)}
</div>;
