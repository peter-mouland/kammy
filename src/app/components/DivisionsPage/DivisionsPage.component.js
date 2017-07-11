import React from 'react';
import bemHelper from 'react-bem-helper';

import Errors from '../Errors/Errors';
import Interstitial from '../Interstitial/Interstitial';

const bem = bemHelper({ name: 'divisions' });

export default class DivisionsPage extends React.Component {
  componentDidMount() {
    if (this.props.divisions) return;
    this.props.fetchDivisions();
  }

  render() {
    const { errors = [], loading, divisions } = this.props;
    if (errors.length) {
      return <Errors errors={errors} />;
    } else if (loading || !divisions) {
      return <Interstitial />;
    }
    if (!divisions.length) {
      return (
        <div id="divisions-page">
          <p>
            There seem to be no divisions, Please speak to your administrator to set some up.
          </p>
        </div>
      );
    }
    return (
      <div {...bem()} id="divisions-page">
        <h1>Divisions</h1>
        {divisions.map((division) => (
          <section className="page-content" key={division.name}>
            <h2>{division.name}</h2>
            <table>
              <thead>
                <tr>
                  <th>Team</th>
                  <th>GK/S</th>
                  <th>CB</th>
                  <th>FB</th>
                  <th>CM</th>
                  <th>WM</th>
                  <th>FWD</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {division.teams.map((team) => (
                  <tr key={`${team.name}-${team.user.name}`}>
                    <td>{team.name} {team.user.name}</td>
                    <td>{team.gameWeek.gk}</td>
                    <td>{team.gameWeek.cbright}</td>
                    <td>{team.gameWeek.fbright}</td>
                    <td>{team.gameWeek.cmright}</td>
                    <td>{team.gameWeek.wmright}</td>
                    <td>{team.gameWeek.strright}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </div>
    );
  }
}
