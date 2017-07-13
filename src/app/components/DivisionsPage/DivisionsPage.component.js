import React from 'react';
import bemHelper from 'react-bem-helper';

import Errors from '../Errors/Errors';
import Interstitial from '../Interstitial/Interstitial';
import MultiToggle from '../MultiToggle/MultiToggle';

import './divisions-page.scss';

const bem = bemHelper({ name: 'divisions' });

function AdditionalPoints({ children: points }) {
  if (points === 0) {
    return null;
  }
  return (
    <span { ...bem('additional-point')}>
      {
        points > -1
          ? <span className="text--success">+{points}</span>
          : <span className="text--error">{points}</span>
      }
    </span>
  );
}

export default class DivisionsPage extends React.Component {
  state = {
    pointsOrRank: 'Points'
  }

  togglePointsOrStats = (e) => {
    this.setState({
      pointsOrRank: e.target.value
    });
  }

  render() {
    const { errors = [], loading, divisions } = this.props;
    const { pointsOrRank } = this.state;
    const totals = pointsOrRank === 'Rank' ? 'seasonRank' : 'total';
    const gameweek = pointsOrRank === 'Rank' ? 'gameWeekRank' : 'gameWeek';
    const positions = ['gk', 'fb', 'cb', 'wm', 'cm', 'str'];

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
        <section {...bem('config', null, 'page-content')}>
          <MultiToggle
            label="Options:"
            {...bem('points-or-rank')}
            checked={ pointsOrRank }
            id={'points-or-stats'}
            onChange={ this.togglePointsOrStats }
            options={['Points', 'Rank']}
          />
        </section>
        {divisions.map((division) => (
          <section className="page-content" key={division.name}>
            <h2>{division.name}</h2>
            <table { ...bem('table')} cellPadding={0} cellSpacing={0} >
              <thead>
                <tr>
                  <th>Team</th>
                  <th>GK/S</th>
                  <th>FB</th>
                  <th>CB</th>
                  <th>WM</th>
                  <th>CM</th>
                  <th>FWD</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {division.teams.map((team) => (
                  <tr key={`${team.name}-${team.user.name}`}>
                    <td>{team.name} {team.user.name}</td>
                    {positions.map((pos) => (
                      <td key={pos}>
                        <span { ...bem('point')}>
                          {team[totals][pos]}
                          <AdditionalPoints>{team[gameweek][pos]}</AdditionalPoints>
                        </span>
                      </td>
                    ))}
                    <td>
                      <span { ...bem('point')}>
                        {team[totals].points}
                        <AdditionalPoints>{team[gameweek].points}</AdditionalPoints>
                      </span>
                    </td>
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
