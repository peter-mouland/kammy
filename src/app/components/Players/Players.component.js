import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';
import bemHelper from 'react-bem-helper';

import { availablePositions } from '../../components/Positions/Positions';
import Selector from '../../components/Selector/Selector';
import Errors from '../../components/Errors/Errors';
import Interstitial from '../../components/Interstitial/Interstitial';
import { FETCH_PLAYERS } from './players.actions';

import './players.scss';

const bem = bemHelper({ name: 'player-table' });
debug('kammy:myteam');

const extremeStat = (int) => int < -10 || int > 10;

// eslint-disable-next-line no-confusing-arrow
const Highlight = ({ player, update = {}, attribute, className }) =>
  update[attribute] && player[attribute] !== update[attribute]
    ? <em { ...bem(null, null, ['text--warning', className])}>{update[attribute]}</em>
    : <span className={ className }>{player[attribute]}</span>;

export default class PlayerTable extends React.Component {
  static propTypes = {
    players: PropTypes.array,
    type: PropTypes.string,
    selectedPosition: PropTypes.string
  };

  static defaultProps = {
    players: [],
    selectedPosition: '',
    loading: false,
    errors: [],
    originalPlayers: {},
    playerUpdates: {}
  };

  options = {
    club: [],
    pos: availablePositions
  }

