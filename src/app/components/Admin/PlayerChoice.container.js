import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchPlayers } from '../../actions';
import Selector from '../../components/Selector/Selector';

class PlayerChoice extends React.Component {

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
      clubFilter: props.defaultValue.club || 'Arsenal',
    };
  }

  componentDidMount() {
    if (!this.props.players.length) {
      this.props.fetchPlayers();
    }
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


  render() {
    const { pos, players, onUpdate, defaultValue } = this.props;
    const { clubFilter } = this.state;
    const clubs = this.clubs;

    const filteredPlayers = players
      .filter((player) => {
        const isFiltered =
          (!!pos && pos.toUpperCase() !== player.pos.toUpperCase()) ||
          (!!clubFilter && clubFilter.toUpperCase() !== player.club.toUpperCase());
        return !isFiltered;
      })
      .sort((playerA, playerB) => (playerA.name > playerB.name ? 1 : -1));

    return (
        <form>
          <Selector onChange={ this.clubFilter }
                    defaultValue={ clubFilter }
                    options={ clubs }
          />
          <Selector onChange={ this.selectPlayer }
                    defaultValue={ defaultValue._id }
                    options={ filteredPlayers }
          />
          <input type="submit"
                 onClick={ (e) => onUpdate(e, this.state.player) }
                 disabled={ !this.state.playerId || this.state.playerId === defaultValue._id }
                 value="Update"
          />
        </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    players: state.players.data,
    loading: state.promiseState.loading,
    errors: state.promiseState.errors,
  };
}

export default connect(
  mapStateToProps,
  { fetchPlayers }
)(PlayerChoice);
