import React from 'react';
import PropTypes from 'prop-types';
import bemHelper from 'react-bem-helper';

import './adminOptions.scss';

const bem = bemHelper({ name: 'admin-options' });

class LeagueAdminOptions extends React.Component {

  static propTypes = {
    league: PropTypes.object,
  }

  render() {
    const { teams, children, ...props } = this.props;

    return (
      <div {...bem(null, 'top') } { ...props }>
        <div className="admin-option">
          <ul className="simple-list">
            { teams.map((team) => (
              <li key={team._id}>{team.name}
                <span className="user" >
                  {team.user.name}
                </span>
              </li>
            )) }
          </ul>
        </div>
        <div className="admin-option admin-option__btn">
          { children }
        </div>
      </div>
    );
  }
}

export default LeagueAdminOptions;
