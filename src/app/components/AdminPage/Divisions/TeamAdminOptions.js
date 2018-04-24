import React from 'react';
import Modal from '@kammy-ui/modal';
import Interstitial from '@kammy-ui/interstitial';
import Svg from '@kammy-ui/svg';

import PlayerChoice from '../Seasons/PlayerChoice';
import changeIcon from '../../../../assets/change.svg';

const positions = {
  gk: [''],
  cb: ['left', 'right'],
  fb: ['left', 'right'],
  mid: ['left', 'right'],
  am: ['left', 'right'],
  str: ['left', 'right'],
  sub: [''],
};

class TeamAdminOptions extends React.Component {
  state = {
    showPlayerChoice: false,
    duplicatePlayerWaning: false
  }

  updatePlayerWithoutWarning = ({ pos, team, player }) => {
    const updatedTeam = {
      ...team,
      [pos]: {
        club: player.club,
        code: player.code,
        name: player.name,
        pos: player.pos,
        _id: player._id,
      }
    };
    this.setState({ duplicatePlayerWaning: false, showPlayerChoice: null, leftOrRight: null });
    this.props.saveUpdates(updatedTeam);
  }

  updatePlayer = (e, {
    pos, leftOrRight, team, player, pickedPlayers
  }) => {
    e.preventDefault();
    const props = { pos: pos + leftOrRight, team, player };
    if (pickedPlayers.indexOf(player._id) > -1) {
      this.setState({ duplicatePlayerWaning: { player, props } });
    } else {
      this.updatePlayerWithoutWarning(props);
    }
  }

  showPlayerChoice = ({ pos, leftOrRight }) => {
    this.setState({ showPlayerChoice: pos, leftOrRight });
  }

  getCta = ({
    team, pos, side, divisionTeams
  }) => {
    const { updatingUserTeam } = this.props;
    const { showPlayerChoice, leftOrRight } = this.state;
    switch (true) {
      case updatingUserTeam:
        return (
          <Interstitial />
        );
      case showPlayerChoice === pos && leftOrRight === side:
        return (
          <PlayerChoice
            teams={divisionTeams}
            pos={ showPlayerChoice }
            leftOrRight={ leftOrRight }
            defaultValue={ team[showPlayerChoice + leftOrRight] }
            onUpdate={ (e, player, pickedPlayers) =>
              this.updatePlayer(e, {
               pos, leftOrRight: side, team, player, pickedPlayers
              })
            }
          />
        );
      default:
        return (
          <Svg
            className="admin-icon"
            onClick={ () => this.showPlayerChoice({ pos, leftOrRight: side }) }
          >
            { changeIcon }
          </Svg>
        );
    }
  }

  ModalContents = ({ warning }) => {
    if (!warning) return <div />;
    return (
      <div>
        <p>{warning.player.name} has already been selected within this division.</p>
        <p>
          <button onClick={ () => this.updatePlayerWithoutWarning(warning.props)}>
            Save Duplicate Selection
          </button>
          <button onClick={ () => this.setState({ duplicatePlayerWaning: false }) }>
            Cancel Update
          </button>
        </p>
      </div>
    );
  }

  render() {
    const { team, divisionTeams } = this.props;
    const { duplicatePlayerWaning = false } = this.state;
    return (
      <div>
        <Modal
          id="duplicate-player-warning"
          title="Player Already Selected"
          open={ !!duplicatePlayerWaning }
          onClose={ () => this.setState({ duplicatePlayerWaning: false })}
          key="duplicate-player-warning"
        >
          {this.ModalContents({ warning: duplicatePlayerWaning })}
        </Modal>
        <table
          key="admin-options--team"
          id="admin-options--team"
          data-test="admin-options--team"
        >
          <thead>
            <tr>
              <th>code</th>
              <th>Position</th>
              <th>Player</th>
              <th>Team</th>
              <th>Transfer</th>
            </tr>
          </thead>
          <tbody>
            {(Object.keys(positions)).map((pos) => {
              const position = positions[pos];
              return position.map((side) => {
                const Cta = this.getCta({
                  team, pos, side, divisionTeams
                });
                return (
                  <tr key={pos + side}>
                    <td>{team[pos + side].code}</td>
                    <td>{pos}</td>
                    <td>{team[pos + side].name || <em>unknown</em>}</td>
                    <td>{team[pos + side].club}</td>
                    <td>{Cta}</td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default TeamAdminOptions;
