import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';
import bemHelper from 'react-bem-helper';

import { playerPositions } from '../../../config/positions';
import Svg from '../../components/Svg/Svg';
import Selector from '../../components/Selector/Selector';
import Errors from '../../components/Errors/Errors';
import Interstitial from '../../components/Interstitial/Interstitial';
import MultiToggle from '../MultiToggle/MultiToggle';
import Toggle from '../Toggle/Toggle';
import New from '../../../assets/new.svg';
import fieldSorter from '../../utils/field-sorter';
import PlayerFixtures from '../PlayerFixtures/PlayerFixtures';

import './players.scss';

const bem = bemHelper({ name: 'player-table' });
const log = debug('kammy:players.component');

const extremeStat = (int) => int < -10 || int > 10;
const statCols = ['apps', 'subs', 'gls', 'asts', 'cs', 'con', 'pensv', 'tb', 'sb', 'ycard', 'rcard'];

// eslint-disable-next-line no-confusing-arrow
const Highlight = ({
  player, update = {}, attribute, className
}) =>
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

function AdditionalPoints({ children: points }) {
  return (
    <sup { ...bem('additional-point')}>
      {!points && <span className="text--neutral">0</span>}
      {points > 0 && <span className="text--success">{points}</span>}
      {points < 0 && <span className="text--error">{points}</span>}
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
    hideOptions: PropTypes.bool,
    showStats: PropTypes.bool,
  };

  static defaultProps = {
    players: [],
    hideOptions: false,
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
      .filter((pos) => props.editable || !playerPositions[pos].hiddenFromManager));
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

  CellEditor = ({
    player, originalPlayerData, attribute, type
  }) => {
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
    return <div
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
    </div>;
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

  showUpdater = (e, player, detail) => {
    this.hideUpdater();
    this.setState({
      [`show${detail}Updater`]: player._id
    });
  }

  setShowFixtures = ({ e, player }) => {
    e.preventDefault();
    this.setState({ showFixtures: player.code });
  }

  render() {
    const {
      players, errors, loading, type, className, selectPlayer, hideOptions, headerRow,
      selectedPosition, showStats, showPoints, editable, playerUpdates = {}, team,
      playerFixtures
    } = this.props;
    const {
      posFilter, clubFilter, nameFilter, showHidden, showOnlyNewPlayers, showFixtures
    } = this.state;
    const { club } = this.options;
    const teamPlayers = team
      ? (Object.keys(team))
        .reduce((prev, curr) => team[curr] &&
            ({ ...prev, [team[curr].code]: { ...team[curr], teamPos: curr } }), {})
      : {};

    if (players === null) {
      return <Errors errors={[{ message: 'no players found, do you need to log in again?' }]} />;
    } else if (errors.length) {
      return <Errors errors={errors} />;
    }


    return (
      <div className={className}>
        <PlayerFixtures
          player={ playerFixtures }
          showFixtures={ showFixtures }
          onClose={ () => this.setState({ showFixtures: false })}
        />
        {!hideOptions &&
          <div { ...bem('options') }>
            <div {...bem('option-group')}>
              <div>
                <MultiToggle
                  label="Position:"
                  id={'position-filter'}
                  onChange={this.posFilter}
                  checked={posFilter}
                  options={this.options.pos}
                />
              </div>
              <div>
                <label htmlFor="name-filter">Player:</label>
                <input
                  id="name-filter"
                  name="name-filter"
                  type="search"
                  onChange={this.nameFilter}
                  defaultValue=""
                />
              </div>
              <div>
                <label htmlFor="club-filter">Club:</label>
                <Selector
                  id="club-filter"
                  name="club-filter"
                  onChange={this.clubFilter}
                  defaultValue={clubFilter}
                  options={club}
                />
              </div>
              {editable && [
                <div key={'toggle-hidden'}>
                  <Toggle
                    key="toggle-hidden"
                    {...bem('toggle-options')}
                    checked={showHidden}
                    id={'show-hidden-players'}
                    onChange={this.showHidden}
                    label={'Show Hidden Players'}
                  />
                </div>,
                <div key={'toggle-new'}>
                  <Toggle
                    key="toggle-new"
                    {...bem('toggle-options')}
                    checked={showOnlyNewPlayers}
                    id={'show-new-players'}
                    onChange={this.showOnlyNewPlayers}
                    label={'Show Only New Players'}
                  />
                </div>
              ]}
            </div>
          </div>
        }
        <table cellPadding={0} cellSpacing={0} { ...bem(null, type) }>
          <thead>
            {headerRow &&
              <tr {...bem('data-header')}>
                <th colSpan={8} style={{ textAlign: 'left' }}>{headerRow}</th>
              </tr>
            }
            <tr { ...bem('data-header')}>
              <th{ ...bem('meta', 'new')}>New</th>
              <th{ ...bem('meta', 'code')}>Code</th>
              <th{ ...bem('meta', 'pos')}>Position</th>
              <th{ ...bem('meta', 'player')}>Player</th>
              <th{ ...bem('meta', 'club')}>Club</th>
              { showStats && statCols.map((stat) => [
                <td key={stat} { ...bem('meta', 'stat')} >{stat}</td>,
                <td key={`${stat}-gw`} { ...bem('meta', 'stat')} ><sup>(gw)</sup></td>
              ])}
              { (showStats || showPoints) && [
                <td key={'points'} { ...bem('meta', 'stat')} >Points</td>,
                <td key={'points-gw'} { ...bem('meta', 'stat')} ><sup>(gw)</sup></td>
              ] }
              { (showPoints) &&
                <td key={'pos-points'} { ...bem('meta', 'stat')} >Pos Points</td>
              }
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
                  }))
                .sort(fieldSorter(['pos', 'name']))
                .map((originalPlayerData) => {
                  const player = playerUpdates[originalPlayerData._id] || originalPlayerData;
                  const isOnMyTeam = teamPlayers[player.code];
                  return (
                    <tr key={player.code} id={player.code} { ...bem('player', { selected: isOnMyTeam, new: !!player.new })}>
                      <td>
                        { player.new && <Svg markup={New} { ...bem('new-icon')} />}
                        { player.new && <span className="sr-only">new</span> }
                      </td>
                      <td>
                        { player.code }
                      </td>
                      <td>
                        {
                          editable
                            ? this.CellEditor({
                               player, originalPlayerData, attribute: 'pos', type: 'select'
                              })
                            : <div>{ player.pos }</div>
                        }
                      </td>
                      <td>
                        {
                          editable
                            ? this.CellEditor({
                               player, originalPlayerData, attribute: 'name', type: 'text'
                              })
                            : <a href="#" onClick={(e) => this.setShowFixtures({ e, player })}>{ player.name }</a>
                        }
                      </td>
                      <td>
                        <small>{
                          editable
                            ? this.CellEditor({
                               player, originalPlayerData, attribute: 'club', type: 'select'
                              })
                            : <div>{ player.club }</div>
                        }</small>
                      </td>
                      { showStats && statCols.map((stat) => [
                        <td key={stat} {...bem('stat')}>
                          {player.season[stat]}
                        </td>,
                        <td key={`${stat}-gw`} {...bem('stat')}>
                          <AdditionalPoints {...bem('additional', { highlight: extremeStat(player.gameWeek[stat]) })}>
                            {player.gameWeek[stat] || 0}
                          </AdditionalPoints>
                        </td>
                      ])}
                      { (showStats || showPoints) && [
                        <td key={'points'} {...bem('stat')}>
                          {player.season.points}
                        </td>,
                        <td key={'points-gw'} {...bem('stat')}>
                          <AdditionalPoints {...bem('additional', { highlight: extremeStat(player.gameWeek.points) })}>
                            {player.gameWeek.points || 0}
                          </AdditionalPoints>
                        </td>
                      ]}
                      { (showPoints && team) &&
                        <td key={'pos-points'} {...bem('stat')}>
                          {isOnMyTeam && team.season[isOnMyTeam.teamPos]}
                        </td>
                      }
                      { editable && (
                        <td >
                          <input
                            type="checkbox"
                            defaultChecked={player.isHidden}
                            onChange={(e) => this.onEdit(e.currentTarget.checked, player, 'isHidden', originalPlayerData)}
                          />
                        </td>
                      )}
                      { selectPlayer &&
                      <td >
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
