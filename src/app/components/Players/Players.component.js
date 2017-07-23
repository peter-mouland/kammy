import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';
import bemHelper from 'react-bem-helper';

import { playerPositions } from '../../components/Positions/Positions';
import Svg from '../../components/Svg/Svg';
import Selector from '../../components/Selector/Selector';
import Errors from '../../components/Errors/Errors';
import Interstitial from '../../components/Interstitial/Interstitial';
import MultiToggle from '../MultiToggle/MultiToggle';
import Toggle from '../Toggle/Toggle';
import New from '../../../assets/new.svg';

import './players.scss';

const bem = bemHelper({ name: 'player-table' });
const log = debug('kammy:players.component');

const extremeStat = (int) => int < -10 || int > 10;
const statCols = ['apps', 'subs', 'gls', 'asts', 'cs', 'con', 'pensv', 'ycard', 'rcard'];

// eslint-disable-next-line no-confusing-arrow
const Highlight = ({ player, update = {}, attribute, className }) =>
  update[attribute] && player[attribute] !== update[attribute]
    ? <em { ...bem(null, null, ['text--warning', className])}>{update[attribute]}</em>
    : <span className={ className }>{player[attribute]}</span>;

const setClubs = ({ players = [], team }) => {
  const clubs = new Set();
  players.forEach((player) => clubs.add(player.club));
  const clubsArr = [...clubs.keys()].sort();
  if (team) clubsArr.unshift('My Team');
  return clubsArr;
};

const applyFilters = ({
  nameFilter, posFilter, clubFilter, player, myTeam, showHidden, showOnlyNewPlayers
}) => {
  const nameFiltered = !nameFilter || player.name.toUpperCase().includes(nameFilter.toUpperCase());
  const posFiltered = !posFilter || posFilter === 'all' || player.pos.toUpperCase().includes(posFilter.toUpperCase());
  const hiddenFiltered = player.isHidden === showHidden;
  const newFiltered = !showOnlyNewPlayers || player.new === showOnlyNewPlayers;
  const clubFiltered = !clubFilter ||
    (clubFilter.toUpperCase() === 'MY TEAM' && myTeam[player.code]) ||
    (player.club.toUpperCase().includes(clubFilter.toUpperCase()));
  return nameFiltered && posFiltered && clubFiltered && hiddenFiltered && newFiltered;
};

function fieldSorter(fields) {
  return (prevPlayer, currPlayer) => fields
    .map((field) => {
      let dir = 1;
      const desc = field[0] === '-';
      if (desc) {
        dir = -1;
        field = field.substring(1);
      }
      const attrA = (field === 'pos') ? playerPositions[prevPlayer.pos].order : prevPlayer[field];
      const attrB = (field === 'pos') ? playerPositions[currPlayer.pos].order : currPlayer[field];
      if (attrA > attrB) return dir;
      return (attrA < attrB) ? -(dir) : 0;
    })
    .reduce((prev, curr) => prev || curr, 0);
}

function AdditionalPoints({ children: points }) {
  if (points === 0) {
    return null;
  }
  return (
    <sup { ...bem('additional-point')}>
      {
        points > 0
          ? <span className="text--success">(+{points})</span>
          : <span className="text--error">({points})</span>
      }
    </sup>
  );
}

export default class PlayerTable extends React.Component {
  static propTypes = {
    players: PropTypes.array,
    type: PropTypes.string,
    selectedPosition: PropTypes.string,
    editable: PropTypes.bool,
    showPoints: PropTypes.bool,
    showStats: PropTypes.bool,
  };

  static defaultProps = {
    players: [],
    editable: false,
    showPoints: false,
    showStats: false,
    selectedPosition: '',
    loading: false,
    errors: [],
    originalPlayers: {},
    playerUpdates: {}
  };

  options = {
    club: [],
    pos: []
  }

  constructor(props) {
    super(props);
    this.options.club = setClubs(props);
    this.options.pos = ['all'].concat(Object
      .keys(playerPositions)
      .filter((pos) => props.editable || !playerPositions[pos].hiddenFromManager)
    );
    this.state = {
      showOnlyNewPlayers: false,
      showHidden: false,
      isSaving: false,
      nameFilter: '',
      posFilter: props.selectedPosition || 'all',
      clubFilter: this.options.club[0],
    };
  }

