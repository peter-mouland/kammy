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
        className="player-fixtures"
        onClose={ onClose }
      >
        <Interstitial>Loading Player Fixtures</Interstitial>
      </Modal>
    )
    : (
      <Modal
        key={`${details.code}-fixtures`}
        id={`${details.code}-fixtures`}
        title={`${details.name}, ${details.club} Fixtures`}
        open={ !!showFixtures }
        onClose={ onClose }
        { ...bem() }
      >
        {
          details.fixtures.map((fixture, i) => (
            <div key={`${fixture.event}-${details.code}`}>
              <strong>{i + 1}</strong>.
              {fixture.homeTeam} {fixture.homeScore} vs {fixture.awayScore} {fixture.awayTeam}
            </div>
          ))
        }
      </Modal>
    );
};
