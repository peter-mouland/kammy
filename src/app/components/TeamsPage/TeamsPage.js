import React from 'react';
// import PropTypes from 'prop-types';
import debug from 'debug';
import bemHelper from 'react-bem-helper';

import './teamsPage.scss';

const bem = bemHelper({ name: 'teams-page' });
debug('kammy:myteam.component');

export default () => (
  <div { ...bem() } id="teams-page">
    <h1>Teams</h1>
  </div>
);
