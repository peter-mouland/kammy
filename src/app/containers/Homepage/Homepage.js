import React from 'react';
import debug from 'debug';

debug('kammy:Homepage.jsx');

export default class Homepage extends React.Component {

  render() {
    return (
      <div id="homepage">
        <banner className="header">
          <h1>Home page!</h1>
        </banner>
      </div>
    );
  }
}
