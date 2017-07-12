import React from 'react';
import bemHelper from 'react-bem-helper';

import Errors from '../Errors/Errors';
import Interstitial from '../Interstitial/Interstitial';

import './divisions-page.scss';

const bem = bemHelper({ name: 'divisions' });

const additionalPoints = (points) => (
  points > -1 ? `+${points}` : points
);

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
            <table { ...bem('table')} cellPadding={0} cellSpacing={0} >
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
                    <td><span { ...bem('point')}>{team.total.gk} <span { ...bem('additional-point')}>{additionalPoints(team.gameWeek.gk)}</span></span></td>
                    <td><span { ...bem('point')}>{team.total.cb} <span { ...bem('additional-point')}>{additionalPoints(team.gameWeek.cb)}</span></span></td>
                    <td><span { ...bem('point')}>{team.total.fb} <span { ...bem('additional-point')}>{additionalPoints(team.gameWeek.fb)}</span></span></td>
                    <td><span { ...bem('point')}>{team.total.cm} <span { ...bem('additional-point')}>{additionalPoints(team.gameWeek.cm)}</span></span></td>
                    <td><span { ...bem('point')}>{team.total.wm} <span { ...bem('additional-point')}>{additionalPoints(team.gameWeek.wm)}</span></span></td>
                    <td><span { ...bem('point')}>{team.total.str} <span { ...bem('additional-point')}>{additionalPoints(team.gameWeek.str)}</span></span></td>
                    <td><span { ...bem('point')}>{team.total.points} <span { ...bem('additional-point')}>{additionalPoints(team.gameWeek.points)}</span></span></td>
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
