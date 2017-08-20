import React from 'react';
import debug from 'debug';
import bemHelper from 'react-bem-helper';

import Modal from '../Modal/Modal';
import Interstitial from '../../components/Interstitial/Interstitial';
import analyzeFixtures from '../../utils/analyze-fixtures';

import './playerFixtures.scss';

const bem = bemHelper({ name: 'player-fixtures' });
const log = debug('kammy:players-fixtures');

export default class PlayerFixtures extends React.Component {
  render() {
    const { player, onClose, showFixtures } = this.props;
    if (!showFixtures) return null;

    const details = player ? player[showFixtures] : false;
    const analysis = details ? analyzeFixtures(details.fixtures) : {};
    return (showFixtures && !details)
      ? (
        <Modal
          id={'loading'}
          open={!!showFixtures}
          className="home-or-away"
          onClose={onClose}
        >
          <Interstitial>Loading Player Fixtures</Interstitial>
        </Modal>
      )
      : (
        <Modal
          key={`${details.code}-fixtures`}
          id={`${details.code}-fixtures`}
          title={<span>{details.name} <small>{details.club}</small></span>}
          open={!!showFixtures}
          onClose={onClose}
          {...bem()}
        >
          <h3>Stats</h3>
          <table>
            <thead>
              <tr>
                {(Object.keys(analysis)).map((key) => (
                  <th key={key} { ...bem('stats-header') }>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {(Object.keys(analysis)).map((key) => (
                  <td key={key} >
                    <div {...bem('stats')}>
                      <span {...bem('stat', 'total')} title="total">
                        {analysis[key].total}
                      </span>
                      <span {...bem('stat', 'group')}>
                        <sup {...bem('stat', 'max')} title="max">{analysis[key].max}</sup>
                        <sup {...bem('stat', 'avg')} title="avg">{analysis[key].avg}</sup>
                        <sup {...bem('stat', 'min')} title="min">{analysis[key].min}</sup>
                      </span>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          <h3>Fixtures</h3>
          {
            details.fixtures.map((fixture, i) => (
              <div key={`${fixture.event}-${details.code}`}>
                <strong {...bem('event')}>{i + 1}</strong>
                <span {...bem('home-or-away', { home: details.club === fixture.homeTeam })}>
                  [{details.club === fixture.homeTeam ? 'H' : 'A'}]
                </span>
                <span {...bem('fixture')}>
                  <span {...bem('team', 'home')}>{fixture.homeTeam} {fixture.homeScore}</span>
                  vs
                  <span {...bem('team', 'away')}>{fixture.awayScore} {fixture.awayTeam}</span>
                </span>
              </div>
            ))
          }
        </Modal>
      );
  }
}