  constructor(props) {
    super(props);
    this.setClubs(props);
    this.state = {
      isSaving: false,
      nameFilter: '',
      posFilter: props.selectedPosition,
      clubFilter: this.options.club[0],
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setClubs(nextProps);
    if (nextProps.selectedPosition !== this.state.selectedPosition) {
      this.setState({ posFilter: nextProps.selectedPosition });
    }
  }

  onEdit(e, player, attribute, originalPlayerData) {
    const existingPlayerUpdate = this.props.playerUpdates[player._id];
    const playerUpdates = {
      ...this.props.playerUpdates,
      [player._id]: {
        ...player,
        ...existingPlayerUpdate,
        [attribute]: e.currentTarget.value
      }
    };
    const originalPlayers = {
      ...this.props.originalPlayers,
      [player._id]: originalPlayerData
    };
    this.props.onChange({ playerUpdates, originalPlayers });
  }

  CellEditor = ({ player, originalPlayerData, editable = false, attribute, type }) => {
    const onChange = (e) => this.onEdit(e, player, attribute, originalPlayerData);
    const Editor = type === 'text'
      ? <input
        type="text"
        onChange={ onChange }
        defaultValue={ player[attribute] }
      />
      : <Selector
        onChange={ onChange }
        defaultValue={ player[attribute] }
        options={ this.options[attribute] }
      />;
    return editable ? (
      <td
        { ...bem('meta')}
        onMouseOver={ (e) => this.showUpdater(e, player, attribute) }
        onClick={ (e) => this.showUpdater(e, player, attribute) }
      >
        {
          this.state[`show${attribute}Updater`] === player._id
            ? <span>{Editor}</span>
            :
            <Highlight
              update={ this.props.playerUpdates[player._id] }
              player={ originalPlayerData }
              attribute={attribute}
              { ...bem('editable', type) }
            />
        }
      </td>
    ) : <td { ...bem('meta')} >{ player[attribute] }</td>;
  }

  posFilter = (e) => {
    this.setState({ posFilter: e.target.value });
  }

  clubFilter = (e) => {
    this.setState({ clubFilter: e.target.value });
  }

  nameFilter = (e) => {
    this.setState({ nameFilter: e.target.value.toLowerCase().trim() });
  }

  statsOrPoints = (e) => {
    this.setState({ statsOrPoints: e.target.value.trim() });
  }

  weeklyOrSeason = (e) => {
    this.setState({ weeklyOrSeason: e.target.value.trim() });
  }

  setClubs = (props) => {
    this.options.club = (props.players.length) ? this.getClubs(props.players) : [];
  }

  getClubs = (players) => {
    const clubs = new Set();
    players.forEach((player) => clubs.add(player.club));
    return [...clubs.keys()].sort();
  }

  showUpdater(e, player, detail) {
    const reset = {
      showposUpdater: null,
      shownameUpdater: null,
      showclubUpdater: null
    };
    this.setState({
      ...reset,
      [`show${detail}Updater`]: player._id
    });
  }

  // from container: players, errors, loading
  render() {
    const {
      players, errors, loading, type, className, selectPlayer, selectedPosition, showStats,
      editable = false, playerUpdates = {},
    } = this.props;
    const {
      posFilter, clubFilter, nameFilter,
      statsOrPoints = 'stats', weeklyOrSeason = 'gameWeek'
    } = this.state;
    const clubs = this.options.club;
    const highlight = weeklyOrSeason === 'gameWeek';

    if (players === null) {
      return <Errors errors={[{ message: 'no players found, do you need to log in again?' }]} />;
    } else if (errors.length) {
      return <Errors errors={errors} />;
    } else if (loading && loading === FETCH_PLAYERS) {
      return <Interstitial />;
    }

    return (
      <table cellPadding={0} cellSpacing={0} { ...bem(null, type, className) }>
        <thead>
          <tr { ...bem('data-header')}>
            <th>Code</th>
            <th>Position</th>
            <th>Player</th>
            <th>Club</th>
            { selectPlayer && <th></th> }
            { showStats && <td> apps </td> }
            { showStats && <td> subs </td> }
            { showStats && <td> gls </td> }
            { showStats && <td> asts </td> }
            { showStats && <td> cs </td> }
            { showStats && <td> con </td> }
            { showStats && <td> pensv </td> }
            { showStats && <td> ycard </td> }
            { showStats && <td> rcard </td> }
          </tr>
          <tr {...bem('data-filter')}>
            <th></th>
            <th>
              <Selector
                onChange={ this.posFilter }
                defaultValue={ posFilter }
                options={ availablePositions }
              />
            </th>
            <th><input type="search" onChange={ this.nameFilter } defaultValue="" /></th>
            <th>
              <Selector
                onChange={ this.clubFilter }
                defaultValue={ clubFilter }
                options={ clubs }
              />
            </th>
            { showStats && (
              <th>
                <Selector
                  onChange={ this.weeklyOrSeason }
                  defaultValue={ weeklyOrSeason }
                  options={ ['gameWeek', 'total'] }
                />
              </th>
            )}
            { showStats && (
              <th>
                <Selector
                  onChange={ this.statsOrPoints }
                  defaultValue={ statsOrPoints }
                  options={ ['stats', 'points'] }
                />
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {
            players
              .filter((player) => {
                const isFiltered =
                (!!nameFilter && !player.name.toLowerCase().includes(nameFilter)) ||
                (!!posFilter && posFilter.toUpperCase() !== player.pos.toUpperCase()) ||
                (!!clubFilter && clubFilter.toUpperCase() !== player.club.toUpperCase());
                return !isFiltered;
              })
              .map((originalPlayerData) => {
                const player = playerUpdates[originalPlayerData._id] || originalPlayerData;
                const output = player[weeklyOrSeason][statsOrPoints];
                return (
                  <tr key={player.code} { ...bem('player')}>
                    { player.code }
                    {this.CellEditor({ player, originalPlayerData, attribute: 'pos', editable, type: 'select' })}
                    {this.CellEditor({ player, originalPlayerData, attribute: 'name', editable, type: 'text' })}
                    {this.CellEditor({ player, originalPlayerData, attribute: 'club', editable, type: 'select' })}
                    { selectPlayer &&
                  <td { ...bem('meta')} >
                    <button
                      onClick={ () => selectPlayer(player) }
                      disabled={ !selectedPosition }
                    >
                      Select
                    </button>
                  </td>
                    }
                    { showStats && <td {...bem('output', { highlight: highlight && extremeStat(output.apps) })}> {output.apps} </td> }
                    { showStats && <td {...bem('output', { highlight: highlight && extremeStat(output.subs) })}> {output.subs} </td> }
                    { showStats && <td {...bem('output', { highlight: highlight && extremeStat(output.gls) })}> {output.gls} </td> }
                    { showStats && <td {...bem('output', { highlight: highlight && extremeStat(output.asts) })}> {output.asts} </td> }
                    { showStats && <td {...bem('output', { highlight: highlight && extremeStat(output.cs) })}> {output.cs} </td> }
                    { showStats && <td {...bem('output', { highlight: highlight && extremeStat(output.con) })}> {output.con} </td> }
                    { showStats && <td {...bem('output', { highlight: highlight && extremeStat(output.pensv) })}> {output.pensv} </td> }
                    { showStats && <td {...bem('output', { highlight: highlight && extremeStat(output.ycard) })}> {output.ycard} </td> }
                    { showStats && <td {...bem('output', { highlight: highlight && extremeStat(output.rcard) })}> {output.rcard} </td> }
                  </tr>
                );
              })
          }
        </tbody>
      </table>
    );
  }
}
