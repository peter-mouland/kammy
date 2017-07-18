import React from 'react';

import Interstitial from '../../Interstitial/Interstitial';
import SVG from '../../Svg/Svg';
import PlayerChoice from '../Seasons/PlayerChoice';
import changeIcon from '../../../../assets/change.svg';

const positions = {
  gk: [''],
  cb: ['left', 'right'],
  fb: ['left', 'right'],
  wm: ['left', 'right'],
  cm: ['left', 'right'],
  str: ['left', 'right'],
  sub: [''],
};

class TeamAdminOptions extends React.Component {
  state = {
    showPlayerChoice: false
  }

  updatePlayer = (e, { pos, leftOrRight, team, player }) => {
    e.preventDefault();
    const updatedTeam = {
      ...team,
      [pos + leftOrRight]: {
        club: player.club,
        code: player.code,
        name: player.name,
        pos: player.pos,
        _id: player._id,
      }
    };
    this.setState({ showPlayerChoice: null, leftOrRight: null });
    this.props.saveUpdates(updatedTeam);
  }

  showPlayerChoice = ({ pos, leftOrRight }) => {
    this.setState({ showPlayerChoice: pos, leftOrRight });
  }

  getCta = (team, pos, side) => {
    const { updatingUserTeam } = this.props;
    const { showPlayerChoice, leftOrRight } = this.state;
    switch (true) {
      case updatingUserTeam :
        return (
          <Interstitial />
        );
      case showPlayerChoice === pos && leftOrRight === side :
        return (
          <PlayerChoice
            pos={ showPlayerChoice }
            leftOrRight={ leftOrRight }
            defaultValue={ team[showPlayerChoice + leftOrRight] }
            onUpdate={ (e, player) =>
              this.updatePlayer(e, { pos, leftOrRight: side, team, player }
              )}
          />
        );
      default :
        return (
          <SVG
            className="admin-icon"
            markup={ changeIcon }
            onClick={ () => this.showPlayerChoice({ pos, leftOrRight: side }) }
          />
        );
    }
  }

  render() {
    const { team } = this.props;
    return (
      <table
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
              const Cta = this.getCta(team, pos, side);
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
    );
  }
}

export default TeamAdminOptions;
