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
          <section>
            <h2 key={division.name}>{division.name}</h2>
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
                  <tr>
                    <td>{team.name} {team.user.name}</td>
                    <td>{team.gk.points || 0}</td>
                    <td>{team.cbright.points || 0}</td>
                    <td>{team.fbright.points || 0}</td>
                    <td>{team.cmright.points || 0}</td>
                    <td>{team.wmright.points || 0}</td>
                    <td>{team.strright.points || 0}</td>
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
