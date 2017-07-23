import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';

import Toggle from '../../Toggle/Toggle';
import Interstitial from '../../Interstitial/Interstitial';
import Errors from '../../Errors/Errors';
import Players from '../../Players/Players.component';

const log = debug('kammy:SeasonAdminOptions');

class SeasonAdminOptions extends React.Component {
  static propTypes = {
    season: PropTypes.object,
  }

  toggleLive = (e) => {
    const isLive = e.target.checked;
    this.props.updateSeason({ isLive, currentGW: 1 });
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
    this.props.saveSeasonStats({ currentGW: this.props.season.currentGW + 1 });
  }

  render() {
    const {
      season, statsErrors, statsLoading, statsSaving, statsSaved, stats, statsSeasonSaving
    } = this.props;

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
          </div>
          <div className="admin-option">
            <button onClick={ this.saveSeasonStats } disabled={!statsSaved}>
              3. Increment Game Week + Update Season Stats
            </button>
            { statsSeasonSaving ? <Interstitial small message="Saving Season"/> : null }
          </div>
          <button className="admin-option" onClick={ this.decrementGameWeek } >
            -1 (test admin only)
          </button>
        </div>
        { stats ?
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
      </div>
    );
  }
}

export default SeasonAdminOptions;
