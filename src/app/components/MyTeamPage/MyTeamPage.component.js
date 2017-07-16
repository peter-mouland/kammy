import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';
import bemHelper from 'react-bem-helper';

import Players from '../Players/Players';
import Svg from '../Svg/Svg';
import field from '../../../assets/field.svg';
import Errors from '../../components/Errors/Errors';
import Interstitial from '../../components/Interstitial/Interstitial';
import { FETCH_TEAM } from './my-team.actions';

import './my-team.scss';

const bem = bemHelper({ name: 'my-team' });
debug('kammy:myteam.component');

export default class MyTeam extends React.Component {
  static propTypes = {
    team: PropTypes.object
  };

  static defaultProps = {
    team: undefined,
    loading: false,
    errors: []
  };

  constructor(props) {
    super(props);
    this.state = {
      isSaving: false,
      selectedPosition: '',
      selectedLeftOrRight: '',
      updatedTeam: {},
    };
  }

  selectPlayer = (player) => {
    this.setState({
      updatedTeam: {
        ...this.props.team,
        ...this.state.updatedTeam,
        [this.state.selectedPosition + this.state.selectedLeftOrRight]: {
          club: player.club,
          code: player.code,
          name: player.name,
          pos: player.pos,
          _id: player._id,
        }
      }
    });
  };

  saveTeam = () => {
    this.props.updateTeam(this.state.updatedTeam);
  }

  choosePos = (pos, leftOrRight = '') => {
    this.setState({
      selectedPosition: pos,
      selectedLeftOrRight: leftOrRight
    });
  };

  squadPlayer = (pos, leftOrRight = '') => {
    const { team = {} } = this.props;
    const { updatedTeam, selectedPosition, selectedLeftOrRight } = this.state;
    const player = team[pos + leftOrRight] || {};
    const updatePlayer = updatedTeam[pos + leftOrRight] || {};
    const isSelected = selectedPosition === pos && selectedLeftOrRight === leftOrRight;
    return (
      <li { ...bem('position', pos, { 'text--warning': isSelected }) } onClick={ () => this.choosePos(pos, leftOrRight)}>
        <div className="position">
          <div className="position__label">{pos}</div>
          <div className="position__player">{updatePlayer.name || player.name}</div>
        </div>
      </li>
    );
  }

  render() {
    const { loading, errors, team } = this.props;
    const { selectedPosition } = this.state;

    if (team === null) {
      return <Errors errors={[{ message: 'no team found, do you need to log in again?' }]} />;
    } else if (errors.length) {
      return <Errors errors={errors} />;
    } else if (loading && loading === FETCH_TEAM) {
      return <Interstitial />;
    }

    return (
      <div { ...bem() } id="my-team-page">
        <h1>My Team</h1>
        <div { ...bem('panels') } >
          <section { ...bem('formation') }>
            <Svg { ...bem('field') } markup={field} />
            <ul { ...bem('squad') }>
              {this.squadPlayer('sub')}
              {this.squadPlayer('gk')}
              {this.squadPlayer('fb', 'left')}
              {this.squadPlayer('cb', 'left')}
              {this.squadPlayer('cb', 'right')}
              {this.squadPlayer('fb', 'right')}
              {this.squadPlayer('wm', 'left')}
              {this.squadPlayer('cm', 'left')}
              {this.squadPlayer('cm', 'right')}
              {this.squadPlayer('wm', 'right')}
              {this.squadPlayer('str', 'left')}
              {this.squadPlayer('str', 'right')}
            </ul>
            <button onClick={ this.saveTeam }>Save Team</button>
          </section>
          <section { ...bem('player-selection') }>
            <Players
              type="my-team"
              team={ team }
              showPoints
              selectedPosition={ selectedPosition }
              selectPlayer={ this.selectPlayer }
            />
          </section>
        </div>
      </div>
    );
  }
}
