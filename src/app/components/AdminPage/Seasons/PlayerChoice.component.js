import React from 'react';
import PropTypes from 'prop-types';

import Selector from '../../Selector/Selector';

export default class PlayerChoice extends React.Component {
  clubs = [];

  static propTypes = {
    players: PropTypes.array,
  };

  static defaultProps = {
    players: [],
  };

  constructor(props) {
    super(props);
    this.setClubs(props);
    this.state = {
      positionFilter: props.pos,
      clubFilter: props.defaultValue.club || 'Arsenal',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setClubs(nextProps);
  }

  selectPlayer = (e) => {
    this.setState({
      playerId: e.currentTarget.value,
      player: this.props.players.find((player) => player._id === e.currentTarget.value)
    });
  }

  getClubs = (players) => {
    const clubs = new Set();
    players.forEach((player) => clubs.add(player.club));
    return [...clubs.keys()].sort();
  }

  setClubs = (props) => {
    this.clubs = (props.players.length) ? this.getClubs(props.players) : [];
  }

  clubFilter = (e) => {
    this.setState({ clubFilter: e.target.value, playerId: null });
  }

  positionFilter = (e) => {
    this.setState({ positionFilter: e.target.value, playerId: null });
  }


  render() {
    const { pos, players, onUpdate, defaultValue } = this.props;
    const { clubFilter, positionFilter } = this.state;
    const clubs = this.clubs;
    const position = positionFilter || pos;

    const filteredPlayers = players
      .filter((player) => {
        const isFiltered =
          (!!position && position.toUpperCase() !== player.pos.toUpperCase() && position !== 'sub') ||
          (!!clubFilter && clubFilter.toUpperCase() !== player.club.toUpperCase());
        return !isFiltered;
      })
      .sort((playerA, playerB) => (playerA.name > playerB.name ? 1 : -1));

    return (
      <form>
        { pos === 'sub' &&
          <Selector
            onChange={ this.positionFilter }
            defaultValue={ positionFilter }
            options={ ['gk', 'fb', 'cb', 'wm', 'cm', 'str'] }
          />
        }
        <Selector
          onChange={ this.clubFilter }
          defaultValue={ clubFilter }
          options={ clubs }
        />
        <Selector
          onChange={ this.selectPlayer }
          defaultValue={ defaultValue._id }
          options={ filteredPlayers }
        />
        <input
          type="submit"
          onClick={ (e) => onUpdate(e, this.state.player) }
          disabled={ !this.state.playerId || this.state.playerId === defaultValue._id }
          value="Update"
        />
      </form>
    );
  }
}
