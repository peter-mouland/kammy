import React from 'react';

import SVG from '../Svg/Svg';
import PlayerChoice from '../../components/Admin/PlayerChoice.container';
import changeIcon from '../../../assets/change.svg';

const positions = {
  gk: [''],
  cb: ['left', 'right'],
  fb: ['left', 'right'],
  wm: ['left', 'right'],
  cm: ['left', 'right'],
  str: ['left', 'right'],
  sub: [''],
};

class UserAdminOptions extends React.Component {

  state = {
    showPlayerChoice: false
  }

  updatePlayer = (e, { pos, leftOrRight, team, player }) => {
    e.preventDefault();
    const updatedTeam = {
      ...team,
      [pos + leftOrRight]: player
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
      <ul
        data-test="admin-options--team"
      >
        {(Object.keys(positions)).map((key) => {
          const position = positions[key];
          return position.map((side) => (
            <li key={key + side}>
              <strong>{key} {side}</strong>
              {team[key + side].name || <em>unknown</em>}
              <SVG className="admin-icon"
                   markup={ changeIcon }
                   onClick={ () => this.showPlayerChoice({ pos: key, leftOrRight: side }) }
              />
              {
                showPlayerChoice && showPlayerChoice === key && leftOrRight === side &&
                <PlayerChoice pos={ showPlayerChoice }
                              leftOrRight={ leftOrRight }
                              defaultValue={ team[showPlayerChoice + leftOrRight] }
                              onUpdate={
                                (e, player) =>
                                  this.updatePlayer(e, { pos: key, leftOrRight: side, team, player }
                                  )
                              }
                />
              }
            </li>
          ));
        })}
      </ul>
    );
  }
}

export default UserAdminOptions;
