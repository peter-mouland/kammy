import React from 'react';

import Modal from '@kammy/modal';
import Interstitial from '@kammy/interstitial';
import ClubFixtures from '@kammy/club-fixtures';

export default class PlayerFixtures extends React.Component {
  render() {
    const { player, onClose, showFixtures } = this.props;
    if (!showFixtures) return null;

    const details = player ? player[showFixtures] : false;
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
        >
          <ClubFixtures fixtures={details.fixtures} club={details.club} code={details.code} />
        </Modal>
      );
  }
}
