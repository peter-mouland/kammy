import React from 'react';

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

  render() {
    const { team } = this.props;
    const { showPlayerChoice, leftOrRight } = this.state;
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

          {(Object.keys(positions)).map((key) => {
            const position = positions[key];
            return position.map((side) => (
              <tr key={key + side}>
                <td>{team[key + side].code}</td>
                <td>{key}</td>
                <td>{team[key + side].name || <em>unknown</em>}</td>
                <td>{team[key + side].club}</td>
                <td>{
                  showPlayerChoice && showPlayerChoice === key && leftOrRight === side
                    ? <PlayerChoice
                      pos={ showPlayerChoice }
                      leftOrRight={ leftOrRight }
                      defaultValue={ team[showPlayerChoice + leftOrRight] }
                      onUpdate={ (e, player) =>
                        this.updatePlayer(e, { pos: key, leftOrRight: side, team, player }
                        )}
                    />
                    : <SVG
                      className="admin-icon"
                      markup={ changeIcon }
                      onClick={ () => this.showPlayerChoice({ pos: key, leftOrRight: side }) }
                    />
                }
                </td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    );
  }
}

export default TeamAdminOptions;
