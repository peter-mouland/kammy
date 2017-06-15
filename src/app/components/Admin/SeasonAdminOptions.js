import React from 'react';
import PropTypes from 'prop-types';

import Toggle from '../Toggle/Toggle';

import './adminOptions.scss';

class SeasonAdminOptions extends React.Component {

  static propTypes = {
    season: PropTypes.object,
  }

  onChange = (e) => {
    const isLive = e.target.checked;
    this.props.onChange(isLive);
  }

  fetchStats = (e) => {
    e.preventDefault();
    this.props.fetchStats(this.sourceEl.value);
  }

  render() {
    const {
      season, incrementGameWeek, onChange, stats, ...props // eslint-disable-line no-unused-vars
    } = this.props;

    return (
      <div { ...props } data-test="admin-options--season">
        <div className="admin-options" >
          <Toggle checked={ season.isLive }
                  id={`season-live--${season._id}`}
                  className="admin-option"
                  onChange={ this.onChange }
          >
            Season is Live?
          </Toggle>
          <div className="admin-option">
            Current GW:
            <span className="admin-option__value">{season.currentGW}</span>
            <button className="admin-option__value" onClick={ incrementGameWeek }>+1</button>
          </div>
          <div className="admin-option admin-option__btn">
            <form onSubmit={ this.fetchStats }>
              <select name="stats-source" ref={(node) => { this.sourceEl = node; } }>
                <option value="external">Sky Sports</option>
                <option value="internal">Test Data</option>
              </select>
              <input type="submit" value="Fetch Stats" />
            </form>
          </div>
        </div>
        { stats ?
          <div className="admin-options" >
            <ul >
              {(Object.keys(stats)).map((key) => (
                <li key={ key }>{stats[key].player} {stats[key].gw1}</li>
              ))}
            </ul>
          </div>
          : null
        }
      </div>
    );
  }
}

export default SeasonAdminOptions;
