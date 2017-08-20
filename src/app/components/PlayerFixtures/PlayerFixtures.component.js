import React from 'react';
import debug from 'debug';
import bemHelper from 'react-bem-helper';

import Modal from '../Modal/Modal';
import Interstitial from '../../components/Interstitial/Interstitial';

import './playerFixtures.scss';

const bem = bemHelper({ name: 'player-fixtures' });
const log = debug('kammy:players-fixtures');

export default ({ player, onClose, showFixtures }) => {
  if (!showFixtures) return null;

  const details = player ? player[showFixtures] : false;
  return (showFixtures && !details)
    ? (
      <Modal
        id={ 'loading' }
        open={ !!showFixtures }
        className="home-or-away"
        onClose={ onClose }
      >
        <Interstitial>Loading Player Fixtures</Interstitial>
      </Modal>
    )
    : (
      <Modal
        key={`${details.code}-fixtures`}
        id={`${details.code}-fixtures`}
        title={<span>{details.name} <small>{details.club}</small></span>}
        open={ !!showFixtures }
        onClose={ onClose }
        { ...bem() }
      >
        {
          details.fixtures.map((fixture, i) => (
            <div key={`${fixture.event}-${details.code}`}>
              <strong { ...bem('event') }>{i + 1}</strong>
              <span {...bem('home-or-away', { home: details.club === fixture.homeTeam })}>
                [{details.club === fixture.homeTeam ? 'H' : 'A'}]
              </span>
              <span { ...bem('fixture')}>
                <span { ...bem('team', 'home')}>{fixture.homeTeam} {fixture.homeScore}</span>
                vs
                <span { ...bem('team', 'away')}>{fixture.awayScore} {fixture.awayTeam}</span>
              </span>
            </div>
          ))
        }
      </Modal>
    );
};
