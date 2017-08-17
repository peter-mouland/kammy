/* eslint-disable arrow-body-style */
import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';

import Toggle from '../../Toggle/Toggle';
import Interstitial from '../../Interstitial/Interstitial';
import Errors from '../../Errors/Errors';
import Players from '../../Players/Players.component';
import fieldSorter from '../../../utils/field-sorter';

const log = debug('kammy:SeasonAdminOptions');

class SeasonAdminOptions extends React.Component {
  static propTypes = {
    season: PropTypes.object,
  }

  state = {
    showDivBreakdown: false
  }

  toggleLive = (e) => {
    const isLive = e.target.checked;
    this.props.updateSeason({ isLive, currentGW: 1 });
  }

  toggleDivBreakdown = (e) => {
    const showDivBreakdown = e.target.checked;
    this.setState({ showDivBreakdown });
  }

  fetchExternalStats = (e) => {
    e.preventDefault();
    this.props.fetchExternalStats(this.sourceEl.value);
  }

  saveGameWeekStats = (stats) => {
    this.props.saveGameWeekStats(stats);
  }

  decrementGameWeek = () => {
    this.props.updateSeason({ currentGW: this.props.season.currentGW - 1 });
  }

  incrementGameWeek = () => {
    this.props.updateSeason({ currentGW: this.props.season.currentGW + 1 });
  }

  saveSeasonStats = () => {
    this.props.updateSeason({ currentGW: this.props.season.currentGW + 1 });
    this.props.saveSeasonStats();
  }

  render() {
    const {
      statsErrors, statsLoading, statsSaving, statsSaved, statsSeasonSaving, savedSeason,
      season, teams, stats
    } = this.props;

    const { showDivBreakdown } = this.state;
    let shownHeader = '';
    return (
      <div data-test="admin-options--season">
        <div className="admin-options" >
          <Toggle
            checked={ season.isLive }
            id={`season-live--${season._id}`}
            className="admin-option"
            onChange={ this.toggleLive }
          >
            Season is Live?
          </Toggle>
          <div className="admin-option">
            Current GW:
            <span className="admin-option__value">{season.currentGW}</span>
          </div>
        </div>
        <div className="admin-options">
          <h3>Game Week Actions:</h3>
          <form className="admin-option" onSubmit={ this.fetchExternalStats }>
            <select name="stats-source" ref={(node) => { this.sourceEl = node; } }>
              <option value="external">Sky Sports</option>
              <option value="internal">Test Data</option>
            </select>
            <input type="submit" value="1. Fetch Stats" />
            { statsLoading ? <Interstitial small message="Loading stats"/> : null }
            { statsErrors.length ? <Errors errors={statsErrors} small/> : null }
          </form>
          <div className="admin-option">
            <button
              disabled={!stats}
              onClick={ () => this.saveGameWeekStats(stats) }
            >2. Save Game Week Stats</button>
            { statsSaving ? <Interstitial small message="Saving GameWeek"/> : null }
            <Toggle
              disabled={ !stats }
              checked={ showDivBreakdown }
              id={`showDivBreakdown-${season._id}`}
              className="admin-option"
              onChange={ this.toggleDivBreakdown }
            >
              Show Division Breakdown
            </Toggle>
          </div>
          <div className="admin-option">
            <button onClick={ this.saveSeasonStats } disabled={!statsSaved || savedSeason}>
              3. Increment Game Week + Update Season Stats
            </button>
            { statsSeasonSaving ? <Interstitial small message="Saving Season"/> : null }
          </div>
        </div>
        { stats && !showDivBreakdown ?
          <div className="admin-options" >
            <section >
              <Players
                players={ (Object.keys(stats)).map((key) => stats[key]) }
                type="admin"
                showStats
              />
            </section>
          </div>
          : null
        }
        { stats && showDivBreakdown ?
          <div className="admin-options" >
            <section >
              {teams
                .sort(fieldSorter(['division.name', 'user.name']))
                .map((team) => {
                  const row = (
                    <section key={team.user.name || team.user.email}>
                      {
                        shownHeader !== team.division.name
                          && <h3>{team.division.name}</h3>
                      }
                      <Players
                        headerRow={team.user.name || team.user.email}
                        hideOptions={true}
                        team={team}
                        players={ (Object.keys(stats)).map((key) => stats[key]) }
                        type="admin"
                        showPoints
                      />
                    </section>
                  );
                  shownHeader = team.division.name;
                  return row;
                })
              }
            </section>
          </div>
          : null
        }
      </div>
    );
  }
}

export default SeasonAdminOptions;
