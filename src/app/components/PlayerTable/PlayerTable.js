import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';
import bemHelper from 'react-bem-helper';

import { availablePositions } from '../../components/Positions/Positions';
import Selector from '../../components/Selector/Selector';

import './playerTable.scss';

const bem = bemHelper({ name: 'player-table' });
debug('kammy:myteam');

const extremeStat = (int) => int < -10 || int > 10;

export default class PlayerTable extends React.Component {
  static propTypes = {
    players: PropTypes.array,
    type: PropTypes.string,
    selectedPosition: PropTypes.string
  };

  static defaultProps = {
    players: [],
    selectedPosition: ''
  };

  clubs = [];

  constructor(props) {
    super(props);
    this.setClubs(props);
    this.state = {
      isSaving: false,
      nameFilter: '',
      posFilter: props.selectedPosition,
      clubFilter: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setClubs(nextProps);
    if (nextProps.selectedPosition !== this.state.selectedPosition) {
      this.setState({ posFilter: nextProps.selectedPosition });
    }
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
    this.clubs = (props.players.length) ? this.getClubs(props.players) : [];
  }

  getClubs = (players) => {
    const clubs = new Set();
    players.forEach((player) => clubs.add(player.club));
    return [...clubs.keys()].sort();
  }

  render() {
    const { players, type, className, selectPlayer, selectedPosition, showStats } = this.props;
    const { posFilter, clubFilter, nameFilter, statsOrPoints = 'stats', weeklyOrSeason = 'gameWeek' } = this.state;
    const clubs = this.clubs;
    const highlight = weeklyOrSeason === 'gameWeek';

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
              .map((player) => {
                const output = player[weeklyOrSeason][statsOrPoints];
                return (
                  <tr key={player.code} { ...bem('player')}>
                    <td { ...bem('meta')} >{ player.code }</td>
                    <td { ...bem('meta')} >{ player.pos }</td>
                    <td { ...bem('meta')} >{ player.name }</td>
                    <td { ...bem('meta')} >{ player.club }</td>
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