  componentWillReceiveProps(nextProps) {
    this.options.club = setClubs(nextProps);
    if (nextProps.selectedPosition !== this.state.selectedPosition) {
      this.setState({ posFilter: nextProps.selectedPosition || 'all' });
    }
  }

  onEdit(value, player, attribute, originalPlayerData) {
    const existingPlayerUpdate = this.props.playerUpdates[player._id];
    const playerUpdates = {
      ...this.props.playerUpdates,
      [player._id]: {
        ...player,
        ...existingPlayerUpdate,
        [attribute]: value
      }
    };
    const originalPlayers = {
      ...this.props.originalPlayers,
      [player._id]: originalPlayerData
    };
    this.props.onChange({ playerUpdates, originalPlayers });
  }

  CellEditor = ({ player, originalPlayerData, editable = false, attribute, type }) => {
    const onChange = (e) => (
      this.onEdit(e.currentTarget.value, player, attribute, originalPlayerData)
    );
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
      <div
        onMouseOver={ (e) => this.showUpdater(e, player, attribute) }
        onMouseLeave={ () => this.hideUpdater() }
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
      </div>
    ) : <div>{ player[attribute] }</div>;
  }

  posFilter = (e) => {
    this.setState({ posFilter: e.target.value });
  }

  clubFilter = (e) => {
    this.setState({ clubFilter: e.target.value });
  }

  nameFilter = (e) => {
    this.setState({ nameFilter: e.target.value.trim() });
  }

  statsOrPoints = (e) => {
    this.setState({ statsOrPoints: e.target.value.trim() });
  }

  showHidden = (e) => {
    const showHidden = e.target.checked;
    this.setState({ showHidden });
  }

  showOnlyNewPlayers = (e) => {
    const showOnlyNewPlayers = e.target.checked;
    this.setState({ showOnlyNewPlayers });
  }

  hideUpdater = () => {
    this.setState({
      showposUpdater: null,
      shownameUpdater: null,
      showclubUpdater: null
    });
  }

  showUpdater(e, player, detail) {
    this.hideUpdater();
    this.setState({
      [`show${detail}Updater`]: player._id
    });
  }

  render() {
    const {
      players, errors, loading, type, className, selectPlayer,
      selectedPosition, showStats, showPoints, editable, playerUpdates = {}, team,
    } = this.props;
    const {
      posFilter, clubFilter, nameFilter, statsOrPoints = 'stats', showHidden, showOnlyNewPlayers
    } = this.state;
    const club = this.options.club;
    const teamPlayers = team ? (Object.keys(team))
      .reduce((prev, curr) => team[curr] && ({ ...prev, [team[curr].code]: team[curr] }), {}) : {};

    if (players === null) {
      return <Errors errors={[{ message: 'no players found, do you need to log in again?' }]} />;
    } else if (errors.length) {
      return <Errors errors={errors} />;
    }

    return (
      <div>
        <div { ...bem('options') }>
          { showStats && (
            <div { ...bem('option-group') }>
              <MultiToggle
                {...bem('toggle-options')}
                checked={ statsOrPoints }
                id={'stats-or-points'}
                onChange={ this.statsOrPoints }
                options={['stats', 'points']}
              />
            </div>
          )}
          <div { ...bem('option-group') }>
            <div>
              <MultiToggle
                label="Position:"
                id={'position-filter'}
                onChange={ this.posFilter }
                checked={ posFilter }
                options={ this.options.pos }
              />
            </div>
            <div>
              <label htmlFor="name-filter">Player:</label>
              <input
                id="name-filter"
                name="name-filter"
                type="search"
                onChange={ this.nameFilter }
                defaultValue=""
              />
            </div>
            <div>
              <label htmlFor="club-filter">Club:</label>
              <Selector
                id="club-filter"
                name="club-filter"
                onChange={ this.clubFilter }
                defaultValue={ clubFilter }
                options={ club }
              />
            </div>
            { editable && [
              <div key={'toggle-hidden'}>
                <Toggle
                  key="toggle-hidden"
                  {...bem('toggle-options')}
                  checked={ showHidden }
                  id={'show-hidden-players'}
                  onChange={ this.showHidden }
                  label={'Show Hidden Players'}
                />
              </div>,
              <div key={'toggle-new'}>
                <Toggle
                  key="toggle-new"
                  {...bem('toggle-options')}
                  checked={ showOnlyNewPlayers }
                  id={'show-new-players'}
                  onChange={ this.showOnlyNewPlayers }
                  label={'Show Only New Players'}
                />
              </div>
            ]}
          </div>
        </div>
        <table cellPadding={0} cellSpacing={0} { ...bem(null, type, className) }>
          <thead>
            <tr { ...bem('data-header')}>
              { editable && <th>Code</th> }
              <th>Position</th>
              <th>Player</th>
              { showStats && statCols.map((stat) => [
                <td key={stat}>{stat}</td>,
                <td key={`${stat}-gw`}><sup>(gw)</sup></td>
              ])}
              { showStats && [
                <td key={'total'}>Total</td>,
                <td key={'total-gw'}><sup>(gw)</sup></td>
              ] }
              { showPoints && [
                <td key={'points'}>Points</td>,
                <td key={'points-gw'}><sup>(gw)</sup></td>
              ] }
              { editable && <th>Hidden</th> }
              { selectPlayer && <th></th> }
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={4}><Interstitial>Loading Players</Interstitial></td></tr>}
            {
              players
                .filter((player) =>
                  applyFilters({
                    player,
                    nameFilter,
                    posFilter,
                    clubFilter,
                    myTeam: teamPlayers,
                    showHidden,
                    showOnlyNewPlayers
                  })
                )
                .sort(fieldSorter(['pos', 'name']))
                .map((originalPlayerData) => {
                  const player = playerUpdates[originalPlayerData._id] || originalPlayerData;
                  const isOnMyTeam = teamPlayers[player.code];
                  return (
                    <tr key={player.code} id={player.code} { ...bem('player', { selected: isOnMyTeam, new: !!player.new })}>
                      { editable && (
                        <td { ...bem('meta')}>
                          { player.new && <Svg markup={New} { ...bem('new-icon')} />}
                          { player.code }
                        </td>
                      ) }
                      <td { ...bem('meta')}>
                        {this.CellEditor({ player, originalPlayerData, attribute: 'pos', editable, type: 'select' })}
                      </td>
                      <td { ...bem('meta')}>
                        {this.CellEditor({ player, originalPlayerData, attribute: 'name', editable, type: 'text' })}
                        <small>{this.CellEditor({ player, originalPlayerData, attribute: 'club', editable, type: 'select' })}</small>
                      </td>
                      { showStats && statCols.map((stat) => [
                        <td key={stat} {...bem('output')}>
                          {player.season[statsOrPoints][stat]}
                        </td>,
                        <td key={`${stat}-gw`} {...bem('gw-output')}>
                          <AdditionalPoints {...bem('additional', { highlight: extremeStat(player.gameWeek[statsOrPoints][stat]) })}>
                            {player.gameWeek[statsOrPoints][stat]}
                          </AdditionalPoints>
                        </td>
                      ])}
                      { showStats && [
                        <td key={'total'} {...bem('output')}>
                          {player.season[statsOrPoints].total}
                        </td>,
                        <td key={'total-gw'} {...bem('gw-output')}>
                          <AdditionalPoints {...bem('additional', { highlight: extremeStat(player.gameWeek[statsOrPoints].total) })}>
                            {player.gameWeek[statsOrPoints].total}
                          </AdditionalPoints>
                        </td>
                      ]}
                      { showPoints && [
                        <td key="total" {...bem('output')}>
                          {player.season.points.total}
                        </td>,
                        <td key="total-gw" {...bem('gw-output')}>
                          <AdditionalPoints>{player.gameWeek.points.total}</AdditionalPoints>
                        </td>
                      ]}
                      { editable && (
                        <td {...bem('output')}>
                          <input
                            type="checkbox"
                            defaultChecked={player.isHidden}
                            onChange={(e) => this.onEdit(e.currentTarget.checked, player, 'isHidden', originalPlayerData)}
                          />
                        </td>
                      )}
                      { selectPlayer &&
                      <td { ...bem('meta')} >
                        <button
                          onClick={ () => selectPlayer(player) }
                          disabled={ !selectedPosition || isOnMyTeam }
                        >
                          Select
                        </button>
                      </td>
                      }
                    </tr>
                  );
                })
            }
          </tbody>
        </table>
      </div>
    );
  }
}
